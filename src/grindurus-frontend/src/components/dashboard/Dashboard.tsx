import { useEffect } from 'react'

import Panel from './panel/Panel'
import Tables from './tables/Tables'

function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Panel />
      <Tables />
    </>
  )
}

export default Dashboard
