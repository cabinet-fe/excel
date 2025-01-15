// export type ParserType =
//   | '_rels/.rels'
//   | 'xl/workbook.xml'
//   | 'xl/_rels/workbook.xml.rels'
//   | 'xl/sharedStrings.xml'
//   | 'xl/styles.xml'
//   | 'docProps/app.xml'
//   | 'docProps/core.xml'

const Parsers: Record<string, Function> = {
  '_rels/.rels': () => {},
  'xl/workbook.xml': () => {},
  'xl/_rels/workbook.xml.rels': () => {},
  'xl/sharedStrings.xml': () => {},
  'xl/styles.xml': () => {},
  'docProps/app.xml': () => {},
  'docProps/core.xml': () => {},
  default() {}
}

export const Parser = {
  async parse(type: string, stream: TransformStream) {
    const parser = Parsers[type] ?? Parsers.default

    return parser(stream)
  }
}
