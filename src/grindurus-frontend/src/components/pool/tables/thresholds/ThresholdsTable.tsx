import './ThresholdsTable.module.scss'
import { useState, useEffect } from 'react'
import { formatUnits } from 'ethers'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'
import { Table } from '../../../ui'

type ThresholdsTableProps = {
  poolId: number
}

const ThresholdsTable = ({ poolId }: ThresholdsTableProps) => {
  const { poolsNFT } = useProtocolContext()
  const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThresholds()
  }, [poolId, poolsNFT])

  const checkRequired = async () => {
    if (!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    return true
  }

  const fetchThresholds = async () => {
    if (!await checkRequired()) return
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

      const formattedData = Object.entries(thresholds).map(([key, value]) => [key, value])
      setTableData(formattedData)
    } catch (err) {
      console.log('Failed to load thresholds: ', err)
    }
    setIsLoading(false)
  }

  const headers = ['Param', 'Value']

  return (
    <Table headers={headers} data={tableData} isLoading={isLoading} />
  )
}

export default ThresholdsTable