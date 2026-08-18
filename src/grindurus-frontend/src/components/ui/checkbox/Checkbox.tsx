import React, { ReactNode, useState } from 'react'

import checkIcon from '../../../assets/images/checkBlack.svg'
import styles from './Checkbox.module.scss'

type CheckboxProps = {
  children: ReactNode
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  defaultChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(defaultChecked)

  const toggle = () => {
    const newChecked = !checked
    setChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <div className={styles['checkbox']} onClick={toggle}>
      <div className={`${styles['box']} ${checked ? styles['checked'] : ''}`}>
        {checked && <img src={checkIcon} alt="Check Icon" />}
      </div>
      <div className={styles['text']}>{children}</div>
    </div>
  )
}
