import { DialogHeader, Dialog, DialogContent, DialogTitle } from '../ui/dialog'

import coin from '../../assets/coin.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChainTokens } from '@/context/ChainTokensContext'
import { formatBalance } from '@/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useSprinterTransfers } from '@chainsafe/sprinter-react'
import { useAppKitAccount } from '@reown/appkit/react'
import { Solution } from '@chainsafe/sprinter-sdk'
import { parseUnits } from 'ethers'
import { SendContent } from './SendContent'
import { useCoinPrice } from '@/hooks/useCoinPrice'
import { ElementSelect } from '../ElementSelect'
import { CircleCheck } from 'lucide-react'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const SendModal = ({ onOpenChange, open }: Props) => {
  const { structuredTokenData, chains } = useChainTokens()
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedDestinationChain, setSelectedDestinationChain] = useState<
    string | undefined
  >()
  const [amount, setAmount] = useState('')
  const {
    getPoolAssetOnDestination,
    solution: {
      data: solutionData,
      error: solutionError,
      loading: solutionLoading
    }
  } = useSprinterTransfers()
  const [requestedQuotes, setRequestedQuotes] = useState(false)
  const { address } = useAppKitAccount()
  const [receivedSolutions, setReceivedsolutions] = useState<Solution[] | null>(
    null
  )
  const { getUsdPrice } = useCoinPrice()
  const amountUSD = useMemo(() => {
    return getUsdPrice(selectedToken, amount)
  }, [amount, getUsdPrice, selectedToken])

  const possibleSendingTokens = useMemo(
    () => Object.keys(structuredTokenData),
    [structuredTokenData]
  )
  const [step, setStep] = useState<'getQuotes' | 'send' | 'success'>(
    'getQuotes'
  )

  useEffect(() => {
    if (!selectedToken) {
      const firstWithBalance = Object.entries(structuredTokenData).find(
        ([, data]) => data.total !== '0'
      )

      if (!firstWithBalance) return

      setSelectedToken(firstWithBalance[0])

      setSelectedDestinationChain(
        firstWithBalance[1]?.chainBalances?.[0].chain.chainID.toString()
      )
    }
  }, [possibleSendingTokens, selectedToken, structuredTokenData])

  const onSetMax = useCallback(() => {
    if (!selectedToken) return

    const val = formatBalance(
      structuredTokenData[selectedToken].total,
      structuredTokenData[selectedToken].decimals
    )
    setAmount(val)
  }, [selectedToken, structuredTokenData])

  const onGetQuote = useCallback(() => {
    if (
      !address ||
      !structuredTokenData[selectedToken].chainBalances?.[0] ||
      !selectedDestinationChain
    )
      return

    setRequestedQuotes(true)
    setReceivedsolutions(null)

    const gweiAmount = parseUnits(
      amount,
      structuredTokenData[selectedToken].decimals
    )
    getPoolAssetOnDestination({
      account: address,
      destinationChain: Number(selectedDestinationChain),
      amount: gweiAmount,
      token: selectedToken
    })
  }, [
    address,
    amount,
    getPoolAssetOnDestination,
    selectedDestinationChain,
    selectedToken,
    structuredTokenData
  ])

  useEffect(() => {
    if (!solutionData || !Array.isArray(solutionData) || !requestedQuotes)
      return

    setStep('send')
    setReceivedsolutions(solutionData)
  }, [receivedSolutions, requestedQuotes, solutionData])

  const onGoBack = useCallback(() => {
    setStep('getQuotes')
    setRequestedQuotes(false)
    setReceivedsolutions(null)
  }, [])

  if (!selectedToken) return

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="mr-3 inline-flex h-10 items-center justify-center gap-2.5 overflow-hidden rounded-[999px] border border-[#e1e3e9] bg-white p-2.5">
              <img className="relative size-5 overflow-hidden" src={coin} />{' '}
            </div>
            {step === 'send' ? 'Confirm quotes' : 'Send balance'}
          </DialogTitle>
          {step === 'getQuotes' && (
            <>
              <div className="pt-6 text-sm">Token</div>
              <div className="grid grid-cols-4 gap-4">
                {possibleSendingTokens.map((token) => (
                  <ElementSelect
                    key={token}
                    id={token}
                    logoURI={structuredTokenData[token].logoURI}
                    symbol={structuredTokenData[token].symbol}
                    isSelected={selectedToken === token}
                    amount={structuredTokenData[token].total}
                    decimals={structuredTokenData[token].decimals}
                    onSelect={setSelectedToken}
                    withSymbol={false}
                    name={structuredTokenData[token].symbol}
                    isDisabled={structuredTokenData[token].total === '0'}
                  />
                ))}
              </div>
              <div className="grid w-full items-center gap-1.5 pt-6">
                <Label className="text-sm font-normal" htmlFor="amount">
                  Amount
                </Label>
                <div className="flex h-20 items-center rounded-3xl border p-2">
                  <div>
                    <Input
                      className="border-none shadow-none focus-visible:ring-0 md:text-3xl"
                      id="amount"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="pl-3 text-sm font-light text-gray-400">
                      ${amountUSD}
                    </div>
                  </div>
                  <div
                    onClick={onSetMax}
                    className="mr-4 cursor-pointer font-light"
                  >
                    MAX
                  </div>
                </div>
              </div>
              <div className="pt-6 text-sm">Destination Chain</div>
              <div className="grid grid-cols-3 gap-4">
                {chains.map(({ chainID, logoURI, name }) => {
                  const amountChains = structuredTokenData[
                    selectedToken
                  ].chainBalances?.find(
                    ({ chain }) => chain.chainID === chainID
                  )?.balance

                  return (
                    <ElementSelect
                      key={chainID}
                      id={chainID.toString()}
                      logoURI={logoURI}
                      symbol={structuredTokenData[selectedToken].symbol}
                      decimals={structuredTokenData[selectedToken].decimals}
                      name={name}
                      amount={amountChains ?? '0'}
                      withSymbol={true}
                      isSelected={
                        selectedDestinationChain === chainID.toString()
                      }
                      onSelect={setSelectedDestinationChain}
                    />
                  )
                })}
              </div>
              {solutionError && (
                <div className="pt-6">
                  <div className="text-sm text-red-500">
                    Error: {solutionError}
                  </div>
                </div>
              )}
              <div className="pt-6">
                <Button
                  onClick={onGetQuote}
                  className="w-full"
                  variant="secondary"
                  disabled={solutionLoading}
                  loading={solutionLoading}
                >
                  Get Quotes
                </Button>
              </div>
            </>
          )}
          {step === 'send' && !!receivedSolutions && (
            <>
              <SendContent
                solutions={receivedSolutions}
                token={selectedToken}
                onSuccess={() => setStep('success')}
              />
              <div className="mt-4 text-center">
                <span
                  onClick={onGoBack}
                  className="cursor-pointer text-sm text-gray-400"
                >
                  Go Back
                </span>
              </div>
            </>
          )}
          {step === 'success' && (
            <>
              <div className="">
                <div className="flex flex-col items-center justify-center pt-6">
                  <CircleCheck className="text-6xl text-green-500" size={64} />
                  All done!
                </div>
              </div>
              <div className="pt-6">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                  variant="secondary"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
