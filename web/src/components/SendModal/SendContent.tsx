// const web3 = new Web3($selectedProvider.provider);

import { useChainTokens } from '@/context/ChainTokensContext'
import { Button } from '../ui/button'
import { Solution } from '@chainsafe/sprinter-sdk/dist/types'
import { useCallback, useMemo, useState } from 'react'
import { formatBalance } from '@/utils'
import { useAppKitNetwork } from '@reown/appkit/react'
import { useEthers } from '@/context/EthersContext'

// import {
//   useAccount,
//   useSendTransaction,
//   useSwitchChain,
//   usePublicClient
// } from 'wagmi'

// // @ts-expect-error   // chainId is missing in web3js call options type
// const callOptions: NonPayableCallOptions = { chainId: quoteRecord.sourceChain };

// console.info('Quote', quoteRecord);

// // Approval sniff etc...\
// if (quoteRecord.approvals && quoteRecord.approvals.length > 0) {
//   for (const approval of quoteRecord.approvals) {
//     console.log('Requesting approval:', approval);
//     const receipt = await web3.eth.sendTransaction(approval);
//     console.warn(`Approval receipt: `, receipt);
//   }
// } else {
//   const erc20 = new web3.eth.Contract(erc20Abi, quoteRecord.sourceTokenAddress);

//   const allowed = await erc20.methods
//     .allowance(ownerAddress, quoteRecord.transaction.to)
//     .call(callOptions);

//   if (BigInt(quoteRecord.amount) > BigInt(allowed)) {
//     const approval = await erc20.methods
//       .approve(quoteRecord.transaction.to, quoteRecord.amount)
//       .send({
//         ...callOptions,
//         from: ownerAddress
//       });
//     if (!approval.status) throw new Error('Not Approved!'); // To stop execution
//   }
// }

// // FINAL STEP!
// const receipt = await web3.eth.sendTransaction(quoteRecord.transaction);

// console.warn(`TX receipt: `, receipt);
type Props = {
  solutions: Solution[]
  token: string
  onSuccess: () => void
}

export const SendContent = ({ solutions, token, onSuccess }: Props) => {
  const { chainId: currentChainId } = useAppKitNetwork()
  const { ethersProvider, signer } = useEthers()
  const [isLoading, setIsLoading] = useState(false)
  const { structuredTokenData, chains } = useChainTokens()
  const sourceChains = useMemo(() => {
    const sourceChainIds = solutions.map((s) => s.sourceChain)
    return chains.filter((chain) => sourceChainIds.includes(chain.chainID))
  }, [chains, solutions])

  const destinationChains = useMemo(() => {
    const destChainIds = solutions.map((s) => s.destinationChain)
    return chains.filter((chain) => destChainIds.includes(chain.chainID))
  }, [chains, solutions])

  const totalFeesUsd = useMemo(() => {
    let total = 0
    for (const solution of solutions) {
      total += solution.fee.amountUSD
    }
    return total
  }, [solutions])

  const totalAmount = useMemo(() => {
    let total = 0n
    for (const solution of solutions) {
      total += BigInt(solution.amount)
    }
    return total
  }, [solutions])

  const onConfirm = useCallback(async () => {
    if (!signer || !ethersProvider) return

    setIsLoading(true)
    for (const solution of solutions) {
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
          signer
            .sendTransaction({
              to,
              gasLimit: BigInt(gasLimit),
              data: data as `0x${string}`,
              from,
              chainId,
              value: BigInt(value)
            })
            .then(async (receipt) => await receipt.wait())
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
          console.log('now waiting', receipt.blockHash)
          await receipt.wait()
          onSuccess()
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [currentChainId, ethersProvider, onSuccess, signer, solutions])

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="mt-4 text-sm font-light">Souce Chains</div>
        <div className="text-right text-sm">
          <div className="flex h-12 items-center justify-end">
            <div className="flex items-center pl-2">
              {sourceChains.map((sourceChain) => {
                return (
                  <img
                    key={sourceChain.chainID}
                    className="-ml-2 w-6 min-w-6 cursor-pointer"
                    src={sourceChain.logoURI}
                    alt={sourceChain.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm font-light">Destination Chain</div>
        <div className="text-right text-sm">
          <div className="flex h-12 items-center justify-end">
            <div className="flex items-center pl-2">
              {destinationChains.map((destChain) => {
                return (
                  <img
                    key={destChain.chainID}
                    className="-ml-2 w-6 min-w-6 cursor-pointer"
                    src={destChain.logoURI}
                    alt={destChain.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm font-light">Fees</div>
        <div className="mt-4 text-right text-sm">{totalFeesUsd} USD</div>
        <div className="mt-4 text-sm font-light">Amount</div>
        <div className="mt-4 text-right text-sm">
          {formatBalance(
            totalAmount.toString(),
            structuredTokenData[token].decimals
          )}{' '}
          {structuredTokenData[token].symbol}
        </div>
      </div>
      <div className="pt-6">
        <Button
          onClick={() => {
            onConfirm().catch((e) => console.error('Error in onConfirm:', e))
          }}
          className="w-full"
          variant="secondary"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
