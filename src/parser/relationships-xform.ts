import { BaseXForm } from './base-xform'
import { RelationshipXForm } from './relationship-xform'
import { XMLStream } from './xml-stream'

export class RelationshipsXForm extends BaseXForm {
  constructor() {
    super()
    this.map = {
      Relationship: new RelationshipXForm()
    }
  }

  parser?: BaseXForm

  render(xmlStream: XMLStream, model: any): void {
    xmlStream.openXml(XMLStream.StdDocAttributes)
    xmlStream.openNode(
      'Relationships',
      RelationshipsXForm.RELATIONSHIPS_ATTRIBUTES
    )

    model.forEach(relationship => {
      this.map?.Relationship?.render(xmlStream, relationship)
    })

    xmlStream.closeNode()
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node)
      return true
    }
    switch (node.name) {
      case 'Relationships':
        this.model = []
        return true
      default:
        this.parser = this.map?.[node.name]
        if (this.parser) {
          this.parser.parseOpen(node)
          return true
        }
        throw new Error(
          `Unexpected xml node in parseOpen: ${JSON.stringify(node)}`
        )
    }
  }

  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text)
    }
  }

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.model?.push(this.parser.model)
        this.parser = undefined
      }
      return true
    }
    switch (name) {
      case 'Relationships':
        return false
      default:
        throw new Error(`Unexpected xml node in parseClose: ${name}`)
    }
  }

  /** 关系属性 */
  static RELATIONSHIPS_ATTRIBUTES = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships'
  }
}
