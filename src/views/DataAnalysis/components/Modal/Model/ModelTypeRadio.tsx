import { Radio } from 'antd'
import { Label, Wrapper } from 'components/fields/Wrapper'
import React from 'react'

const ModelTypeRadio = () => {
  return (
    <>
      <Wrapper>
        <Label hasFileName={false}>Model Type</Label>
        <Radio.Group optionType="button" buttonStyle="solid" defaultValue={1} style={{ float: 'right', margin: 7 }}>
          <Radio value={1}>PyTorch</Radio>
          <Radio value={2}>keras</Radio>
          <Radio value={3}>sklearn</Radio>
        </Radio.Group>
      </Wrapper>
    </>
  )
}

export default ModelTypeRadio
