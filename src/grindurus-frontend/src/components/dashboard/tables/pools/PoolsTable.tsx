import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers'
import styles from './PoolsTable.module.scss'
import logoArbitrum from '../../../../assets/images/logoArbitrum.png'
import visible from '../../../../assets/images/eye.svg'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { Table } from '../../../ui'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'

interface PoolData {
  id: string
  quoteTokenSymbol: string
  baseTokenSymbol: string
  quoteAmount: string
  baseAmount: string
  quoteYield: string
  baseYield: string
  quoteTrade: string
  baseTrade: string
  start: string
  apr: string
  royaltyPrice: string
}

function PoolsTable() {
  const [tableData, setTableData] = useState<PoolData[] | null>(null)
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
  ) : PoolData[] => {
    return poolNFTInfos.map((info) => {
      const quoteAmount = formatUnits(info.quoteTokenAmount, info.quoteTokenDecimals)
      const baseAmount = formatUnits(info.baseTokenAmount, info.baseTokenDecimals)

      const quoteYield = parseFloat(
        formatUnits(info.totalProfits.quoteTokenYieldProfit, info.quoteTokenDecimals)
      ).toFixed(Number(info.quoteTokenDecimals))

      const baseYield = parseFloat(
        formatUnits(info.totalProfits.baseTokenYieldProfit, info.baseTokenDecimals)
      ).toFixed(Number(info.baseTokenDecimals))

      const quoteTrade = parseFloat(
        formatUnits(info.totalProfits.quoteTokenTradeProfit, info.quoteTokenDecimals)
      ).toFixed(Number(info.quoteTokenDecimals))

      const baseTrade = parseFloat(
        formatUnits(info.totalProfits.baseTokenTradeProfit, info.baseTokenDecimals)
      ).toFixed(Number(info.baseTokenDecimals))

      const timestamp = info.startTimestamp
      const start = timestamp !== 0n ? new Date(Number(info.startTimestamp) * 1000).toLocaleDateString() : "N/A"

      const aprNumerator = Number(info.roi.ROINumerator) * 365 * 30 * 24 * 60
      const aprDenominator = Number(info.roi.ROIDeniminator) * Number(info.roi.ROIPeriod)
      const apr =
        aprDenominator > 0
          ? `${((aprNumerator / aprDenominator) * 100).toFixed(2)}%`
          : "N/A"

      const royaltyPrice = formatUnits(info.royaltyParams.newRoyaltyPrice, info.quoteTokenDecimals)

      return {
        id: info.poolId.toString(),
        quoteTokenSymbol: info.quoteTokenSymbol,
        baseTokenSymbol: info.baseTokenSymbol,
        quoteAmount,
        baseAmount,
        quoteYield,
        baseYield,
        quoteTrade,
        baseTrade,
        start,
        apr,
        royaltyPrice
      }
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

  return (
    <>
      <div className={`${styles["header"]} table-header`}>
        <h2 className={`${styles["title"]}`}>Explore Pools NFTs</h2>
        <div className={`${styles["search"]} table-search`}>
          <input
            onChange={handleSearch}
            placeholder="Search with pool id or owner address"
            type="text"
          />
        </div>
      </div>
      {tableData?.map((data, index) => 
        <div className={styles["pool"]} key={index}>
          <div className={styles["content"]}>
            <div className={styles["pool-header"]}>
              <div className={styles["pool-header-left"]}>
                <img className={styles["network-img"]} alt="Network Icon" src={logoArbitrum} />
                <h3 className={styles["pool-title"]}>Pool Id: {data.id}</h3>
              </div>
              <div className={styles["pool-header-right"]}>{`${Number(data.quoteAmount).toFixed(6)} ${data.quoteTokenSymbol} / ${Number(data.baseAmount).toFixed(6)} ${data.baseTokenSymbol}`}</div>
            </div>
            <div className={styles["body"]}>
              <div className={styles["profits"]}>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Yield Profit:</div>
                  <div className={styles["block-text"]}>
                    <div>{`${data.quoteYield} ${data.quoteTokenSymbol}`}</div>
                    <div>{`${data.baseYield} ${data.baseTokenSymbol}`}</div>
                  </div>
                </div>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Trade Profit:</div>
                  <div className={styles["block-text"]}>
                    <div>{`${data.quoteTrade} ${data.quoteTokenSymbol}`}</div>
                    <div>{`${data.baseTrade} ${data.baseTokenSymbol}`}</div>
                  </div>
                </div>
              </div>
              <div className={styles["infos"]}>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Start:</div>
                  <div className={styles["block-text"]}>{data.start}</div>
                </div>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>APR:</div>
                  <div className={styles["block-text"]}>{data.apr}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["buttons"]}>
            <button
              onClick={() => handleViewPool(data.id)}
              className={`${styles["view-button"]} ${styles["button"]} button`}
            >
              <img
                className={styles["view-img"]}
                src={visible}
                alt="Eye Icon"
              />
              View Pool
            </button>
            <button
              onClick={() => handleBuyRoyalty(data.id, data.royaltyPrice)}
              className={`${styles["button"]} button`}
            >
              Buy {data.royaltyPrice} {data.quoteTokenSymbol}
            </button>
            <button
              onClick={() => handleGrind(data.id)}
              className={`${styles["button"]} button`}
            >
              Grind
            </button>
          </div>
        </div>
      )}
      {/* <Table headers={headers} data={tableData} isLoading={isLoading}/> */}
    </>
  )
}

export default PoolsTable