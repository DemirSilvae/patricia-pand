import { useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { shortenAddress } from '../../utils/addresses'
import styles from './ConnectButton.module.scss'

export default function ConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  return (
    <button 
      className={`${styles["button"]} button`}
      onClick={() => open()}
    >
      {isConnected && address ? shortenAddress(address) : "Connect Wallet"}
    </button>
  )
}