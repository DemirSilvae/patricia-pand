import styles from './Panel.module.scss'
import Controller from './controller/Controller'
import PoolInfo from './info/PoolInfo'

type PanelProps = {
  poolId: number
}

const Panel = ({ poolId }: PanelProps) => {
  return (
    <section className={styles["panel"]}>
      <div className={`${styles["container"]} container`}>
        <PoolInfo poolId={poolId}/>
        <Controller poolId={poolId}/>
      </div>
    </section>
  )
}

export default Panel