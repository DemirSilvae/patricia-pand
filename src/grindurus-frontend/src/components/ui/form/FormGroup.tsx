import React, { ReactNode } from 'react'

interface FormGroupProps {
  label?: string
  children: ReactNode
  className?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children, className = '' }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <div className="form-label">{label}</div>}
      {children}
    </div>
  )
}
