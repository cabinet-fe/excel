import { xmlEncode } from '../helper/xml'

// constants
const OPEN_ANGLE = '<'
const CLOSE_ANGLE = '>'
const OPEN_ANGLE_SLASH = '</'
const CLOSE_SLASH_ANGLE = '/>'

function pushAttribute(xml: string[], name: string, value: any) {
  if (value === undefined) return
  xml.push(`${name}="${xmlEncode(String(value))}"`)
}

function pushAttributes(xml: string[], attributes: Record<string, any>) {
  if (attributes) {
    const temp: string[] = []
    Object.entries(attributes).forEach(([name, value]) => {
      if (value === undefined) return
      pushAttribute(temp, name, value)
    })
    xml.push(temp.join(' '))
  }
}

export class XMLStream {
  /** 标准文档属性 */
  static StdDocAttributes = {
    version: '1.0',
    encoding: 'UTF-8',
    standalone: 'yes'
  }

  #xml: string[] = []
  /**
   * 栈，用于存储没有闭合的节点，空栈标识节点都已经闭合了
   */
  #stack: string[] = []
  /** 回滚栈 */
  #rollbacks: Array<{
    xml: number
    stack: number
    leaf: boolean
    open: boolean
  }> = []

  #open = false
  #leaf = false

  /** 栈顶元素 */
  get tos() {
    return this.#stack.length ? this.#stack[this.#stack.length - 1] : undefined
  }

  /** 游标 */
  get cursor() {
    return this.#xml.length
  }

  openXml(docAttributes: Record<string, any>) {
    const xml = this.#xml
    xml.push('<?xml')
    pushAttributes(xml, docAttributes)
    xml.push('?>\n')
  }

  openNode(name: string, attributes: Record<string, any>) {
    const parent = this.tos
    const xml = this.#xml
    if (parent && this.#open) {
      xml.push(CLOSE_ANGLE)
    }

    this.#stack.push(name)

    // start streaming node
    xml.push(OPEN_ANGLE)
    xml.push(name)
    pushAttributes(xml, attributes)
    this.#leaf = true
    this.#open = true
  }

  addAttribute(name: string, value: any) {
    if (!this.#open) {
      throw new Error('Cannot write attributes to node if it is not open')
    }
    if (value !== undefined) {
      pushAttribute(this.#xml, name, value)
    }
  }

  addAttributes(attrs: Record<string, any>) {
    if (!this.#open) {
      throw new Error('Cannot write attributes to node if it is not open')
    }
    pushAttributes(this.#xml, attrs)
  }

  writeText(text: any) {
    if (text === undefined) return
    const xml = this.#xml
    if (this.#open) {
      xml.push(CLOSE_ANGLE)
      this.#open = false
    }
    this.#leaf = false
    xml.push(xmlEncode(String(text)))
  }

  writeXml(xml: string) {
    if (this.#open) {
      this.#xml.push(CLOSE_ANGLE)
      this.#open = false
    }
    this.#leaf = false
    this.#xml.push(xml)
  }

  closeNode() {
    const node = this.#stack.pop()!
    const xml = this.#xml
    if (this.#leaf) {
      xml.push(CLOSE_SLASH_ANGLE)
    } else {
      xml.push(OPEN_ANGLE_SLASH)
      xml.push(node)
      xml.push(CLOSE_ANGLE)
    }
    this.#open = false
    this.#leaf = false
  }

  leafNode(name: string, attributes: Record<string, any>, text?: any) {
    this.openNode(name, attributes)
    this.writeText(text)
    this.closeNode()
  }

  closeAll() {
    while (this.#stack.length) {
      this.closeNode()
    }
  }

  addRollback() {
    this.#rollbacks.push({
      xml: this.#xml.length,
      stack: this.#stack.length,
      leaf: this.#leaf,
      open: this.#open
    })
    return this.cursor
  }

  commit() {
    this.#rollbacks.pop()
  }

  rollback() {
    const r = this.#rollbacks.pop()!
    if (this.#xml.length > r.xml) {
      this.#xml.splice(r.xml, this.#xml.length - r.xml)
    }
    if (this.#stack.length > r.stack) {
      this.#stack.splice(r.stack, this.#stack.length - r.stack)
    }
    this.#leaf = r.leaf
    this.#open = r.open
  }

  get xml() {
    this.closeAll()
    return this.#xml.join('')
  }
}
