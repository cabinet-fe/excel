import { BaseXForm } from './base-xform'
import type { XMLStream } from './xml-stream'

export class RelationshipXForm extends BaseXForm {
  render(xmlStream: XMLStream, model: any): void {
    xmlStream.leafNode('Relationship', model)
  }

  parseOpen(node) {
    switch (node.name) {
      case 'Relationship':
        this.model = node.attributes
        return true
      default:
        return false
    }
  }

  parseText() {}

  parseClose() {
    return false
  }
}
