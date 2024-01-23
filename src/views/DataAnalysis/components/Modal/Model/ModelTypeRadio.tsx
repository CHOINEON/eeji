import { Radio } from 'antd'
import { Label, Wrapper } from 'components/fields/Wrapper'
import React from 'react'

interface IModelTypeRadio {
  onChange: any
}

const ModelTypeRadio = (props: IModelTypeRadio) => {
  const { onChange } = props

  const handleChange = (e: any) => {
    onChange(e.target.value)
  }

  return (
    <>
      <Wrapper>
        <Label hasFileName={false}>Model Type</Label>
        <Radio.Group
          onChange={handleChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={'pytorch'}
          style={{ float: 'right', margin: 7 }}
        >
          <Radio value={'pytorch'}>PyTorch</Radio>
          <Radio value={'keras'}>Keras</Radio>
          <Radio value={'sklearn'}>sklearn</Radio>
        </Radio.Group>
      </Wrapper>
    </>
  )
}

export default ModelTypeRadio
