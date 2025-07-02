import type { CellVal, SheetCell } from './cell'
import { SheetRow } from './row'
import type { Undef } from '../helper/type'
import { parseAddress } from 'helper/address'
import { SheetTable, type SheetTableColumn, type SheetTableRow } from './table'

export interface TableOptions {
  columns: SheetTableColumn[]
  rows: SheetTableRow[]
}

interface MergedConfig {
  start: { r: number; c: number }
  end: { r: number; c: number }
}

interface WorksheetOptions {
  rows?: CellVal[][]

  mergedCells?: MergedConfig[]
}

export class Worksheet {
  constructor(name: string, options?: WorksheetOptions) {
    this.name = name
    this.options = options
    this.init()
  }

  name: string
  private options?: WorksheetOptions
  private rows: SheetRow[]
  private mergedCells: MergedConfig[] = []
  private table?: SheetTable

  init(): void {
    const { options } = this
    if (!options) return
    const { rows, mergedCells } = options
    if (rows) {
      this.rows = rows.map(v => new SheetRow(v))
    }
    if (mergedCells) {
      this.mergedCells = mergedCells
    }
  }

  getRow(index: number): Undef<SheetRow> {
    return this.rows[index]
  }

  getRows(start = 0, length?: number): SheetRow[] {
    return this.rows.slice(start, length)
  }

  getCell(address: string): Undef<SheetCell>
  getCell(rowIndex: number, colIndex: number): Undef<SheetCell>
  getCell(arg1: string | number, arg2?: number): Undef<SheetCell> {
    if (typeof arg1 === 'string') {
      const { c, r } = parseAddress(arg1)
      const row = this.getRow(r)
      if (!row) {
        throw new Error(`rowIndex ${r} not found`)
      }
      return row.getCell(c)
    } else {
      if (typeof arg2 !== 'number') {
        throw new Error('colIndex is required')
      }
      const row = this.getRow(arg1)
      if (!row) {
        throw new Error(`rowIndex ${arg1} not found`)
      }
      return row.getCell(arg2)
    }
  }

  mergeCells(config: string | MergedConfig): void {
    if (typeof config === 'string') {
      const [start, end] = config.split(':')
      if (!start || !end) {
        throw new Error('invalid range')
      }
      this.mergedCells.push({
        start: parseAddress(start),
        end: parseAddress(end)
      })
    } else {
      this.mergedCells.push(config)
    }
  }

  /**
   * 设置表格
   * - 已有的sheet配置会被清空以便于设置表格
   * @param table 表格
   */
  setTable(table: SheetTable): void {
    this.rows = []
    this.mergedCells = []
    this.table = table
  }

  insertRows(index: number, rows: Array<CellVal>[]): void {
    const newRows = rows.map(v => new SheetRow(v))
    this.rows = [
      ...this.rows.slice(0, index),
      ...newRows,
      ...this.rows.slice(index)
    ]
  }

  appendRows(rows: Array<CellVal>[]): void {
    this.insertRows(this.rows.length, rows)
  }

  removeRows(index: number, length: number): void {
    this.rows.splice(index, length)
  }
}

const sheet = new Worksheet('sheet1', {
  rows: [[1, 2, '3']]
})

const table = new SheetTable(sheet, {
  columns: [
    { name: 'a', key: 'a' },
    { name: 'b', key: 'b' }
  ],
  rows: [
    { a: 1, b: '2' },
    { a: 2, b: '4' }
  ]
})

sheet.setTable(table)

sheet.getRows().forEach(row => {
  row.values.forEach(v => {})
})
