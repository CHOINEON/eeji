import styled from '@emotion/styled'
import Title from 'antd/es/typography/Title'
import React from 'react'
import DynamicRenderChart from '../Chart/DynamicRenderChart'
import InfoCircle from '../Icon/InfoCircle'

const PreprocessingResult = ({ data, options }: any) => {
  return (
    <RoundedBox>
      <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
        Preprocessing Result
        <InfoCircle content="선택한 전처리 방식으로 전/후 결과를 보여줍니다." />
      </Title>
      <DynamicRenderChart type="preprocessingResult" data={data} options={options} />
    </RoundedBox>
  )
}

export default PreprocessingResult

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
