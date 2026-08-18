import { useEffect, useState } from 'react'

import { useProtocolContext } from '../../../../context/ProtocolContext'
import { useIsMobile } from '../../../../hooks'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'
import { shortenAddress } from '../../../../utils/addresses'
import { CopiedAddress } from '../../../ui'
import styles from './PoolInfo.module.scss'

type PoolInfoProps = {
  poolId: number
}

const PoolInfo = ({ poolId }: PoolInfoProps) => {
  const { poolsNFT, networkConfig } = useProtocolContext()

  const [owner, setOwner] = useState<string>('')
  const [oracleQuoteTokenPerFeeToken, setOracleQuoteTokenPerFeeToken] = useState<string>('')
  const [oracleQuoteTokenPerBaseToken, setOracleQuoteTokenPerBaseToken] = useState<string>('')
  const [royaltyReceiver, setRoyaltyReceiver] = useState<string>('')
  const [quoteToken, setQuoteToken] = useState<string>('')
  const [baseToken, setBaseToken] = useState<string>('')
  const [quoteTokenSymbol, setQuoteTokenSymbol] = useState<any>()
  const [baseTokenSymbol, setBaseTokenSymbol] = useState<any>()

  const isMobile = useIsMobile(514)

  useEffect(() => {
    if (poolsNFT) {
      fetchPoolData()
    }
  }, [poolId, networkConfig, poolsNFT])

  const checkRequired = () => {
    if (!poolsNFT) {
      console.error('PoolsNFT is null!')
      return false
    }
    return true
  }

  const fetchPoolData = async () => {
    if (!checkRequired()) return
    try {
      const _owner = await poolsNFT!.ownerOf(poolId)
      setOwner(_owner)
      const _royaltyReceiver = await poolsNFT!.royaltyReceiver(poolId)
      setRoyaltyReceiver(_royaltyReceiver)

      const poolNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[] =
        await poolsNFT!.getPoolNFTInfosBy([poolId])
      let poolNFTInfo = poolNFTInfos[0]
      setQuoteTokenSymbol(poolNFTInfo.quoteTokenSymbol)
      setBaseTokenSymbol(poolNFTInfo.baseTokenSymbol)

      setOracleQuoteTokenPerFeeToken(poolNFTInfo.oracleQuoteTokenPerFeeToken)
      setOracleQuoteTokenPerBaseToken(poolNFTInfo.oracleQuoteTokenPerBaseToken)
      setQuoteToken(poolNFTInfo.quoteToken)
      setBaseToken(poolNFTInfo.baseToken)
    } catch (err) {
      console.log('Failed to load pool data: ', err)
    }
  }

  const safeShorten = (address?: string) => (address ? shortenAddress(address, 26) : '')

  return (
    <div className={styles['info']}>
      <h2 className={styles['title']}>Info</h2>
      <div className={styles['addresses']}>
        <CopiedAddress
          label={`Oracle ${quoteTokenSymbol ?? ''} / FeeToken:`}
          address={
            isMobile ? safeShorten(oracleQuoteTokenPerFeeToken) : oracleQuoteTokenPerFeeToken
          }
          fullAddress={oracleQuoteTokenPerFeeToken}
        />
        <CopiedAddress
          label={`Oracle ${quoteTokenSymbol ?? ''} / ${baseTokenSymbol ?? ''}:`}
          address={
            isMobile ? safeShorten(oracleQuoteTokenPerBaseToken) : oracleQuoteTokenPerBaseToken
          }
          fullAddress={oracleQuoteTokenPerBaseToken}
        />
        <CopiedAddress
          label={`QuoteToken: ${quoteTokenSymbol ?? ''}`}
          address={isMobile ? safeShorten(quoteToken) : quoteToken}
          fullAddress={quoteToken}
        />
        <CopiedAddress
          label={`BaseToken: ${baseTokenSymbol ?? ''}`}
          address={isMobile ? safeShorten(baseToken) : baseToken}
          fullAddress={baseToken}
        />
        <CopiedAddress
          label="Pool Owner:"
          address={isMobile ? safeShorten(owner) : owner}
          fullAddress={owner}
        />
        <CopiedAddress
          label="Royalty Receiver:"
          address={isMobile ? safeShorten(royaltyReceiver) : royaltyReceiver}
          fullAddress={royaltyReceiver}
        />
      </div>
    </div>
  )
}

export default PoolInfo
