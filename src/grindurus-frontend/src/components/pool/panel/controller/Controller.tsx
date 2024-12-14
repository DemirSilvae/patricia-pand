import styles from './Controller.module.scss'
import { useState } from 'react'
import Interaction from './intercation/Interaction'
import Configuration from './configuration/Configuration'

type ControllerProps = {
  poolId: number
}

const Controller = ({ poolId }: ControllerProps) => {
  const [mode, setMode] = useState<'interaction' | 'configuration'>('interaction')

  return (
    <div className={styles["controller"]}>
      <div className={styles["buttons"]}>
        <button onClick={() => setMode("interaction")} className="button">
          Interaction
        </button>
        <button onClick={() => setMode("configuration")} className="button">
          Configuration
        </button>
      </div>
      {mode === "interaction" ? 
        <Interaction poolId={poolId}/> : 
        <Configuration poolId={poolId}/>
      }
    </div>
  )
}

export default Controller