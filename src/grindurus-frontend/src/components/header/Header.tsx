import styles from './Header.module.scss'
import React from 'react'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { Link } from 'react-router-dom'
import ConnectButton from '../connect/ConnectButton'
import logo from '../../assets/logo.svg'

function Header() {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork()

  return (
    <header className={styles.header}>
      <div className={`${styles["container"]} container`}>
        <Link to="/" className={styles['logo']}>
          <img src={logo} alt="GrindURUS Logo" />
          <div>GrindURUS</div>
        </Link>
        <nav className={styles['navigation']}>
          <ul className={`${styles['menu']} ${styles.menu}`}>
            <li className={styles['menu-item']}><Link to="/" className={styles['menu-link']}>Dashboard</Link></li>
            <li className={styles['menu-item']}><Link to="/greth" className={styles['menu-link']}>grETH</Link></li>
            <li className={styles['menu-item']}><Link to="grinder-ai" className={styles['menu-link']}>GrinderAI</Link></li>
          </ul>
        </nav>
        <div className={styles['buttons']}>
          <button className={`${styles.button} ${styles['network-button']} button`} onClick={() => open({view: 'Networks'})}>
            <div className={styles['button-image']}>
              <img src={caipNetwork?.assets?.imageUrl} alt="Chain Icon" />
            </div>
            {caipNetwork?.name}
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header