import logoArbitrum from '../src/assets/images/logoArbitrum.png'
import logoPolygon from '../src/assets/images/logoPolygon.png'
import logoOptimism from '../src/assets/images/logoOptimism.png'
import logoBase from '../src/assets/images/logoBase.png'
import logoUSDT from '../src/assets/images/logoUSDT.png'
import logoUSDC from '../src/assets/images/logoUSDC.png'
import logoWETH from '../src/assets/images/logoWETH.png'

export interface Token {
  symbol: string
  address: string
  decimals: number
  logo: string
}

export interface Strategy {
  id: number
  description: string
}

export interface ChainConfig {
  name: string
  chainId: string
  logo: string
  poolsNFT: string
  registry: string
  intentNFT?: string
  grETH?: string
  grAI?: string
  strategies: Strategy[]
  quoteTokens: Token[]
  baseTokens: Token[]
}

type SupportedChains = 'arbitrum' | 'base' | 'polygon' | 'optimism'

const config: Record<SupportedChains, ChainConfig> = {
  arbitrum: {
    name: 'Arbitrum',
    chainId: '0xa4b1',
    logo: logoArbitrum,
    poolsNFT: '0xAadF736774b6F592Aa4B8F4B378478F36803A084',
    registry: '0x4D0f36A643D611F5c10A8750DDDa552584459e73',
    intentNFT: '0x924DE1c93A1814B2861E3414e2E2E06e442d493E',
    grETH: '0x8c4168cE9fbCCD5e9cEA0A6e6303fe56B7a4AaC9',
    grAI: '0x7b756118De36F74C58DD4C3C8F8E90d8DEBA61c1',
    strategies: [
      {
        id: 0,
        description: 'UniswapV3 with URUS',
      },
      {
        id: 1,
        description: 'AAVEV3 + UniswapV3 with URUS',
      },
    ],
    quoteTokens: [
      {
        symbol: 'WETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
        logo: logoUSDT,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
    baseTokens: [
      {
        symbol: 'WETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
        logo: logoUSDT,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
  },
  base: {
    name: 'Base',
    chainId: '0x2105',
    logo: logoBase,
    poolsNFT: '',
    registry: '',
    strategies: [],
    quoteTokens: [],
    baseTokens: [],
  },
  polygon: {
    name: 'Polygon',
    chainId: '0x89',
    logo: logoPolygon,
    poolsNFT: '',
    registry: '',
    strategies: [],
    quoteTokens: [],
    baseTokens: [],
  },
  optimism: {
    name: 'Optimism',
    chainId: '0xa',
    logo: logoOptimism,
    poolsNFT: '',
    registry: '',
    strategies: [],
    quoteTokens: [],
    baseTokens: [],
  },
}

export default config