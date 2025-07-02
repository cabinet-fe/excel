import type { Worksheet } from './worksheet'

export interface SheetTableColumn {
  name: string
  key: string
  width?: number
}

export type SheetTableRow = Record<string, any>

export interface TableOptions {
  columns: SheetTableColumn[]
  rows: SheetTableRow[]
}

export class SheetTable {
  private options: TableOptions
  private sheet: Worksheet

  constructor(sheet: Worksheet, options: TableOptions) {
    this.sheet = sheet
    this.options = options
  }

  getColumns(): SheetTableColumn[] {
    return this.options.columns
  }

  getRows(): SheetTableRow[] {
    return this.options.rows
  }

  insertRows(index: number, rows: SheetTableRow[]): void {
    const { columns } = this.options
    this.sheet.insertRows(
      index,
      rows.map(row => columns.map(col => row[col.key] ?? null))
    )
  }

  appendRows(rows: SheetTableRow[]): void {
    this.insertRows(this.options.rows.length, rows)
  }
}
