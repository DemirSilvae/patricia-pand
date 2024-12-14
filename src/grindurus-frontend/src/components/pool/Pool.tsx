import styles from './Pool.module.scss'
import { useParams } from 'react-router-dom'
import Header from './header/Header'
import Panel from './panel/Panel'
import Tables from './tables/Tables'

function Pool() {
  const { poolId: id } = useParams()
  const poolId = Number(id)

  return (
    <>
      <Header poolId={poolId} />
      <Panel poolId={poolId} />
      <Tables poolId={poolId} />
    </>
  )
}

export default Pool