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
  intentsNFT?: string
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
    poolsNFT: '0x5B42518423A7CB79A21AF455441831F36FDe823C',
    registry: '0x54df142Ed06B7FfEbE99E16cF9FA0c055CB21fD3',
    intentsNFT: '0x03afbDE12f4E57dbe551a2b8D7BA0F91239207Af',
    grETH: '0x28507773E924380AA02784118034aE706F57bCEb',
    grAI: '0x2cd392CC10887a258019143a710a5Ce2C5B5d88d',
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