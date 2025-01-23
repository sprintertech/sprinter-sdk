import { useAppKitWallet, Wallet } from '@reown/appkit-wallet-button/react'
import { Button } from './components/ui/button'
import metamaskIcon from './assets/metamask-icon.svg'
import phantomIcon from './assets/phantom-icon.svg'
import { useAppKit } from '@reown/appkit/react'

export const ConnectionScreen = () => {
  const { connect } = useAppKitWallet({
    onError(error) {
      console.error(error)
    }
  })
  const { open } = useAppKit()

  const handleConnect = (wallet: Wallet) => {
    connect(wallet).catch(console.error)
  }

  return (
    <div>
      <div className="my-12 text-center ">
        <div className="text-2xl font-normal leading-loose">
          Welcome to Sprinter
        </div>
        <div className="text-secondary">Get started by selecting a wallet:</div>
      </div>
      <div className="m-4 flex flex-col items-center justify-center gap-4">
        <Button size="lg" onClick={() => handleConnect('metamask')}>
          <span className="shrink grow basis-0 text-left text-base leading-normal">
            MetaMask
          </span>
          <img className="size-[35px] rounded-lg" src={metamaskIcon} />
        </Button>
        <Button size="lg" onClick={() => handleConnect('phantom')}>
          <span className="shrink grow basis-0 text-left text-base leading-normal">
            Phantom
          </span>
          <img className="size-[35px] rounded-lg" src={phantomIcon} />
        </Button>
        <Button
          size="lg"
          onClick={() => {
            open().catch(console.error)
          }}
        >
          <span className="shrink grow basis-0 text-left text-base leading-normal">
            Other
          </span>
        </Button>
      </div>
    </div>
  )
}
