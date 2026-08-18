export const convertDecimalToHex = (decimal: number | string | undefined): string | undefined => {
  if (decimal === undefined) return undefined
  const num = typeof decimal === 'string' ? parseInt(decimal) : decimal
  if (isNaN(num)) return undefined
  return '0x' + num.toString(16)
}
