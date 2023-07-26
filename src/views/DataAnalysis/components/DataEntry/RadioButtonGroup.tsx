import React, { useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio } from 'antd'

const RadioButtonGroup = (props: any) => {
  const [value, setValue] = useState('iqr')
  const { onChangeValue } = props

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    setValue(e.target.value)
    // onChangeValue(e.target.value)
  }

  return (
    <Radio.Group onChange={onChange} value={value}>
      <Radio value={'iqr'}>IQR</Radio>
      <Radio value={'std'}>STD</Radio>
    </Radio.Group>
  )
}

export default RadioButtonGroup
