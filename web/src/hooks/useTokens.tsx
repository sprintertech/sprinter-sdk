import { useSprinterTokens } from '@chainsafe/sprinter-react'
import { useMemo } from 'react'

// Nt provided by Sprinter in the useSprinterTokens
const ETH = {
  name: 'ethereum',
  decimals: 18,
  symbol: 'ETH',
  logoURI: 'https://scan.buildwithsygma.com/assets/icons/evm.svg',
  addresses: []
}

export const useTokens = () => {
  const {
    tokens: { data, error, loading }
  } = useSprinterTokens()

  const tokens = useMemo(() => {
    return (data ?? []).concat(ETH)
  }, [data])

  return {
    tokens,
    isLoading: loading,
    error: error
  }
}
