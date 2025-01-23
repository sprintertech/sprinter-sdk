import { formatUnits } from 'ethers'

export function formatBalance(
  amount: string,
  decimals: number,
  fractionDigits = 4
): string {
  const value = formatUnits(BigInt(amount), decimals)
  const [integerPart, fractionalValue = ''] = value.split('.')

  return (
    integerPart +
    '.' +
    fractionalValue.padEnd(fractionDigits, '0').substring(0, fractionDigits)
  )
}
