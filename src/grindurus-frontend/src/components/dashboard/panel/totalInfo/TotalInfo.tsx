import { useEffect, useState } from 'react'
import { formatUnits } from 'ethers'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import styles from './TotalInfo.module.scss'

function TotalInfo() {
  const { poolsNFT, grETH } = useProtocolContext()
  const [totalPoolsMinted, setTotalPoolsMinted] = useState<bigint>(0n)
  const [grETHGrinded, setGrETHGrinded] = useState<bigint>(0n)

  const checkRequired = () => {
    if(!poolsNFT) {
      console.error("poolsNFT is null!")
      return false
    }
    if(!grETH) {
      console.error("grETH is null!")
      return false
    }
    return true
  }

  const fetchInfo = async () => {
    if(!checkRequired) return 

    const totalPools = await poolsNFT!.totalPools()
    setTotalPoolsMinted(totalPools)
    const totalGrETH = await grETH!.totalGrinded()
    setGrETHGrinded(totalGrETH)
  }

  useEffect(() => {
    fetchInfo()
  }, [poolsNFT, grETH])

  return (
    <div className={styles['total-info']}>
      <div className={`${styles['item']} ${styles['title']}`}>
        <div className={styles['key']}>Total Info</div>
      </div>
      <div className={styles['item']}>
        <div className={styles['key']}>Total Pools Minted:</div>
        <div className={styles['value']}>{totalPoolsMinted.toString()}</div>
      </div>
      <div className={styles['item']}>
        <div className={styles['key']}>grETH grinded:</div>
        <div className={styles['value']}>{formatUnits(grETHGrinded, 18)}</div>
      </div>
    </div>
  )
}

export default TotalInfo