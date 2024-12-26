import React, {
  useState,
  ReactElement,
  ReactNode,
  Children,
  cloneElement,
  isValidElement,
  useEffect,
} from 'react'
import styles from './Select.module.scss'

type OptionProps<T = unknown> = {
  value: T
  children: ReactNode
  onSelect?: (value: T) => void
  isSelected?: boolean
}

export const Option = <T,>({ children, onSelect, value }: OptionProps<T>) => {
  return (
    <div className={styles['option']} onClick={() => onSelect?.(value)}>
      {children}
    </div>
  )
}

type SelectProps<T = unknown> = {
  children: ReactNode
  onChange?: (value: T) => void
  className?: string
}

export const Select = <T,>({ children, onChange, className = '' }: SelectProps<T>) => {
  const options = Children.toArray(children).filter(isValidElement) as ReactElement<OptionProps<T>>[]

  const [selectedValue, setSelectedValue] = useState<T | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (selectedValue === null && options.length > 0) {
      const first = options[0].props
      setSelectedValue(first.value)
      onChange?.(first.value)
    }
  }, [selectedValue, options, onChange])

  const selectedLabel = options.find((child) => child.props.value === selectedValue)?.props.children

  const handleSelect = (value: T) => {
    setSelectedValue(value)
    setIsOpen(false)
    onChange?.(value)
  }

  const renderedOptions = options.map((child) =>
    cloneElement(child, {
      onSelect: handleSelect,
      isSelected: selectedValue === child.props.value,
    })
  )

  return (
    <div className={`${styles['select-wrapper']} ${className}`}>
      <div className={styles['select-trigger']} onClick={() => setIsOpen((prev) => !prev)}>
        {selectedLabel || 'Select...'}
      </div>
      {isOpen && <div className={styles['options-list']}>{renderedOptions}</div>}
    </div>
  )
}