import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import React, { useEffect, useMemo, useState } from 'react'
import { BrowserProvider, Eip1193Provider, JsonRpcSigner } from 'ethers'

type ChainTokensContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type IEthersContext = {
  signer: JsonRpcSigner | undefined
  ethersProvider: BrowserProvider | undefined
}

const EthersContext = React.createContext<IEthersContext | undefined>(undefined)

const EthersContextProvider = ({ children }: ChainTokensContextProps) => {
  const { isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const ethersProvider = useMemo(() => {
    if (!isConnected || !walletProvider) return
    return new BrowserProvider(walletProvider as Eip1193Provider)
  }, [isConnected, walletProvider])
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>()
  // const signer = useMemo(() => new ethersProvider.getSigner(), [ethersProvider])

  useEffect(() => {
    if (!isConnected || !ethersProvider) return

    ethersProvider.getSigner().then(setSigner).catch(console.error)
  }, [ethersProvider, isConnected])

  return (
    <EthersContext.Provider value={{ ethersProvider, signer }}>
      {children}
    </EthersContext.Provider>
  )
}

const useEthers = () => {
  const context = React.useContext(EthersContext)
  if (context === undefined) {
    throw new Error('useEthers must be used within a ChainTokensProvider')
  }
  return context
}

export { EthersContextProvider, useEthers }
