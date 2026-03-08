import React from 'react'
import styles from './NumberView.module.scss'

interface NumberProps {
  value: string
  className?: string
}

export const NumberView: React.FC<NumberProps> = ({ value, className }) => {
  const parsed = parseFloat(value)
  const isValid = !isNaN(parsed)
  const isInteger = isValid && parsed % 1 === 0

  let displayValue = '—'
  let showTooltip = false

  if (isValid) {
    if (isInteger) {
      displayValue = parsed.toString()
    } else {
      const fixed = parsed.toFixed(1)
      displayValue = fixed + (fixed !== value ? '…' : '')
      showTooltip = fixed !== value
    }
  }

  return (
    <div className={`${styles["number-wrapper"]} ${className || ''}`}>
      <span className={styles["number-text"]}>{displayValue}</span>
      {showTooltip && (
        <div className={styles["number-tooltip"]}>{value}</div>
      )}
    </div>
  )
}