import React, { useState } from 'react'
import styles from './CopiedAddress.module.scss'
import copyIcon from '../../../assets/images/copy.svg'
import checkIcon from '../../../assets/images/check.svg'

type CopiedAddressProps = {
  address: string
  fullAddress: string
  label: string
}

export const CopiedAddress = ({ address, fullAddress, label }: CopiedAddressProps) => {
  const [copied, setCopied] = useState(false)
  const etherscanUrl = `https://arbiscan.io/address/${fullAddress}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 500)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className={styles["copy-address"]}>
      <div className={styles["label"]}>
        {label}
      </div>
      <div className={styles["content"]}>
        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["address-link"]}
        >
          {address}
        </a>
        <button onClick={handleCopy} className={styles["copy-button"]} title="Copy address">
          <img src={copied ? checkIcon : copyIcon} alt="Copy icon" />
        </button>
      </div>
    </div>
  )
}