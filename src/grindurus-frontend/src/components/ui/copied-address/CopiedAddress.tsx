import React, { useState } from 'react'
import styles from './CopiedAddress.module.scss'
import copyIcon from '../../../assets/images/copy.svg'
import checkIcon from '../../../assets/images/check.svg'

type CopiedAddressProps = {
  address: string
}

const CopiedAddress = ({ address }: CopiedAddressProps) => {
  const [copied, setCopied] = useState(false)
  const etherscanUrl = `https://arbiscan.io/address/${address}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className={styles["container"]}>
      <a
        href={etherscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles["address"]}
      >
        {address}
      </a>
      <button onClick={handleCopy} className={styles["copy-button"]} title="Copy address">
        <img src={copied ? checkIcon : copyIcon} alt="Copy icon" />
      </button>
    </div>
  )
}

export default CopiedAddress