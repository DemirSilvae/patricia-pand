import styles from './Header.module.scss'
import { useProtocolContext } from '../../../context/ProtocolContext'
import { Link } from 'react-router-dom'

type HeaderProps = {
  poolId: number
}

function Header({ poolId }: HeaderProps) {
  const { visiblePoolIds } = useProtocolContext()

  const currentIndex = visiblePoolIds.indexOf(poolId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < visiblePoolIds.length - 1

  return (
    <div className={styles["header"]}>
      <div className={styles["title"]}>Pool #{poolId}</div>
      <div className={styles["buttons"]}>
        {hasPrev ? (
          <Link className={`${styles["button"]} button`} to={`/pool/${visiblePoolIds[currentIndex - 1]}`}>Prev</Link>
        ) : (
          <button className={`${styles["button"]} ${styles["disabled"]} button`}>Prev</button>
        )}
        {hasNext ? (
          <Link className={`${styles["button"]} button`} to={`/pool/${visiblePoolIds[currentIndex + 1]}`}>Next</Link>
        ) : (
          <button className={`${styles["button"]} ${styles["disabled"]} button`}>Next</button>
        )}
      </div>
    </div>
  )
}

export default Header