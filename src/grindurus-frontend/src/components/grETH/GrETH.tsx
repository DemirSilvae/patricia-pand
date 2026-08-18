import { useEffect } from 'react'

import Burn from './burn/Burn'
import styles from './GrETH.module.scss'
import Mint from './mint/Mint'

function GrETH() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className={styles['greth']}>
      <div className={`${styles['container']} container`}>
        <div className={styles['left']}>
          <Burn />
        </div>
        <div className={styles['right']}>
          <Mint />
        </div>
      </div>
    </section>
  )
}

export default GrETH
