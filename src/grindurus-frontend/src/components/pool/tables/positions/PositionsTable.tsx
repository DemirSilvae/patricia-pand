import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { Table } from '../../../ui'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'

type PositionsTableProps = {
  poolId: number
}

const PositionsTable = ({ poolId }: PositionsTableProps) => {
  const { poolsNFT } = useProtocolContext()

  const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPositions()
  }, [poolId, poolsNFT])

  const checkRequired = async () => {
    if (!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    return true
  }

  const fetchPositions = async () => {
    if (!await checkRequired()) return
    setIsLoading(true)
    try {
      const poolsNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[] = await poolsNFT!.getPoolNFTInfosBy([poolId])
      const positions = poolsNFTInfos[0].positions
      const feeTokenDecimals = 18
      const baseTokenDecimals = poolsNFTInfos[0].baseTokenDecimals
      const quoteTokenDecimals = poolsNFTInfos[0].quoteTokenDecimals
      const oracleQuoteTokenPerBaseTokenDecimals =  poolsNFTInfos[0].oracleQuoteTokenPerBaseTokenDecimals
      const oracleQuoteTokenPerFeeTokenDecimals = poolsNFTInfos[0].oracleQuoteTokenPerFeeTokenDecimals
      
      const _priceMin = formatUnits(positions[0][2], oracleQuoteTokenPerBaseTokenDecimals)
      const isPriceMinShouldEqZero = _priceMin === "1157920892373161954235709850086879078532699846656405640394575840079131.29639935"
      
      const long = {
        number: positions[0][0].toString(),
        numberMax: positions[0][1].toString(),
        priceMin: isPriceMinShouldEqZero ? "0.0" : _priceMin,
        liquidity: formatUnits(positions[0][3], quoteTokenDecimals),
        qty: formatUnits(positions[0][4], baseTokenDecimals),
        price: formatUnits(positions[0][5], oracleQuoteTokenPerBaseTokenDecimals),
        feeQty: formatUnits(positions[0][6], feeTokenDecimals),
        feePrice: formatUnits(positions[0][7], oracleQuoteTokenPerFeeTokenDecimals),
      }

      const hedge = {
        number: positions[1][0].toString(),
        numberMax: positions[1][1].toString(),
        priceMin: formatUnits(positions[1][2], oracleQuoteTokenPerBaseTokenDecimals),
        liquidity: formatUnits(positions[1][3], quoteTokenDecimals),
        qty: formatUnits(positions[1][4], baseTokenDecimals),
        price: formatUnits(positions[1][5], oracleQuoteTokenPerBaseTokenDecimals),
        feeQty: formatUnits(positions[1][6], feeTokenDecimals),
        feePrice: formatUnits(positions[1][7], oracleQuoteTokenPerFeeTokenDecimals),
      }

      const formattedData = Object.keys(long).map((key) => [
        key,
        long[key as keyof typeof long],
        hedge[key as keyof typeof hedge],
      ])

      setTableData(formattedData)
    } catch (err) {
      console.error("Failed to fetch positions: ", err)
    }
    setIsLoading(false)
  }

  const headers = ['Param', 'Long Position', 'Hedge Position']

  return (
    <Table headers={headers} data={tableData} isLoading={isLoading} />
  )
}

export default PositionsTable