import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Panel from './panel/Panel'
import Tables from './tables/Tables'

function Pool() {
  const { poolId: id } = useParams()
  const poolId = Number(id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Panel poolId={poolId} />
      <Tables poolId={poolId} />
    </>
  )
}

export default Pool
