import { useTokens } from '@/hooks/useTokens'
import { useAppKitAccount } from '@reown/appkit/react'
import React, { useEffect, useMemo } from 'react'
import {
  useSprinterBalances,
  useSprinterChains
} from '@chainsafe/sprinter-react'
import { Chain } from '@chainsafe/sprinter-sdk'

export type ChainBalance = {
  chain: Chain
  balance: string
}

export type StructuredTokenData = Record<
  string,
  {
    name: string
    symbol: string
    decimals: number
    logoURI: string
    total: string
    chainBalances?: ChainBalance[]
  }
>

type ChainTokensContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type IChainTokensContext = {
  structuredTokenData: StructuredTokenData
  chains: Chain[]
  isLoading: boolean
  error: string | null
}

const ChainTokensContext = React.createContext<IChainTokensContext | undefined>(
  undefined
)

const ChainTokensContextProvider = ({ children }: ChainTokensContextProps) => {
  const { chains, getAvailableChains } = useSprinterChains()
  const { error, isLoading, tokens } = useTokens()
  const { address } = useAppKitAccount()
  // @ts-expect-error address is defined
  const { balances, getUserBalances } = useSprinterBalances(address ?? '')

  const structuredTokenData = useMemo(() => {
    const structuredRes: StructuredTokenData = {}

    Object.entries(balances.data ?? {}).forEach(([tokenId, balance]) => {
      const token = tokens.find((t) => t.symbol === tokenId)
      if (!token) return
      structuredRes[tokenId] = {
        ...token,
        total: balance.total,
        chainBalances: []
      }

      balance.balances.forEach((eachBalance) => {
        if (eachBalance.balance === '0') return

        const relevantChains = chains.data?.filter(
          (chain) => chain.chainID === eachBalance.chainId
        )

        relevantChains?.forEach((chain) => {
          structuredRes[tokenId].chainBalances?.push({
            chain,
            balance: eachBalance.balance
          })
        })
      })
    })

    return structuredRes
  }, [balances.data, chains.data, tokens])

  console.log('structuredTokenData', structuredTokenData)
  useEffect(() => {
    getAvailableChains()
  }, [getAvailableChains])

  useEffect(() => {
    getUserBalances()
  }, [getUserBalances])

  return (
    <ChainTokensContext.Provider
      value={{
        structuredTokenData,
        isLoading,
        error,
        chains: chains.error ? [] : (chains.data ?? [])
      }}
    >
      {children}
    </ChainTokensContext.Provider>
  )
}

const useChainTokens = () => {
  const context = React.useContext(ChainTokensContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a ChainTokensProvider')
  }
  return context
}

export { ChainTokensContextProvider, useChainTokens }
