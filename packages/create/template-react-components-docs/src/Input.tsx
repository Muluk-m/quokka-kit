import React from 'react'

interface InputProps {
  onChange?: (value: string) => void
  value?: string
}

/**
 * Input
 */
export const Input: React.FC<InputProps> = ({ onChange, value }) => {
  return <input value={value} onChange={e => onChange?.(e.target.value)} />
}
