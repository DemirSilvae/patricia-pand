import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import visible from '../../../../assets/images/eye.svg'
import logoArbitrum from '../../../../assets/images/logoArbitrum.png'
import styles from './AgentsTable.module.scss'

interface Pool {
  id: string
  balance: string
}

interface AgentData {
  id: string
  strategyId: string
  quoteTokenSymbol: string
  baseTokenSymbol: string
  reserve: string
  active: string
  quoteYield: string
  baseYield: string
  quoteTrade: string
  baseTrade: string
  pools: Pool[]
}

function AgentsTable() {
  const [tableData, setTableData] = useState<AgentData[] | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data: AgentData[] = [
      {
        id: '0',
        strategyId: '1',
        quoteTokenSymbol: 'USDT',
        baseTokenSymbol: 'WETH',
        reserve: '300',
        active: '700',
        quoteYield: '0.020076',
        baseYield: '0.0000054',
        quoteTrade: '0.020076',
        baseTrade: '0.0000054',
        pools: [
          { id: '0', balance: '100' },
          { id: '1', balance: '100' },
          { id: '2', balance: '100' },
          { id: '3', balance: '100' },
          { id: '3', balance: '100' },
        ],
      },
    ]
    setTableData(data)
  }, [])

  const handleViewagent = (agentId: string) => {
    navigate(`/agent/${agentId}`)
  }

  return (
    <>
      <div className={`${styles['header']} table-header`}>
        <h2 className={`${styles['title']}`}>Explore Agents</h2>
        <div className={`${styles['search']} table-search`}>
          <input placeholder="Search with agent id" type="text" />
        </div>
      </div>
      {tableData?.map((data, index) => (
        <div className={styles['agent']} key={index}>
          <div className={styles['agent-header']}>
            <div className={styles['agent-header-left']}>
              <img className={styles['network-img']} alt="Network Icon" src={logoArbitrum} />
              <h3 className={styles['agent-title']}>Agent Id: {data.id}</h3>
            </div>
            <div className={styles['agent-header-right']}>
              <div className={styles['strategy']}>
                <b>Strategy Id:</b> {data.strategyId}
              </div>
              <div
                className={styles['tokens']}
              >{`${data.quoteTokenSymbol} / ${data.baseTokenSymbol}`}</div>
            </div>
          </div>
          <div className={styles['body']}>
            <div className={styles['content']}>
              <div className={styles['info-params']}>
                <div className={styles['column']}>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Reserve Balance:</div>
                    <div className={styles['block-text']}>
                      {data.reserve} {data.quoteTokenSymbol}
                    </div>
                  </div>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Yield Profit:</div>
                    <div className={styles['block-text']}>
                      <div>{`${data.quoteYield} ${data.quoteTokenSymbol}`}</div>
                      <div>{`${data.baseYield} ${data.baseTokenSymbol}`}</div>
                    </div>
                  </div>
                </div>
                <div className={styles['column']}>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Active Balance:</div>
                    <div className={styles['block-text']}>
                      {data.active} {data.quoteTokenSymbol}
                    </div>
                  </div>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Trade Profit:</div>
                    <div className={styles['block-text']}>
                      <div>{`${data.quoteTrade} ${data.quoteTokenSymbol}`}</div>
                      <div>{`${data.baseTrade} ${data.baseTokenSymbol}`}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['info-params-mobile']}>
                <div className={styles['column']}>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Reserve Balance:</div>
                    <div className={styles['block-text']}>
                      {data.reserve} {data.quoteTokenSymbol}
                    </div>
                  </div>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Active Balance:</div>
                    <div className={styles['block-text']}>
                      {data.active} {data.quoteTokenSymbol}
                    </div>
                  </div>
                </div>
                <div className={styles['column']}>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Yield Profit:</div>
                    <div className={styles['block-text']}>
                      <div>{`${data.quoteYield} ${data.quoteTokenSymbol}`}</div>
                      <div>{`${data.baseYield} ${data.baseTokenSymbol}`}</div>
                    </div>
                  </div>
                  <div className={styles['block']}>
                    <div className={styles['block-title']}>Trade Profit:</div>
                    <div className={styles['block-text']}>
                      <div>{`${data.quoteTrade} ${data.quoteTokenSymbol}`}</div>
                      <div>{`${data.baseTrade} ${data.baseTokenSymbol}`}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['pools']}>
                {data.pools.map((pool, poolIndex) => (
                  <div className={styles['pool']} key={poolIndex}>
                    <div className={styles['pool-value']}>Pool Id: {pool.id}</div>
                    <div className={styles['pool-value']}>Balance: {pool.balance}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles['buttons']}>
              <button
                onClick={() => handleViewagent(data.id)}
                className={`${styles['view-button']} ${styles['button']} button`}
              >
                <img className={styles['view-img']} src={visible} alt="Eye Icon" />
                View Agent
              </button>
              <button onClick={() => console.log(data.id)} className={`${styles['button']} button`}>
                Grind
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default AgentsTable
