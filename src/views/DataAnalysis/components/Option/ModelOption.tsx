import styled from '@emotion/styled'
import { Col, Collapse, DatePicker, DatePickerProps, Input, InputNumber, Row, Select, Space } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { inputOptionListState, userInputOptionState } from 'views/DataAnalysis/store/userOption/atom'

const LabelBox = styled.div`
  //   text-align: center;
  // font-size: 15px;
  // color: #002d65;
  // font-weight: bold;
`

const ModelOption = () => {
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  // const [optionDisabled, setOptionDisabled]= useState()
  const [disabled, setDisabled] = useState(false)
  const model = ['pls', 'rfr']

  const onModelChange = (param: any) => {
    setUserInputOption({ ...userInputOption, type_model: param })
  }
  const onMaChange = (param: any) => {
    setUserInputOption({ ...userInputOption, number_ma: param })
  }

  return (
    // <Collapse
    //   ghost
    //   size="small"
    //   collapsible="header"
    //   //   defaultActiveKey={['1']}
    //   items={[
    //     {
    //       key: '2',
    //       label: 'Model',
    //       children: (
    <>
      <Col style={{ minHeight: '423px' }}>
        <Row>
          <LabelBox>이동평균</LabelBox>
          <InputNumber
            style={{ width: '100%' }}
            width="100%"
            min={1}
            max={10}
            defaultValue={1}
            //   value={inputValue}
            onChange={onMaChange}
          />
        </Row>
        <Row>
          <LabelBox>모델</LabelBox>
          <Select
            defaultValue="not-selected"
            style={{ width: 120 }}
            onChange={onModelChange}
            options={[
              // { value: 'ineeji', label: 'INEEJI' },
              { value: 'pls', label: 'PLS' },
              { value: 'rfr', label: 'Random Forest' },
              { value: 'cnn1d', label: '1DCNN' },
              { value: 'mlp', label: 'MLP' },
              { value: 'cnnlstm', label: 'CNNLSTM' },
              { value: 'lstm', label: 'LSTM' },
              // { value: 'pls_1dcnn', label: 'PLS_1DCNN' },
              { value: 'nbeats', label: 'NBEATS' },
              { value: 'nhits', label: 'NHITS' },
              { value: 'nlinear', label: 'NLINEAR' },
              { value: 'tstmodel', label: 'TSTMODEL' },
              { value: 'tftmodel', label: 'TFTMODEL' },
            ]}
          />
        </Row>
        <Row>
          <LabelBox>epoch</LabelBox>
          <InputNumber
            style={{ width: '100%' }}
            defaultValue="10"
            disabled={!model.includes(userInputOption.type_model)}
            onChange={(value: any) => setUserInputOption({ ...userInputOption, number_epoch: value })}
          />

          <LabelBox>베이지안 탐색 횟수</LabelBox>
          <InputNumber
            min={1}
            max={20}
            style={{ width: '100%' }}
            defaultValue={1}
            disabled={!model.includes(userInputOption.type_model)}
            onChange={(value: any) => setUserInputOption({ ...userInputOption, number_beyssian: value })}

            //   value={inputValue}
            //   onChange={onChange}
          />
        </Row>
      </Col>
    </>
    //       ),
    //     },
    //   ]}
    // />
  )
}

export default ModelOption
