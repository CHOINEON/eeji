import React, { useState } from 'react'
import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Switch,
} from 'antd'
import styled from '@emotion/styled'

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
const LabelBox = styled.div`
  //   text-align: center;
  font-size: 15px;
  color: #002d65;
  font-weight: bold;
`

const { RangePicker } = DatePicker
const modelOptions = [
  // { value: 'ineeji', label: 'INEEJI' },
  { value: 'plsr', label: 'INEEJI' },
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
]
//사용자가 모델 선택을 pls, rf => epoch은 비활성화

const OptionSetting = () => {
  const [disabled, setDisabled] = useState(true)

  const onChangeMissingValue = (param: any) => {
    console.log('param:', param)
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Ranges',
      children: (
        <>
          <Col span={24}>
            <LabelBox>시작/종료일</LabelBox>
            <RangePicker style={{ width: '100%' }} disabled={disabled} />
          </Col>
        </>
      ),
    },
    {
      key: '2',
      label: 'Data Preprocessing',
      children: (
        <>
          <Col span={24}>
            <Row>
              <LabelBox>결측치</LabelBox>
            </Row>
            <Row>
              <Col span={20}>
                <Select
                  defaultValue="test1"
                  onChange={onChangeMissingValue}
                  disabled={disabled}
                  options={[
                    { value: 'test1', label: '지정값으로 채우기' },
                    { value: 'test2', label: '결측치행 삭제' },
                    { value: 'test3', label: 'bfill' },
                    { value: 'test4', label: 'fill' },
                    { value: 'test5', label: '평균' },
                    { value: 'test6', label: '최빈값' },
                    { value: 'test7', label: 'min' },
                    { value: 'test8', label: 'max' },
                    { value: 'test9', label: '선형보간' },
                    { value: 'test10', label: '큐빅스플라인' },
                    { value: 'test11', label: '스플라인2차' },
                    { value: 'test12', label: '0으로 채우기' },
                    { value: 'test13', label: '다중대체' },
                    { value: 'test14', label: 'KNN' },
                  ]}
                />
              </Col>
              <Col span={4}>
                <Input defaultValue="0" disabled={disabled} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <LabelBox>이상치</LabelBox>
            <Row>
              <Col span={20}>
                <Select
                  defaultValue="test1"
                  style={{ width: 120 }}
                  disabled={disabled}
                  //   onChange={handleChange}
                  options={[
                    { value: 'test1', label: '표준편차' },
                    { value: 'test2', label: '백분위' },
                    { value: 'test3', label: 'IForest' },
                    { value: 'test4', label: 'Ransac' },
                  ]}
                />
              </Col>
              <Col span={4}>
                <Input defaultValue="0" disabled={disabled} />
              </Col>
            </Row>
          </Col>
          {/* <Divider orientation="center"></Divider> */}
        </>
      ),
    },
    {
      key: '3',
      label: 'Normalization',
      children: (
        <Col span={24}>
          <LabelBox>데이터 정규화</LabelBox>
          <Select
            defaultValue="test1"
            style={{ width: 120 }}
            disabled={disabled}
            //   onChange={handleChange}
            options={[
              { value: 'test1', label: '최대-최소' },
              { value: 'test2', label: '평균-분산' },
              { value: 'test3', label: '로버스트' },
            ]}
          />
        </Col>
      ),
    },
    {
      key: '4',
      label: 'Hyperparameter',
      children: (
        <>
          <Col>
            <LabelBox>epoch</LabelBox>
            <Input defaultValue="1000" disabled={disabled} />
          </Col>
          <Col>
            <LabelBox>베이지안 탐색 횟수</LabelBox>
            <InputNumber
              style={{ width: '100%' }}
              disabled={disabled}
              min={1}
              max={20}
              defaultValue={10}

              //   value={inputValue}
              //   onChange={onChange}
            />
          </Col>
        </>
      ),
    },
    {
      key: '5',
      label: 'Model',
      children: (
        <>
          {' '}
          <LabelBox>모델 선택</LabelBox>
          <Select
            options={modelOptions}
            value={modelOptions[0]}
            //   onChange={handleChange}
            // defaultValue={selectedArr}
          />
        </>
      ),
    },
  ]

  const onChange = (checked: boolean) => {
    setDisabled(checked)
  }

  return (
    <Container>
      <Row gutter={[24, 16]} style={{ width: '100%' }}>
        <Col span={18}>
          <RoundedBox minHeight={'35vw'}>
            <Skeleton.Image
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </RoundedBox>
        </Col>
        <Col span={6}>
          <RoundedBox minHeight={'35vw'}>
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
              <Switch defaultChecked checkedChildren="Auto" unCheckedChildren="Manual" onChange={onChange} />
            </div>
            {/* <Collapse items={items} defaultActiveKey={['1', '5']} /> */}
            <div>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <LabelBox>시작/종료일</LabelBox>
                  <RangePicker style={{ width: '100%' }} disabled={disabled} />
                </Col>
                <Col span={24}>
                  <Row>
                    <LabelBox>결측치</LabelBox>
                  </Row>
                  <Row>
                    <Col span={20}>
                      <Select
                        defaultValue="test1"
                        onChange={onChangeMissingValue}
                        disabled={disabled}
                        options={[
                          { value: 'test1', label: '지정값으로 채우기' },
                          { value: 'test2', label: '결측치행 삭제' },
                          { value: 'test3', label: 'bfill' },
                          { value: 'test4', label: 'fill' },
                          { value: 'test5', label: '평균' },
                          { value: 'test6', label: '최빈값' },
                          { value: 'test7', label: 'min' },
                          { value: 'test8', label: 'max' },
                          { value: 'test9', label: '선형보간' },
                          { value: 'test10', label: '큐빅스플라인' },
                          { value: 'test11', label: '스플라인2차' },
                          { value: 'test12', label: '0으로 채우기' },
                          { value: 'test13', label: '다중대체' },
                          { value: 'test14', label: 'KNN' },
                        ]}
                      />
                    </Col>
                    <Col span={4}>
                      <Input defaultValue="0" disabled={disabled} />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <LabelBox>이상치</LabelBox>
                  <Row>
                    <Col span={20}>
                      <Select
                        defaultValue="test1"
                        style={{ width: 120 }}
                        disabled={disabled}
                        //   onChange={handleChange}
                        options={[
                          { value: 'test1', label: '표준편차' },
                          { value: 'test2', label: '백분위' },
                          { value: 'test3', label: 'IForest' },
                          { value: 'test4', label: 'Ransac' },
                        ]}
                      />
                    </Col>
                    <Col span={4}>
                      <Input defaultValue="0" disabled={disabled} />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <LabelBox>데이터 정규화</LabelBox>
                  <Select
                    defaultValue="test1"
                    style={{ width: 120 }}
                    disabled={disabled}
                    //   onChange={handleChange}
                    options={[
                      { value: 'test1', label: '최대-최소' },
                      { value: 'test2', label: '평균-분산' },
                      { value: 'test3', label: '로버스트' },
                    ]}
                  />
                </Col>
                <Col span={24}>
                  <LabelBox>이동평균</LabelBox>
                  <Input defaultValue="1000" disabled={disabled} />
                </Col>
                {/* <Divider orientation="center"></Divider> */}

                <Col span={24}>
                  <LabelBox>베이지안 탐색 횟수</LabelBox>
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={disabled}
                    min={1}
                    max={20}
                    defaultValue={10}

                    //   value={inputValue}
                    //   onChange={onChange}
                  />
                </Col>
                <Col span={24}>
                  <LabelBox>모델 선택</LabelBox>
                  <Select
                    options={modelOptions}
                    value={modelOptions[0]}
                    //   onChange={handleChange}
                    // defaultValue={selectedArr}
                  />
                </Col>
                <Col span={24}>
                  <LabelBox>epoch</LabelBox>
                  <Input defaultValue="1000" disabled={disabled} />
                </Col>
              </Row>
            </div>
            <Row>
              <Button
                id="design_button"
                style={{
                  backgroundColor: '#4338F7',
                  color: '#fff',
                  borderRadius: '100px',
                  width: '100%',
                  marginTop: '20px',
                }}
              >
                RUN
              </Button>
            </Row>
          </RoundedBox>
        </Col>
      </Row>
    </Container>
  )
}

export default OptionSetting
