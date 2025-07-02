import { SheetCell, type CellVal } from './cell'

export class SheetRow {
  values: CellVal[]
  cells: SheetCell[]

  constructor(values: CellVal[]) {
    this.values = values
    this.cells = values.map(v => new SheetCell(v))
  }

  getCell(index: number): SheetCell | undefined {
    return this.cells[index]
  }
}
