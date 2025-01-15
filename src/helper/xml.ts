const xmlDecodeRE = /[<>&'"\x7F\x00-\x08\x0B-\x0C\x0E-\x1F]/

const EncodeDict = new Map<number, string>([
  [38, '&amp;'],
  [60, '&lt;'],
  [62, '&gt;'],
  [34, '&quot;'],
  [39, '&apos;'],
  [127, '']
])

/**
 * 编码特殊XML字符串
 * @param text - 需要编码的XML字符串
 * @description 主要防止xml注入攻击
 */
export function xmlEncode(text: string) {
  const regexResult = xmlDecodeRE.exec(text)
  if (!regexResult) return text

  let result = text.slice(0, regexResult.index)

  for (let i = regexResult.index; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    let escape = EncodeDict.get(charCode)

    if (escape === undefined) {
      if (
        charCode <= 31 &&
        (charCode <= 8 || (charCode >= 11 && charCode !== 13))
      ) {
        escape = ''
      } else {
        escape = text[i]
      }
    }
    result += escape
  }
  return result
}
