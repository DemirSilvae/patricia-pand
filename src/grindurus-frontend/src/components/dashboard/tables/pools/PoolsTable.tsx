import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styles from './PoolsTable.module.scss'
import logoArbitrum from '../../../../assets/images/logoArbitrum.png'
import visible from '../../../../assets/images/eye.svg'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { Table } from '../../../ui'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'

function PoolsTable() {
  const [tableData, setTableData] = useState<(JSX.Element | string)[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { poolsNFT, isConnected } = useProtocolContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected && poolsNFT) {
      fetchInitialPools()
    } else {
      setTableData([])
    }
  }, [isConnected, poolsNFT])

  const checkRequired = () => {
    if (!poolsNFT) {
      console.error("poolsNFT not set!")
      return false
    }
    return true
  }

  const fetchInitialPools = async () => {
    if (!checkRequired()) return
    try {
      const totalPools = await poolsNFT!.totalPools()
      const ids = Array.from({ length: Number(totalPools) }, (_, i) => i)
      fetchPools(ids)
    } catch (err) {
      console.error("Failed to fetch total pools", err)
    }
  }

  const fetchPools = async (poolIds: number[]) => {
    if (!checkRequired()) return
    setIsLoading(true)
    try {
      const poolNFTInfos = await poolsNFT!.getPoolNFTInfosBy(poolIds)
      const formatted = formatTableData(poolNFTInfos)
      setTableData(formatted)
    } catch (err) {
      console.error("Failed to fetch pool info", err)
    }
    setIsLoading(false)
  }

  const handleViewPool = (poolId: string) => {
    navigate(`/pool/${poolId}`)
  }

  const handleGrind = async (poolId: string) => {
    try {
      const estimatedGasLimit = await poolsNFT!.grind.estimateGas(poolId)
      const adjustedGasLimit = estimatedGasLimit * 15n / 10n
      const tx = await poolsNFT!.grind(poolId, { gasLimit: adjustedGasLimit })
      await tx.wait()
    } catch (error) {
      console.log("Failed to grind", error)
    }
  }

  const handleBuyRoyalty = async (poolId: string, royaltyPrice: string) => {
    try {
      const royaltyShares = await poolsNFT!.calcRoyaltyPriceShares(poolId)
      // const tx = await poolsNFT!.buyRoyalty(poolId, { value: royaltyShares.newRoyaltyPrice })
      // await tx.wait()
    } catch (error) {
      console.log("Failed to buy royalty", error)
    }
  }

  const formatTableData = (
    poolNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[]
  ): (JSX.Element | string)[][] => {
    return poolNFTInfos.map((info) => {
      const quoteAmount = ethers.formatUnits(info.quoteTokenAmount, info.quoteTokenDecimals)
      const baseAmount = ethers.formatUnits(info.baseTokenAmount, info.baseTokenDecimals)

      const quoteYield = parseFloat(
        ethers.formatUnits(info.totalProfits.quoteTokenYieldProfit, info.quoteTokenDecimals)
      ).toFixed(Number(info.quoteTokenDecimals))

      const baseYield = parseFloat(
        ethers.formatUnits(info.totalProfits.baseTokenYieldProfit, info.baseTokenDecimals)
      ).toFixed(Number(info.baseTokenDecimals))

      const quoteTrade = parseFloat(
        ethers.formatUnits(info.totalProfits.quoteTokenTradeProfit, info.quoteTokenDecimals)
      ).toFixed(Number(info.quoteTokenDecimals))

      const baseTrade = parseFloat(
        ethers.formatUnits(info.totalProfits.baseTokenTradeProfit, info.baseTokenDecimals)
      ).toFixed(Number(info.baseTokenDecimals))

      const start = new Date(Number(info.startTimestamp) * 1000).toLocaleDateString()

      const aprNumerator = Number(info.roi.ROINumerator) * 365 * 30 * 24 * 60
      const aprDenominator = Number(info.roi.ROIDeniminator) * Number(info.roi.ROIPeriod)
      const apr =
        aprDenominator > 0
          ? `${((aprNumerator / aprDenominator) * 100).toFixed(2)}%`
          : "N/A"

      const royaltyPrice = ethers.formatUnits(info.royaltyParams.newRoyaltyPrice, info.quoteTokenDecimals)

      return [
        <img key={`network-${info.poolId}`} src={logoArbitrum} style={{ width: 30, height: 30 }} />,
        <img
          key={`view-${info.poolId}`}
          src={visible}
          alt="view"
          style={{ cursor: "pointer" }}
          onClick={() => handleViewPool(info.poolId.toString())}
        />,
        info.poolId.toString(),
        `${quoteAmount} ${info.quoteTokenSymbol}/${baseAmount} ${info.baseTokenSymbol}`,
        `${quoteYield} ${info.quoteTokenSymbol}\n + ${baseYield} ${info.baseTokenSymbol} \n/ ${quoteTrade} ${info.quoteTokenSymbol}\n${baseTrade} ${info.baseTokenSymbol}`,
        start,
        apr,
        <button
          key={`buy-${info.poolId}`}
          style={{ backgroundColor: "#933DC9", textTransform: "none", whiteSpace: "nowrap", padding: "10px"}}
          onClick={() => handleBuyRoyalty(info.poolId.toString(), royaltyPrice)}
          className="button"
        >
          Buy {royaltyPrice} {info.quoteTokenSymbol}
        </button>,
        <button
          key={`grind-${info.poolId}`}
          style={{ backgroundColor: "#933DC9", textTransform: "none", padding: "10px"}}
          onClick={() => handleGrind(info.poolId.toString())}
          className="button"
        >
          Grind
        </button>,
      ]
    })
  }

  const handleSearch = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    try {
      if (!value) {
        fetchInitialPools()
        return
      }

      let searchIds: number[] = []

      if (value.startsWith("0x")) {
        const response = await poolsNFT!.getPoolIdsOf(value)
        searchIds = response.map(id => Number(id))
      } else if (!isNaN(Number(value))) {
        searchIds = [Number(value)]
      }      

      fetchPools(searchIds)
    } catch (error) {
      console.log("Search failed", error)
    }
  }, 300)

  const headers = [
    "Network",
    "View",
    "Id",
    "Quote / Base Tokens",
    "Yield / Trade Profits",
    "Start",
    "APR",
    "Buy Royalty",
    "Grind Pool"
  ]

  return (
    <>
      <div className="table-header">
        <h2 className="table-title">Explore Pools NFTs</h2>
        <div className="table-search">
          <input
            onChange={handleSearch}
            placeholder="Search with pool id or owner address"
            type="text"
          />
        </div>
      </div>
      <Table headers={headers} data={tableData} isLoading={isLoading}/>
    </>
  )
}

export default PoolsTable