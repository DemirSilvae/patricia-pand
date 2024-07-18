import React, { ReactNode } from 'react'

interface FormGroupProps {
  label?: string
  children: ReactNode
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children }) => {
  return (
    <div className="form-group">
      {label && <div className="form-label">{label}</div>}
      {children}
    </div>
  )
}