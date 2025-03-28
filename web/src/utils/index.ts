export { formatBalance } from './formatBalance'

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}
