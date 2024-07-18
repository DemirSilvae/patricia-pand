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

type OptionProps = {
  value: string
  children: ReactNode
  onSelect?: (value: string) => void
  isSelected?: boolean
}

export const Option: React.FC<OptionProps> = ({ children, onSelect, value }) => {
  return (
    <div className={styles['option']} onClick={() => onSelect?.(value)}>
      {children}
    </div>
  )
}

type SelectProps = {
  children: ReactNode
  onChange?: (value: string) => void
}

export const Select: React.FC<SelectProps> = ({ children, onChange }) => {
  const options = Children.toArray(children).filter(isValidElement) as ReactElement<OptionProps>[]

  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      const first = options[0].props
      setSelectedValue(first.value)
      onChange?.(first.value)
    }
  }, [selectedValue, options, onChange])

  const selectedLabel = options.find((child) => child.props.value === selectedValue)?.props.children

  const handleSelect = (value: string) => {
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
    <div className={styles['select-wrapper']}>
      <div className={styles['select-trigger']} onClick={() => setIsOpen((prev) => !prev)}>
        {selectedLabel || 'Select...'}
      </div>
      {isOpen && <div className={styles['options-list']}>{renderedOptions}</div>}
    </div>
  )
}