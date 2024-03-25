import { Radio, Tooltip } from 'antd'
import ColumnLabel from 'components/fields/ColumnLabel'
import { Label, Wrapper } from 'components/fields/Wrapper'
import React from 'react'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'

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
          <span>
            모델 유형
            <InfoCircle content={`pytorch(.pt) Keras(.h5) sklearn(.pkl, .pickle)`} />
          </span>
        </Label>
        <Radio.Group
          onChange={handleChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={'torch'}
          style={{ float: 'right', margin: 7 }}
        >
          <Radio value={'torch'}>
            <Tooltip title=".pt">PyTorch</Tooltip>
          </Radio>
          <Radio value={'keras'}>
            <Tooltip title=".h5">Keras</Tooltip>
          </Radio>
          <Radio value={'sklearn'}>
            <Tooltip title=".pkl, .pickle">sklearn</Tooltip>
          </Radio>
        </Radio.Group>
      </Wrapper>
    </>
  )
}

export default ModelTypeRadio
