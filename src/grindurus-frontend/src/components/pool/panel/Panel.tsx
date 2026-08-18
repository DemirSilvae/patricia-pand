import Header from '../header/Header'
import Configuration from './configuration/Configuration'
import PoolInfo from './info/PoolInfo'
import Interaction from './intercation/Interaction'
import styles from './Panel.module.scss'

type PanelProps = {
  poolId: number
}

const Panel = ({ poolId }: PanelProps) => {
  return (
    <section className={styles['panel']}>
      <div className={`${styles['container']} container`}>
        <Header poolId={poolId} />
        <div className={styles['content']}>
          <PoolInfo poolId={poolId} />
          <Interaction poolId={poolId} />
        </div>
        <Configuration poolId={poolId} />
      </div>
    </section>
  )
}

export default Panel
