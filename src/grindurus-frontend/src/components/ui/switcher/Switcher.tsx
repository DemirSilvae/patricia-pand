import React, { useState, useEffect } from 'react'
import styles from './Switcher.module.scss'

type SwitcherProps = {
  label?: string
  defaultValue?: boolean
  onChange?: (value: boolean) => void
}

export const Switcher: React.FC<SwitcherProps> = ({ label, defaultValue = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultValue)

  useEffect(() => {
    onChange?.(isOn)
  }, [isOn, onChange])

  const toggle = () => setIsOn((prev) => !prev)

  return (
    <div className={styles["wrapper"]}>
      <div
        className={`${styles["switch"]} ${isOn ? styles["on"] : ''}`}
        onClick={toggle}
      >
        <div className={styles["thumb"]} />
      </div>
      {label && <span className={styles["label"]}>{label}</span>}
    </div>
  )
}