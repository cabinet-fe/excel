interface TableColumn {
  name: string
  key: string
}

type TableRow = Record<string, string>

interface TableOptions {
  columns: TableColumn[]
  rows: TableRow[]
}

interface WorksheetOptions {
  table?: TableOptions

  rows?: (string | number | Date)[][]
}

export class Worksheet {
  constructor(name: string, options: WorksheetOptions) {
    this.name = name
    this.options = options
  }

  name: string
  options: WorksheetOptions
}
