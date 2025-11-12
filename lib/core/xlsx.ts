import JSZip from 'jszip'
import type { Workbook } from './workbook'

export type XLSXData = Blob | ArrayBuffer | Uint8Array

export class XLSX {
  /**
   * 读取xlsx文件
   * @param data 文件数据
   */
  async read(data: XLSXData): Promise<void> {
    await JSZip.loadAsync(data)
  }

  async write(workbook: Workbook): Promise<void> {}
}
