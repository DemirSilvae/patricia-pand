import styles from './IntentsTable.module.scss'
import { useEffect, useState } from 'react'
import logoArbitrum from '../../../../assets/images/logoArbitrum.png'
import { Table } from '../../../ui'
import { shortenAddress } from '../../../../utils/addresses'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IIntentsNFT } from '../../../../typechain-types/IntentsNFT'

function IntentsTable() {
  const [tableData, setTableData] = useState<any[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { intentsNFT, isConnected } = useProtocolContext()

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
        return [
          <img src={logoArbitrum} alt="Network" style={{ width: 30, height: 30 }} />,
          index,
          shortenAddress(intent.owner),
          intent.grinds.toString(),
          intent.poolIds.map(id => id.toString()).join(", "),
        ]
      })

      setTableData(formattedData)
    } catch (error) {
      console.error("Failed to fetch intents", error)
    }
    setIsLoading(false)
  }

  const headers = ["Network", "Id", "Address", "Grinds", "Pool IDs"]

  return (
    <>
      <div className="table-header">
        <h2 className="table-title">Explore intents NFTs</h2>
        <div className="table-search">
          <input
            placeholder="Search with token id or owner address"
            type="text"
          />
        </div>
      </div>
      <Table headers={headers} data={tableData} isLoading={isLoading} />
    </>
  )
}

export default IntentsTable