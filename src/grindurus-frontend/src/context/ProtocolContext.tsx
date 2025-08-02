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

  type ProtocolContracts = PoolsNFT | IntentsNFT | GrETH | GrAI | Registry
  const cachedContracts = useMemo(() => new Map<string, ProtocolContracts>(), [])

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
    const { 
      poolsNFT: poolsAddress, 
      intentsNFT: intentsAddress,
      grETH: grETHAddress,
      grAI: grAIAddress,
      registry: registryAddress
    } = networkConfig ?? {}

    if (signer && poolsAddress) {
      if (cachedContracts.has(poolsAddress)) {
        setPoolsNFT(cachedContracts.get(poolsAddress)! as PoolsNFT)
        return
      }

      const contract = PoolsNFT__factory.connect(poolsAddress, signer)
      setPoolsNFT(contract)
      cachedContracts.set(poolsAddress, contract)
    } else {
      setPoolsNFT(null)
    }

    if (signer && intentsAddress) {
      if (cachedContracts.has(intentsAddress)) {
        setIntentsNFT(cachedContracts.get(intentsAddress)! as IntentsNFT)
        return
      }

      const contract = IntentsNFT__factory.connect(intentsAddress, signer)
      setIntentsNFT(contract)
      cachedContracts.set(intentsAddress, contract)
    } else {
      setIntentsNFT(null)
    }

    if (signer && grETHAddress) {
      if (cachedContracts.has(grETHAddress)) {
        setGrETH(cachedContracts.get(grETHAddress)! as GrETH)
        return
      }

      const contract = GrETH__factory.connect(grETHAddress, signer)
      setGrETH(contract)
      cachedContracts.set(grETHAddress, contract)
    } else {
      setGrETH(null)
    }

    if (signer && grAIAddress) {
      if (cachedContracts.has(grAIAddress)) {
        setGrAI(cachedContracts.get(grAIAddress)! as GrAI)
        return
      }

      const contract = GrAI__factory.connect(grAIAddress, signer)
      setGrAI(contract)
      cachedContracts.set(grAIAddress, contract)
    } else {
      setGrAI(null)
    }

    if(signer && registryAddress) {
      if(cachedContracts.has(registryAddress)) {
        setRegistry(cachedContracts.get(registryAddress)! as Registry)
        return
      }

      const contract = Registry__factory.connect(registryAddress, signer)
      setRegistry(contract)
      cachedContracts.set(registryAddress, contract)
    }
  }, [signer, networkConfig, provider])

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