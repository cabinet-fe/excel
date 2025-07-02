export type CellVal = string | number | Date | null

export class SheetCell {
  v: CellVal

  constructor(v: CellVal) {
    this.v = v
  }
}
