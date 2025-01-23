import { DialogHeader, Dialog, DialogContent, DialogTitle } from './ui/dialog'

import sweep from '../assets/sweep.svg'
import { useTokens } from '@/hooks/useTokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  StructuredTokenData,
  useChainTokens
} from '@/context/ChainTokensContext'
import { ElementSelect } from './ElementSelect'
import { Button } from './ui/button'
import { formatBalance } from '@/utils'
import {
  isSupportedToken,
  priceToBigInt,
  useCoinPrice
} from '@/hooks/useCoinPrice'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Solution, Sprinter } from '@chainsafe/sprinter-sdk'
import { BASE_URL } from '@/App'
import { useEthers } from '@/context/EthersContext'
import { CircleCheck } from 'lucide-react'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
  tokenId?: string
  structuredTokenData: StructuredTokenData
}

export const SweepModal = ({
  onOpenChange,
  open,
  tokenId,
  structuredTokenData
}: Props) => {
  const [isDone, setIsDone] = useState(false)
  const { chainId: currentChainId } = useAppKitNetwork()
  const { ethersProvider, signer } = useEthers()
  const { chains } = useChainTokens()
  const sprinter = useMemo(() => new Sprinter({ baseUrl: BASE_URL }), [])
  const { address } = useAppKitAccount()
  const [sweepingSolution, setSweepingSolution] = useState<
    Solution[] | undefined
  >()
  const [sweepError, setSweepError] = useState<string | undefined>()
  const [sweepLoading, setSweepLoading] = useState(false)
  const { tokens } = useTokens()
  const { prices } = useCoinPrice()
  const [selectedSourceChains, setSelectedSourceChains] = useState<string[]>([])
  const [destinationChain, setDestinationChain] = useState<number | undefined>()

  const selectedToken = useMemo(() => {
    return tokens.find((token) => token.symbol === tokenId)
  }, [tokenId, tokens])
  const totalAmount = useMemo(() => {
    if (!tokenId || !structuredTokenData[tokenId].chainBalances) return 0n

    let res = 0n
    structuredTokenData[tokenId].chainBalances
      .filter((c) => selectedSourceChains.includes(c.chain.chainID.toString()))
      .forEach((c) => {
        res += BigInt(c.balance)
      })

    return res
  }, [selectedSourceChains, structuredTokenData, tokenId])

  const totalAmountUSD = useMemo(() => {
    if (totalAmount === 0n || !tokenId || !prices || !selectedToken) return 0
    const price = isSupportedToken(tokenId) ? prices[tokenId]?.price : 0

    return (
      (BigInt(totalAmount) * priceToBigInt(price)) /
      10n ** BigInt(selectedToken?.decimals)
    )
  }, [totalAmount, tokenId, prices, selectedToken])

  const possibleSweepingChains = useMemo(
    () =>
      tokenId
        ? structuredTokenData[tokenId].chainBalances?.map((c) => c.chain)
        : [],
    [structuredTokenData, tokenId]
  )

  useEffect(() => {
    if (!destinationChain) {
      setDestinationChain(chains[0].chainID)
    }
  }, [chains, destinationChain, possibleSweepingChains])

  useEffect(() => {
    if (!selectedToken || !address || !tokenId || !destinationChain) return

    setSweepError(undefined)
    setSweepingSolution(undefined)
    setSweepLoading(true)

    sprinter
      .sweep({
        account: address,
        destinationChain: destinationChain,
        token: tokenId,
        sourceChains: selectedSourceChains.map((c) => Number(c))
      })
      .then((res) => {
        if (Array.isArray(res)) {
          setSweepingSolution(res)
        } else {
          setSweepError(res.error)
        }
      })
      .catch(console.error)
      .finally(() => setSweepLoading(false))
  }, [
    address,
    destinationChain,
    possibleSweepingChains,
    selectedSourceChains,
    selectedToken,
    sprinter,
    tokenId
  ])

  useEffect(() => {
    setSelectedSourceChains(
      possibleSweepingChains?.map((c) => c.chainID.toString()) ?? []
    )
  }, [possibleSweepingChains])

  const onSweep = useCallback(async () => {
    if (!sweepingSolution || sweepingSolution.length === 0) {
      console.error('No sweep solution')
      return
    }

    if (!signer || !ethersProvider) return

    setSweepLoading(true)
    for (const solution of sweepingSolution) {
      if (currentChainId !== solution.sourceChain) {
        const bigIntChainId = BigInt(solution.sourceChain)
        await ethersProvider.send('wallet_switchEthereumChain', [
          {
            chainId: `0x${bigIntChainId.toString(16)}`
          }
        ])
      }

      if (solution.approvals && solution.approvals.length > 0) {
        for (const approval of solution.approvals) {
          console.log('Requesting approval:', approval)

          const { to, gasLimit, data, from, chainId, value } = approval
          await signer
            .sendTransaction({
              to,
              gasLimit: BigInt(gasLimit),
              data: data as `0x${string}`,
              from,
              chainId,
              value: BigInt(value)
            })
            .then(async (receipt) => {
              console.log('now waiting for approval', receipt.blockHash)
              await receipt.wait()
            })
            .catch(console.error)
        }
      }

      console.log('Sending tx:', solution)

      const { to, gasLimit, data, from, value, chainId } = solution.transaction
      signer
        .sendTransaction({
          to,
          gasLimit: BigInt(gasLimit),
          data: data as `0x${string}`,
          from,
          chainId,
          value: BigInt(value)
        })
        .then(async (receipt) => {
          await receipt.wait()
          console.log('now waiting', receipt.blockHash)
          setIsDone(true)
        })
        .catch(console.error)
        .finally(() => {
          setSweepLoading(false)
        })
    }
  }, [currentChainId, ethersProvider, signer, sweepingSolution])

  useEffect(() => {
    if (selectedSourceChains.length === 0) {
      setSweepError('You must select at least one source chain')
    }
  }, [selectedSourceChains.length, sweepError])

  if (!selectedToken) return

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="mr-3 inline-flex h-10 items-center justify-center gap-2.5 overflow-hidden rounded-[999px] border border-[#e1e3e9] bg-white p-2.5">
              <img className="relative size-5 overflow-hidden" src={sweep} />{' '}
            </div>
            Sweep balance
          </DialogTitle>
          {isDone && (
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
          {!isDone && (
            <>
              <div className="pt-4 text-sm font-normal">Token</div>
              <div className="flex items-center">
                <img
                  className="mr-2 w-6"
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                />
                {selectedToken.symbol}
              </div>
              <div className="pt-6 text-sm font-normal">Sweeping from</div>
              <div className="grid grid-cols-3 gap-4">
                {possibleSweepingChains?.map((chain) => {
                  const amount =
                    structuredTokenData[
                      selectedToken.symbol
                    ].chainBalances?.find(
                      (c) => c.chain.chainID === chain.chainID
                    )?.balance ?? '0'
                  return (
                    <ElementSelect
                      key={chain.chainID}
                      id={chain.chainID.toString()}
                      logoURI={chain.logoURI}
                      isSelected={selectedSourceChains.includes(
                        chain.chainID.toString()
                      )}
                      amount={amount}
                      decimals={selectedToken.decimals}
                      onSelect={(id) => {
                        if (selectedSourceChains.includes(id)) {
                          setSelectedSourceChains((prev) =>
                            prev.filter((c) => c !== id)
                          )
                        } else {
                          setSelectedSourceChains((prev) => [...prev, id])
                        }
                      }}
                      symbol={selectedToken.symbol}
                      withSymbol={true}
                      name={chain.name}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between pt-6">
                <div className="text-sm font-normal">Total amount</div>
                <div className="flex flex-col">
                  <div className="text-right text-sm font-normal">
                    {formatBalance(
                      totalAmount.toString(),
                      selectedToken.decimals,
                      2
                    )}{' '}
                    {selectedToken.symbol}
                  </div>
                  <div className="text-right text-sm font-light text-gray-500">
                    ${totalAmountUSD} USD
                  </div>
                </div>
              </div>
              <div className="text-sm font-normal">Destination Chain</div>
              <div className="grid grid-cols-3 gap-4">
                {chains?.map((chain) => {
                  return (
                    <ElementSelect
                      key={chain.chainID}
                      id={chain.chainID.toString()}
                      logoURI={chain.logoURI}
                      isSelected={destinationChain === chain.chainID}
                      onSelect={(id) => {
                        setDestinationChain(Number(id))
                      }}
                      withSymbol={false}
                      name={chain.name}
                    />
                  )
                })}
              </div>
              {sweepError && (
                <div className="pt-6">
                  <div className="text-sm text-red-500">{sweepError}</div>
                </div>
              )}
              <div className="pt-6">
                <Button
                  onClick={() => {
                    onSweep().catch(console.error)
                  }}
                  className="w-full"
                  variant="secondary"
                  disabled={sweepLoading || !sweepingSolution || !!sweepError}
                  loading={sweepLoading}
                >
                  Sweep
                </Button>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
