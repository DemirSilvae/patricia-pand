import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { 
  PoolsNFT, IntentsNFT, GrETH, GrAI, Registry, 
  PoolsNFT__factory,  IntentsNFT__factory, GrETH__factory, GrAI__factory, Registry__factory
} from '../typechain-types'
import { convertDecimalToHex } from '../utils/numbers'
import config from '../config'

type NetworkConfig = (typeof config)[keyof typeof config]

interface ProtocolContextType {
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  poolsNFT: PoolsNFT | null
  intentsNFT: IntentsNFT | null
  grETH: GrETH | null
  grAI: GrAI | null
  registry: Registry | null
  networkConfig: Partial<NetworkConfig>
  setNetworkConfig: React.Dispatch<React.SetStateAction<Partial<NetworkConfig>>>
  isConnected: boolean
  visiblePoolIds: number[]
  setVisiblePoolIds: React.Dispatch<React.SetStateAction<number[]>>
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined)

export const ProtocolContextProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [networkConfig, setNetworkConfig] = useState<Partial<NetworkConfig>>({})
  const [poolsNFT, setPoolsNFT] = useState<PoolsNFT | null>(null)
  const [intentsNFT, setIntentsNFT] = useState<IntentsNFT | null>(null)
  const [grETH, setGrETH] = useState<GrETH | null>(null)
  const [grAI, setGrAI] = useState<GrAI | null>(null)
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [visiblePoolIds, setVisiblePoolIds] = useState<number[]>([])

  const { walletProvider } = useAppKitProvider('eip155')
  const { isConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()

  useEffect(() => {
    if (provider)
      provider.getSigner().then(setSigner).catch(console.error)
  }, [provider])

  useEffect(() => {
    if (!visiblePoolIds.length && poolsNFT)
      getDefaultVisiblePool()
  }, [poolsNFT])

  useEffect(() => {
    const chainToUse = convertDecimalToHex(chainId)
    const networkKey = Object.keys(config).find(
      key =>
        config[key as keyof typeof config].chainId?.toLowerCase() ===
        chainToUse?.toLowerCase()
    ) as keyof typeof config | undefined

    setNetworkConfig(networkKey ? config[networkKey] : {})
  }, [chainId])

  useEffect(() => {
    if (isConnected && walletProvider)
      setProvider(new BrowserProvider(walletProvider as Eip1193Provider))
    else {
      setProvider(null)
      setSigner(null)
    }
  }, [isConnected, walletProvider])

  useEffect(() => {
    if (!signer) {
      setPoolsNFT(null)
      setIntentsNFT(null)
      setGrETH(null)
      setGrAI(null)
      setRegistry(null)
      return
    }
  
    const {
      poolsNFT: poolsAddress,
      intentsNFT: intentsAddress,
      grETH: grETHAddress,
      grAI: grAIAddress,
      registry: registryAddress,
    } = networkConfig ?? {}
  
    setPoolsNFT(poolsAddress ? PoolsNFT__factory.connect(poolsAddress, signer) : null)
    setIntentsNFT(intentsAddress ? IntentsNFT__factory.connect(intentsAddress, signer) : null)
    setGrETH(grETHAddress ? GrETH__factory.connect(grETHAddress, signer) : null)
    setGrAI(grAIAddress ? GrAI__factory.connect(grAIAddress, signer) : null)
    setRegistry(registryAddress ? Registry__factory.connect(registryAddress, signer) : null)
  }, [signer, networkConfig])  

  const getDefaultVisiblePool = async () => {
    if (!poolsNFT) return
    const totalPools = await poolsNFT.totalPools()
    const maxIdx = Math.min(5, Number(totalPools))
    setVisiblePoolIds(Array.from({ length: maxIdx }, (_, i) => i))
  }

  return (
    <ProtocolContext.Provider
      value={{
        provider,
        poolsNFT,
        intentsNFT,
        grETH,
        grAI,
        registry,
        networkConfig,
        setNetworkConfig,
        isConnected,
        signer,
        visiblePoolIds,
        setVisiblePoolIds,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  )
}

export const useProtocolContext = () => {
  const context = useContext(ProtocolContext)
  if (!context)
    throw new Error('useProtocolContext must be used within a ProtocolContextProvider')
  return context
}