import React, { useState, ReactNode } from 'react'
import styles from './Checkbox.module.scss'

type CheckboxProps = {
  children: ReactNode
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ children, defaultChecked = false, onChange }) => {
  const [checked, setChecked] = useState(defaultChecked)

  const toggle = () => {
    const newChecked = !checked
    setChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <label className={styles['label']} onClick={toggle}>
      <div className={`${styles['box']} ${checked ? styles['checked'] : ''}`}>
        {checked && <span className={styles['checkmark']}>✔</span>}
      </div>
      <span className={styles['text']}>{children}</span>
    </label>
  )
}