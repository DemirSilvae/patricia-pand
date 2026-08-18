import PositionsTable from './positions/PositionsTable'
import styles from './Tables.module.scss'
import ThresholdsTable from './thresholds/ThresholdsTable'

type TablesProps = {
  poolId: number
}

const Tables = ({ poolId }: TablesProps) => {
  return (
    <section className={styles['tables']}>
      <div className={`${styles['container']} container`}>
        <PositionsTable poolId={poolId} />
        <ThresholdsTable poolId={poolId} />
      </div>
    </section>
  )
}

export default Tables
