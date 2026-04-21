import styles from './IntentsTable.module.scss'
import { useEffect, useState } from 'react'
import logoArbitrum from '../../../../assets/images/logoArbitrum.png'
import { CopiedAddress } from '../../../ui'
import { shortenAddress } from '../../../../utils/addresses'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IIntentsNFT } from '../../../../typechain-types/IntentsNFT'
import { useIsMobile } from '../../../../hooks'

interface IntentData {
  id: string
  owner: string
  grinds: string
  spentGrinds: string
  unspentGrinds: string
  pools: string[]
}

function IntentsTable() {
  const { intentsNFT, isConnected } = useProtocolContext()

  const [tableData, setTableData] = useState<IntentData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isMobile = useIsMobile(945)

  useEffect(() => {
    if (isConnected && intentsNFT) {
      fetchIntents()
    }
  }, [isConnected, intentsNFT])

  const fetchIntents = async () => {
    setIsLoading(true)
    try {
      const intentInfos: IIntentsNFT.IntentStructOutput[] = await intentsNFT!.getIntents([0])

      const formattedData = intentInfos.map((intent, index) => {
        return {
          id: index.toString(),
          owner: intent.owner,
          grinds: intent.grinds.toString(),
          spentGrinds: intent.spentGrinds.toString(),
          unspentGrinds: intent.unspentGrinds.toString(),
          pools: intent.poolIds.map(id => id.toString())
        }
      })

      setTableData(formattedData)
    } catch (err) {
      console.error("Failed to fetch intents", err)
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className={`${styles["header"]} table-header`}>
        <h2 className={`${styles["title"]}`}>Explore Intents NFTs</h2>
        <div className={`${styles["search"]} table-search`}>
          <input
            placeholder="Search with token id"
            type="text"
          />
        </div>
      </div>
      {tableData?.map((data, index) => 
        <div className={styles["intent"]} key={index}>
          <div className={styles["content"]}>
            <div className={styles["intent-header"]}>
              <div className={styles["intent-header-left"]}>
                <img className={styles["network-img"]} alt="Network Icon" src={logoArbitrum} />
                <h3 className={styles["intent-title"]}>Intent Id: {data.id}</h3>
              </div>
            </div>
            <div className={styles["body"]}>
              <CopiedAddress className={styles["copy-address"]} address={isMobile ? shortenAddress(data.owner, 16) : data.owner} fullAddress={data.owner} label="Owner:"/>
              <div className={styles["infos"]}>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Grinds:</div>
                  <div className={styles["block-text"]}>{data.grinds}</div>
                </div>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Spent Grinds:</div>
                  <div className={styles["block-text"]}>{data.spentGrinds}</div>
                </div>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Unspent Grinds:</div>
                  <div className={styles["block-text"]}>{data.unspentGrinds}</div>
                </div>
                <div className={styles["block"]}>
                  <div className={styles["block-title"]}>Pools:</div>
                  <div className={styles["block-text"]}>{data.pools.join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default IntentsTable