import styles from './PoolInfo.module.scss'
import { useEffect, useState } from 'react'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'
import { CopiedAddress } from '../../../ui'

type PoolInfoProps = {
  poolId: number
}

const PoolInfo = ({ poolId }: PoolInfoProps) => {
  const { poolsNFT, networkConfig } = useProtocolContext()

  const [owner, setOwner] = useState<string>("")
  const [oracleQuoteTokenPerFeeToken, setOracleQuoteTokenPerFeeToken] = useState<string>("")
  const [oracleQuoteTokenPerBaseToken, setOracleQuoteTokenPerBaseToken] = useState<string>("")
  const [royaltyReceiver, setRoyaltyReceiver] = useState<string>("")
  const [quoteToken, setQuoteToken] = useState<string>("")
  const [baseToken, setBaseToken] = useState<string>("")
  const [quoteTokenSymbol, setQuoteTokenSymbol] = useState<any>()
  const [baseTokenSymbol, setBaseTokenSymbol] = useState<any>()

  useEffect(() => {
    if (poolsNFT) {
      fetchPoolData()
    }
  }, [poolId, networkConfig, poolsNFT])

  const checkRequired = () => {
    if(!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    return true
  }

  const fetchPoolData = async () => {
    if(!checkRequired()) return
    try{
      const _owner = await poolsNFT!.ownerOf(poolId)
      setOwner(_owner)
      const _royaltyReceiver = await poolsNFT!.royaltyReceiver(poolId)
      setRoyaltyReceiver(_royaltyReceiver)

      const poolNFTInfos : IPoolsNFTLens.PoolNFTInfoStructOutput[] = await poolsNFT!.getPoolNFTInfosBy([poolId])
      let poolNFTInfo = poolNFTInfos[0]
      setQuoteTokenSymbol(poolNFTInfo.quoteTokenSymbol)
      setBaseTokenSymbol(poolNFTInfo.baseTokenSymbol)

      setOracleQuoteTokenPerFeeToken(poolNFTInfo.oracleQuoteTokenPerFeeToken)
      setOracleQuoteTokenPerBaseToken(poolNFTInfo.oracleQuoteTokenPerBaseToken)
      setQuoteToken(poolNFTInfo.quoteToken)
      setBaseToken(poolNFTInfo.baseToken)
    } catch (err) {
      console.log("Failed to load pool data: ", err)
    }
  }

  return (
    <div className={styles["info"]}>
      <h2 className={styles["title"]}>Info</h2>
      <div className={styles["addresses"]}>
        <CopiedAddress label={`Oracle ${quoteTokenSymbol} / FeeToken:`} address={oracleQuoteTokenPerFeeToken} fullAddress={oracleQuoteTokenPerFeeToken}/>
        <CopiedAddress label={`Oracle ${quoteTokenSymbol} / ${baseTokenSymbol}:`} address={oracleQuoteTokenPerBaseToken} fullAddress={oracleQuoteTokenPerBaseToken}/>
        <CopiedAddress label={`QuoteToken: ${quoteTokenSymbol}`} address={quoteToken} fullAddress={quoteToken}/>
        <CopiedAddress label={`BaseToken: ${baseTokenSymbol}`} address={baseToken} fullAddress={baseToken}/>
        <CopiedAddress label="Pool Owner:" address={owner} fullAddress={owner}/>
        <CopiedAddress label="Royalty Receiver:" address={royaltyReceiver} fullAddress={royaltyReceiver}/>
      </div>
    </div>
  )
}

export default PoolInfo