import React from 'react'
import {
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
  width?: number
  height?: number
  position?: string
}

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width + 'px' : 'auto')};
  height: ${(props) => (props.height ? props.height + 'px' : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
const LabelBox = styled.div`
  //   text-align: center;
  font-size: 15px;
  color: #002d65;
  font-weight: bold;
`

const { RangePicker } = DatePicker
const HyperparameterSetting = () => {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Ranges',
      children: (
        <>
          <LabelBox>시작/종료일</LabelBox>
          <RangePicker />
        </>
      ),
    },
    {
      key: '2',
      label: 'Data Preprocessing',
      children: (
        <>
          <LabelBox>결측치</LabelBox>
          <Select
            defaultValue="test1"
            style={{ width: 120 }}
            //   onChange={handleChange}
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
              { value: 'test', label: '스플라인2차' },
              { value: 'test', label: '0으로 채우기' },
              { value: 'test', label: '다중대체' },
              { value: 'test', label: 'KNN' },
            ]}
          />
          <LabelBox>이상치</LabelBox>
          <Select
            defaultValue="test1"
            style={{ width: 120 }}
            //   onChange={handleChange}
            options={[
              { value: 'test1', label: '표준편차' },
              { value: 'test2', label: '백분위' },
              { value: 'test3', label: 'IForest' },
              { value: 'test4', label: 'Ransac' },
            ]}
          />
          {/* <Divider orientation="center"></Divider> */}
        </>
      ),
    },
    {
      key: '3',
      label: 'Normalization',
      children: (
        <>
          {' '}
          <LabelBox>데이터 정규화</LabelBox>
          <Select
            defaultValue="test1"
            style={{ width: 120 }}
            //   onChange={handleChange}
            options={[
              { value: 'test1', label: '최대-최소' },
              { value: 'test2', label: '평균-분산' },
              { value: 'test3', label: '로버스트' },
            ]}
          />
        </>
      ),
    },
    {
      key: '4',
      label: 'Hyperparameter',
      children: (
        <>
          {' '}
          <LabelBox>epoch</LabelBox>
          <Input defaultValue="1000" />
          <LabelBox>베이지안 탐색 횟수</LabelBox>
          <InputNumber
            min={1}
            max={20}
            style={{ margin: '0 16px' }}
            defaultValue={10}
            //   value={inputValue}
            //   onChange={onChange}
          />
        </>
      ),
    },
  ]

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`)
  }

  return (
    <Row gutter={[24, 16]}>
      <Col span={18}>
        <RoundedBox width={700} height={850}>
          <Skeleton.Image
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </RoundedBox>
      </Col>
      <Col span={6}>
        <RoundedBox height={850}>
          <Switch
            style={{ marginBottom: '10px' }}
            defaultChecked
            checkedChildren="Auto"
            unCheckedChildren="Manual"
            onChange={onChange}
          />
          <Collapse items={items} defaultActiveKey={['1']} />
        </RoundedBox>
      </Col>
    </Row>
  )
}

export default HyperparameterSetting
