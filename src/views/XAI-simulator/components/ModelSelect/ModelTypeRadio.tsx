import { Radio } from 'antd'
import ColumnLabel from 'components/fields/ColumnLabel'
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
        <Label hasFileName={false}>
          <span className={'text-red-500'}>* </span>
          <span>모델 유형</span>
        </Label>
        <Radio.Group
          onChange={handleChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={'keras'}
          style={{ float: 'right', margin: 7 }}
        >
          <Radio value={'pytorch'} disabled={true}>
            PyTorch
          </Radio>
          <Radio value={'keras'}>Keras</Radio>
          <Radio value={'sklearn'}>sklearn</Radio>
        </Radio.Group>
      </Wrapper>
    </>
  )
}

export default ModelTypeRadio
