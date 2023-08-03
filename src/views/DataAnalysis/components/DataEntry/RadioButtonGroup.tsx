import React, { useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Tooltip } from 'antd'

const RadioButtonGroup = (props: any) => {
  const [value, setValue] = useState('iqr')
  const { onChangeValue } = props

  const onChange = (e: RadioChangeEvent) => {
    // console.log('radio checked', e.target.value)
    setValue(e.target.value)
    onChangeValue(e.target.value)
  }

  return (
    <Radio.Group onChange={onChange} value={value}>
      <Tooltip placement="bottom" title="IQR : ">
        <Radio value={'iqr'}>IQR</Radio>
      </Tooltip>
      <Tooltip placement="bottom" title="STD : ">
        <Radio value={'std'}>STD</Radio>
      </Tooltip>
    </Radio.Group>
  )
}

export default RadioButtonGroup
