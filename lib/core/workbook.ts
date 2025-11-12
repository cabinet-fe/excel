import { Worksheet } from './worksheet'
import { XLSX, type XLSXData } from './xlsx'

export class Workbook {
  name: string
  private sheets: Worksheet[] = []

  xlsx?: XLSX

  constructor(name: string) {
    this.name = name
  }

  addSheet(sheet: Worksheet): void {
    this.sheets.push(sheet)
  }

  getSheets(): Worksheet[] {
    return this.sheets
  }

  getSheet(index: number): Worksheet | undefined
  getSheet(name: string): Worksheet | undefined
  getSheet(id: number | string): Worksheet | undefined {
    if (typeof id === 'number') {
      return this.sheets[id]
    } else {
      return this.sheets.find(sheet => sheet.name === id)
    }
  }

  /** 读取xlsx文件 */
  async read(data: XLSXData): Promise<void> {
    if (!this.xlsx) {
      this.xlsx = new XLSX()
    }
    await this.xlsx.read(data)
  }

  /** 导出为xlsx文件 */
  async write(): Promise<void> {
    if (!this.xlsx) {
      this.xlsx = new XLSX()
    }
    await this.xlsx.write(this)
  }
}

const wb = new Workbook('test')

wb.write()
