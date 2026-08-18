import React, { useEffect } from 'react'

import { FormGroup } from '../form/FormGroup'
import styles from './InputModal.module.scss'

type InputModalProps = {
  open: boolean
  onClose: () => void
  onAddressChange: (value: string) => void
}

export const InputModal: React.FC<InputModalProps> = ({ open, onClose, onAddressChange }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [open])

  if (!open) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddressChange(e.target.value)
  }

  return (
    <div className={styles['modal-backdrop']} onClick={onClose}>
      <div className={`${styles['modal']} form`} onClick={e => e.stopPropagation()}>
        <FormGroup label="Receiver Wallet Address">
          <div className="form-input">
            <input type="text" placeholder="Enter address..." onChange={handleInputChange} />
          </div>
        </FormGroup>
        <button className={`${styles['submit-button']} button`} onClick={onClose}>
          Submit
        </button>
      </div>
    </div>
  )
}
