import React, { useState } from 'react'
import { Slider } from 'antd'

function SliderWithNumber() {
  const [inputValue, setInputValue] = useState(1)
  const onChange = (newValue: number) => {
    setInputValue(newValue)
  }

  return <Slider min={1} max={20} onChange={onChange} value={typeof inputValue === 'number' ? inputValue : 0} />
}

export default SliderWithNumber
