import styles from './Tables.module.scss'
import { useState } from 'react'
import PoolsTable from './pools/PoolsTable'
import IntentsTable from './intents/IntentsTable'

type TablesToShow = "pools" | "intents" | "agents"

function Tables() {
  const [showTable, setShowTable] = useState<TablesToShow>("pools")

  return (
    <section>
      <div className="container">
        <div className={styles["tables"]}>
          <div className={styles["select"]}>
            <button
              onClick={() => setShowTable('pools')}
              className={`${styles["select-button"]} ${showTable === "pools" ? styles["active"] : ""} button`}
            >
              Pools
            </button>
            <button
              onClick={() => setShowTable('intents')}
              className={`${styles["select-button"]} ${showTable === "intents" ? styles["active"] : ""} button`}
            >
              Intents
            </button>
            <button
              onClick={() => setShowTable('agents')}
              className={`${styles["select-button"]} ${showTable === "agents" ? styles["active"] : ""} button`}
            >
              Agents
            </button>
          </div>
          {showTable == "pools" ? <PoolsTable/> : <IntentsTable/>}
        </div>
      </div>
    </section>
  )
}

export default Tables