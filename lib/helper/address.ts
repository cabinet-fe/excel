// A1 => { col: 0, row: 0 }
// B2 => { col: 1, row: 1 }
// AA1 => { col: 26, row: 0 }
// BA1 => { col: 52, row: 0 }
// ...

const ADDRESS_RE = /^([A-Z]+)(\d+)$/

export function parseAddress(address: string): {
  c: number
  r: number
} {
  const matched = address.match(ADDRESS_RE)

  if (!matched || matched.length !== 3) {
    throw new Error(`invalid address: ${address}`)
  }
  const [, colStr, rowStr] = matched as [string, string, string]

  let c = -1
  for (let i = 0; i < colStr.length; i++) {
    const charIndex = colStr.charCodeAt(i) - 64
    c = c + charIndex * 26 ** (colStr.length - i - 1)
  }

  const r = +rowStr - 1
  return { c, r }
}
