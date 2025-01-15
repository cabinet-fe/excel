import { XMLStream } from './xml-stream'

export abstract class BaseXForm {
  model: null | Record<string, any> = null

  map?: Record<string, BaseXForm>

  constructor() {}

  /** 将模型转化为xml */
  abstract render(xmlStream: XMLStream, model: any): void

  abstract parseOpen(node: any): boolean

  abstract parseText(text: string): void

  abstract parseClose(name: any): boolean

  reset() {
    // 确保解析不会泄漏到下一次迭代
    this.model = null
    // 也清空map里面的数据
    this.map && Object.values(this.map).forEach(form => form.reset())
  }

  mergeModel(obj: Record<string, any>) {
    this.model = Object.assign(this.model ?? {}, obj)
  }

  async parse(saxParser) {
    for await (const events of saxParser) {
      for (const { eventType, value } of events) {
        if (eventType === 'opentag') {
          this.parseOpen(value)
        } else if (eventType === 'text') {
          this.parseText(value)
        } else if (eventType === 'closetag') {
          if (!this.parseClose(value.name)) {
            return this.model
          }
        }
      }
    }
    return this.model
  }

  async parseStream(stream: TransformStream) {
    return this.parse(parseSax(stream))
  }

  get xml() {
    // convenience function to get the xml of this.model
    // useful for manager types that are built during the prepare phase
    return this.toXml(this.model)
  }

  toXml(model) {
    const xmlStream = new XMLStream()
    this.render(xmlStream, model)
    return xmlStream.xml
  }

  static toAttribute(value, dflt, always = false) {
    if (value === undefined) {
      if (always) {
        return dflt
      }
    } else if (always || value !== dflt) {
      return value.toString()
    }
    return undefined
  }

  static toStringAttribute(value, dflt, always = false) {
    return BaseXForm.toAttribute(value, dflt, always)
  }

  static toStringValue(attr, dflt) {
    return attr === undefined ? dflt : attr
  }

  static toBoolAttribute(value, dflt, always = false) {
    if (value === undefined) {
      if (always) {
        return dflt
      }
    } else if (always || value !== dflt) {
      return value ? '1' : '0'
    }
    return undefined
  }

  static toBoolValue(attr, dflt) {
    return attr === undefined ? dflt : attr === '1'
  }

  static toIntAttribute(value, dflt, always = false) {
    return BaseXForm.toAttribute(value, dflt, always)
  }

  static toIntValue(attr, dflt) {
    return attr === undefined ? dflt : parseInt(attr, 10)
  }

  static toFloatAttribute(value, dflt, always = false) {
    return BaseXForm.toAttribute(value, dflt, always)
  }

  static toFloatValue(attr, dflt) {
    return attr === undefined ? dflt : parseFloat(attr)
  }
}
