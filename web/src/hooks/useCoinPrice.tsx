import { useCallback, useEffect, useState } from 'react'

const suportedTokens = ['BTC', 'ETH', 'WETH', 'USDT', 'USDC'] as const
export type SupportedTokens = (typeof suportedTokens)[number]
export type PriceInfo = {
  data: Record<SupportedTokens, { price: number }>
}

export const isSupportedToken = (token: string): token is SupportedTokens =>
  suportedTokens.includes(token as SupportedTokens)

const API_KEY = (import.meta.env.VITE_PRICE_API_KEY as string) || ''

export const priceToBigInt = (price: number) =>
  BigInt(Math.round(price * 10 ** 6)) / 10n ** 6n

export const useCoinPrice = () => {
  const [prices, setPrices] = useState<PriceInfo['data']>()

  const fetchCoinPrice = useCallback(async () => {
    const response = await fetch(
      `https://api.mobula.io/api/1/market/multi-data?symbols=${suportedTokens.join(',')}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: API_KEY
        }
      }
    )
    return (await response.json()) as unknown as PriceInfo
  }, [])

  const getUsdPrice = useCallback(
    (tokenId: string, amount: number | string) => {
      if (!prices || !tokenId) return '0'
      if (!isSupportedToken(tokenId)) {
        console.error(`getUsdPrice error: tokenId "${tokenId}" not supported.`)
        return '0'
      }

      const price = prices[tokenId].price ?? 0

      const roundedPrice = Math.round(Number(price))
      return (Number(amount) * roundedPrice).toFixed(2)
    },
    [prices]
  )

  useEffect(() => {
    fetchCoinPrice()
      .then(({ data }) => {
        setPrices(data)
      })
      .catch(console.error)
  }, [fetchCoinPrice])

  return { prices, getUsdPrice }
}
