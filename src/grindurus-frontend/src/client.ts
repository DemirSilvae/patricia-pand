import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum, base, polygon, optimism, AppKitNetwork } from '@reown/appkit/networks'
import config from './config'

type Networks = [AppKitNetwork, ...AppKitNetwork[]];

const projectId: string = 'ff90ca3a23aaaaf5a5ee02df6bf92ff2'
const networks: Networks = [arbitrum, base, polygon, optimism]

const chainImages: Record<number, string> = {
  42161: config.arbitrum.logo,
  8453: config.base.logo,
  137: config.polygon.logo,
  10: config.optimism.logo
}

createAppKit({
  themeMode: 'dark',
  adapters: [new EthersAdapter()],
  networks,
  projectId,
  defaultNetwork: arbitrum,
  chainImages,
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet']
  },
  themeVariables: {
    '--w3m-font-family': 'Noto Sans Mono',
    '--w3m-color-mix': '#000',
    '--w3m-accent': '#933DC9'
  }
})