import styles from './ThresholdsTable.module.scss'
import { useState, useEffect } from 'react'
import { formatUnits } from 'ethers'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'
import { NumberView } from '../../../ui'
import { useIsMobile } from '../../../../hooks'

type ThresholdsTableProps = {
  poolId: number
}

type ThresholdEntry = {
  param: string
  value: string
}

const ThresholdsTable = ({ poolId }: ThresholdsTableProps) => {
  const { poolsNFT } = useProtocolContext()
  const isMobile = useIsMobile(500)
  const [tableData, setTableData] = useState<ThresholdEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThresholds()
  }, [poolId, poolsNFT])

  const checkRequired = () => {
    if (!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    return true
  }

  const fetchThresholds = async () => {
    if (!checkRequired()) return

    setIsLoading(true)
    try {
      const poolsNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[] = await poolsNFT!.getPoolNFTInfosBy([poolId])
      const _thresholds = poolsNFTInfos[0].thresholds

      const thresholds = {
        longBuyPriceMin: formatUnits(_thresholds[0], 8),
        longSellQuoteTokenAmountThreshold: formatUnits(_thresholds[1], 6),
        longSellSwapPriceThreshold: formatUnits(_thresholds[2], 8),
        hedgeSellInitPriceThresholdHigh: formatUnits(_thresholds[3], 8),
        hedgeSellInitPriceThresholdLow: formatUnits(_thresholds[4], 8),
        hedgeSellLiquidity: formatUnits(_thresholds[5], 6),
        hedgeSellQuoteTokenAmountThreshold: formatUnits(_thresholds[6], 6),
        hedgeSellTargetPrice: formatUnits(_thresholds[7], 8),
        hedgeSellSwapPriceThreshold: formatUnits(_thresholds[8], 8),
        hedgeRebuyBaseTokenAmountThreshold: formatUnits(_thresholds[9], 18),
        hedgeRebuySwapPriceThreshold: formatUnits(_thresholds[10], 8),
      }

      const formatted: ThresholdEntry[] = Object.entries(thresholds).map(
        ([param, value]) => ({ param, value })
      )

      setTableData(formatted)
    } catch (err) {
      console.log('Failed to load thresholds: ', err)
    }
    setIsLoading(false)
  }

  const formatLabel = (label: string) => {
    if (!isMobile) return label

    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaced
      .replace(/^./, str => str.toUpperCase()) // capitalize first letter
  }

  return (
    <div className={styles["block"]}>
      <h3 className={styles["title"]}>Thresholds</h3>
      <div className={styles["thresholds"]}>
        {tableData.map((entry, idx) => (
          <div className={styles["info-block"]} key={idx}>
            <div className={styles["element"]}>{formatLabel(entry.param)}</div>
            <div className={styles["element"]}>
              <NumberView value={entry.value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThresholdsTable