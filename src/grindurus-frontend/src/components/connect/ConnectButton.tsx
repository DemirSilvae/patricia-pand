import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

import { shortenAddress } from '../../utils/addresses'
import styles from './ConnectButton.module.scss'

interface ConnectButtonProps {
  className?: string
}

export default function ConnectButton({ className }: ConnectButtonProps) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  return (
    <button className={`${styles['button']} button ${className ?? ''}`} onClick={() => open()}>
      {isConnected && address ? shortenAddress(address) : 'Connect Wallet'}
    </button>
  )
}
