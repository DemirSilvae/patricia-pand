import React, { useEffect, useState } from 'react'

import styles from './Switcher.module.scss'

type SwitcherProps = {
  label?: string
  defaultValue?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
}

export const Switcher: React.FC<SwitcherProps> = ({
  label,
  defaultValue = true,
  value,
  onChange,
}) => {
  const [isOn, setIsOn] = useState(value ?? defaultValue)

  useEffect(() => {
    if (value !== undefined) {
      setIsOn(value)
    }
  }, [value])

  const toggle = () => {
    const newValue = !isOn
    setIsOn(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={styles['wrapper']}>
      <div className={`${styles['switch']} ${isOn ? styles['on'] : ''}`} onClick={toggle}>
        <div className={styles['thumb']} />
      </div>
      {label && <span className={styles['label']}>{label}</span>}
    </div>
  )
}
