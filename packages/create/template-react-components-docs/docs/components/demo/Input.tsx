import { useState } from 'react'
import { Input } from '@src/index'

export default function Demo() {
  const [value, setValue] = useState('please input')

  return <Input value={value} onChange={e => setValue(e)} />
}
