import { useSprinterTokens } from '@chainsafe/sprinter-react'
import { useMemo } from 'react'

export const useTokens = () => {
  const {
    tokens: { data, error, loading }
  } = useSprinterTokens()

  const tokens = useMemo(() => {
    return (data ?? []).concat({
      name: 'ethereum',
      decimals: 18,
      symbol: 'ETH',
      logoURI: 'https://scan.buildwithsygma.com/assets/icons/evm.svg',
      addresses: []
    })
  }, [data])

  return {
    tokens,
    isLoading: loading,
    error: error
  }
}
