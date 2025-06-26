import styles from './Panel.module.scss'
import PoolInfo from './info/PoolInfo'
import Header from '../header/Header'
import Interaction from './intercation/Interaction'
import Configuration from './configuration/Configuration'

type PanelProps = {
  poolId: number
}

const Panel = ({ poolId }: PanelProps) => {
  return (
    <section className={styles["panel"]}>
      <div className={`${styles["container"]} container`}>
        <Header poolId={poolId}/>
        <div className={styles["content"]}>
          <PoolInfo poolId={poolId}/>
          <Interaction poolId={poolId}/>
        </div>
        <Configuration poolId={poolId}/>
      </div>
    </section>
  )
}

export default Panel