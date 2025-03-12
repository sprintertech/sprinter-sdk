import { formatBalance } from '@/utils'

type Props = {
  id: string
  logoURI: string
  symbol?: string
  isSelected: boolean
  amount?: string
  onSelect: (id: string) => void
  decimals?: number
  name: string
  withSymbol: boolean
  isDisabled?: boolean
}
export const ElementSelect = ({
  id,
  logoURI,
  symbol,
  isSelected,
  amount,
  decimals,
  onSelect,
  name,
  withSymbol,
  isDisabled = false
}: Props) => {
  return (
    <div
      className={`flex cursor-pointer items-center rounded-xl border border-slate-300 px-2 py-1.5 outline-none transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-100' : 'bg-white'
      } ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
      onClick={() => onSelect(id)}
    >
      <img className="mr-2 size-6" src={logoURI} alt={id} />
      <div className="flex flex-col overflow-hidden text-xs">
        <div className="w-full overflow-hidden text-ellipsis font-medium">
          {name}
        </div>
        {!!amount && !!decimals && (
          <div className="w-full overflow-hidden text-ellipsis font-light">
            {formatBalance(amount, decimals, 2)}{' '}
            {withSymbol && symbol ? symbol : ''}
          </div>
        )}
      </div>
    </div>
  )
}
