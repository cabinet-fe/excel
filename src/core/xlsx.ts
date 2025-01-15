import { Parser } from '../parser'
import { Workbook } from './workbook'
import { loadAsync } from 'jszip'

export class XLSX {
  workbook: Workbook

  constructor() {
    this.workbook = new Workbook()
  }

  static async load(buffer: ArrayBuffer) {
    const model = {
      worksheets: [],
      worksheetHash: {},
      worksheetRels: [],
      themes: {},
      media: [],
      mediaIndex: {},
      drawings: {},
      drawingRels: {},
      comments: {},
      tables: {},
      vmlDrawings: {}
    }

    const zip = await loadAsync(buffer)

    for (const entry of Object.values(zip.files)) {
      if (entry.dir) continue
      const entryName = entry.name[0] === '/' ? entry.name.slice(1) : entry.name

      if (
        entryName.match(/xl\/media\//) ||
        entryName.match(/xl\/theme\/([a-zA-Z0-9]+)[.]xml/)
      ) {
        const stream = new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(chunk)
          }
        })

        const buffer = await entry.async('arraybuffer')
        const writer = stream.writable.getWriter()
        writer.write(buffer)
        writer.close()

        await Parser.parse(entryName, stream)
      } else {
        const stream = new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(chunk)
          }
        })

        const buffer = await entry.async('arraybuffer')

        // 将buffer转换为xml字符串
        const content = new TextDecoder().decode(buffer)

        const chunkSize = 16 * 1024

        const writer = stream.writable.getWriter()
        for (let i = 0; i < content.length; i += chunkSize) {
          writer.write(content.substring(i, i + chunkSize))
        }
        writer.close()

        await Parser.parse(entryName, stream)
      }
    }
  }
}
