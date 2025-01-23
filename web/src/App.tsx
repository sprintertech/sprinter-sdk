import { SprinterContext } from '@chainsafe/sprinter-react'
import { Environment } from '@chainsafe/sprinter-sdk'
import { Content } from './Content'
import Header from './components/Header'
import { ChainTokensContextProvider } from './context/ChainTokensContext'
import { createAppKit } from '@reown/appkit/react'

import {
  sepolia,
  b3Sepolia,
  baseSepolia,
  AppKitNetwork
} from '@reown/appkit/networks'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { EthersContextProvider } from './context/EthersContext'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'b079b456fc21a5a1ff63574425469cd1'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Sprinter PoC',
  description: 'Example app for Sprinter SDK and Sprinter React hooks',
  url: 'https://docs.sprinter.buildwithsygma.com/', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Set the networks
const networks = [sepolia, b3Sepolia, baseSepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[]
]

// 5. Create modal
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    socials: false,
    email: false,
    send: false
  }
})

export const BASE_URL = Environment.TESTNET

function App() {
  return (
    <EthersContextProvider>
      <SprinterContext baseUrl={BASE_URL}>
        <ChainTokensContextProvider>
          <div className="h-screen bg-radial-gradient bg-right-bottom bg-no-repeat">
            <Header />
            <Content />
          </div>
        </ChainTokensContextProvider>
      </SprinterContext>
    </EthersContextProvider>
  )
}

export default App
