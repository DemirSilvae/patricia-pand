import styles from './Header.module.scss'
import { useState } from 'react'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { Link } from 'react-router-dom'
import ConnectButton from '../connect/ConnectButton'
import logo from '../../assets/logo.svg'
import menuIcon from '../../assets/icons/menu.svg'
import closeIcon from '../../assets/icons/close.svg'

function Header() {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  return (
    <header className={styles["header"]}>
      <div className={`${styles["container"]} container`}>
        <Link to="/" className={styles["logo"]}>
          <img src={logo} alt="GrindURUS Logo" />
          <div className={styles["text"]}>GrindURUS</div>
        </Link>
        <nav className={`${styles['navigation']} ${isMenuOpen ? styles["active"] : ""}`}>
          <ul className={styles['menu']}>
            <li className={styles['menu-item']}><Link to="/" className={styles['menu-link']}>Dashboard</Link></li>
            <li className={styles['menu-item']}><Link to="/greth" className={styles['menu-link']}>grETH</Link></li>
            {/* <li className={styles['menu-item']}><Link to="grinder-ai" className={styles['menu-link']}>GrinderAI</Link></li> */}
            <li className={styles['menu-item']}><Link to="grai" className={styles['menu-link']}>grAI</Link></li>
          </ul>
          <div className={styles["navigation-buttons"]}>
            <button className={`${styles["button"]} ${styles['network-button']} button`} onClick={() => open({view: 'Networks'})}>
              <div className={styles['button-image']}>
                <img src={caipNetwork?.assets?.imageUrl} alt="Chain Icon" />
              </div>
              {caipNetwork?.name}
            </button>
            <ConnectButton className={styles["connect-button"]} />
          </div>
        </nav>
        <div className={styles['buttons']}>
          <button className={`${styles["button"]} ${styles['network-button']} button`} onClick={() => open({view: 'Networks'})}>
            <div className={styles['button-image']}>
              <img src={caipNetwork?.assets?.imageUrl} alt="Chain Icon" />
            </div>
            {caipNetwork?.name}
          </button>
          <ConnectButton />
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${styles["menu-button"]} ${isMenuOpen ? styles["active"] : ""}`}>
          <div className={styles["open"]}>
            <img src={menuIcon} alt="Menu Icon" />
          </div>
          <div className={styles["close"]}>
            <img src={closeIcon} alt="Close Icon" />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header