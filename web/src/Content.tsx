import { useAppKitAccount } from '@reown/appkit/react'
import { ConnectionScreen } from './ConnectionScreen'
import { Portofolio } from './Portfolio'

export const Content = () => {
  const { address, status } = useAppKitAccount()

  if (status !== 'connected' || !address) {
    return <ConnectionScreen />
  }

  return <Portofolio />
}
