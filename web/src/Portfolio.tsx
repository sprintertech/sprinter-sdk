import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatBalance } from './utils'
import arrow from './assets/arrow.svg'
import sweep from './assets/sweep.svg'
import { SweepModal } from '@/components/SweepModal'
import { Chains } from './components/Chains'
import { useChainTokens } from './context/ChainTokensContext'
import { SendModal } from './components/SendModal/SendModal'
import {
  isSupportedToken,
  priceToBigInt,
  useCoinPrice
} from './hooks/useCoinPrice'
import CountUp from 'react-countup'

export const Portofolio = () => {
  const [sweepModalOpen, setSweepModalOpen] = useState(false)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [tokenToSweep, setTokenToSweep] = useState('')
  const { error, isLoading, structuredTokenData } = useChainTokens()
  const { prices } = useCoinPrice()
  const amountUSD = useMemo(() => {
    if (!prices || isLoading || !structuredTokenData) return 0

    let totalUSD = 0n

    Object.entries(structuredTokenData).forEach(
      ([tokenId, { total, decimals }]) => {
        const price = isSupportedToken(tokenId) ? prices[tokenId]?.price : 0

        totalUSD +=
          (BigInt(total) * priceToBigInt(price)) / 10n ** BigInt(decimals)
      }
    )

    return totalUSD
  }, [isLoading, prices, structuredTokenData])

  if (isLoading) return <div>Loading tokens...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="mt-12 w-full px-48">
      <div className="text-lg">Balance:</div>
      <div className="text-4xl font-semibold">
        $<CountUp end={Number(amountUSD.toString())} />
      </div>
      <div className="mb-14 mt-8 h-px w-full bg-separator-gradient"></div>
      <div className="pb-8 pr-2">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-2xl">Portfolio:</div>
          <div className="col-start-4">
            <Button
              variant={'secondary'}
              onClick={() => setSendModalOpen(true)}
            >
              Send tokens
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 px-4">
        <div className="flex items-end text-sm font-medium">
          Asset <img src={arrow} />
        </div>
        <div className="flex items-end text-sm font-medium">
          Total balance <img src={arrow} />
        </div>
        <div className="flex items-end text-sm font-medium">
          Distribution <img src={arrow} />
        </div>
        <div />
        {Object.entries(structuredTokenData).map(
          ([tokenId, { symbol, decimals, logoURI, chainBalances, total }]) => {
            return (
              <div
                key={tokenId}
                className="col-span-4 grid grid-cols-subgrid gap-4"
              >
                <div className="flex h-12 items-center">
                  <img className="mr-2 w-6" src={logoURI} alt={symbol} />
                  {symbol}
                </div>
                <div className="flex items-center">
                  {formatBalance(total, decimals)} {symbol}
                </div>
                {chainBalances && chainBalances.length > 0 && (
                  <Chains tokenId={tokenId} />
                )}
                <div className="flex items-center">
                  {total !== '0' && (
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setSweepModalOpen(true)
                        setTokenToSweep(tokenId)
                      }}
                    >
                      <img src={sweep} /> Sweep
                    </Button>
                  )}
                </div>
              </div>
            )
          }
        )}
      </div>
      <SweepModal
        open={sweepModalOpen}
        onOpenChange={(open) => {
          setSweepModalOpen(open)
          if (!open) setTokenToSweep('')
        }}
        tokenId={tokenToSweep}
        structuredTokenData={structuredTokenData}
      />
      <SendModal
        open={sendModalOpen}
        onOpenChange={(open) => {
          setSendModalOpen(open)
        }}
      />
    </div>
  )
}
