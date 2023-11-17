import { Icon } from '@chakra-ui/react'
import Title from 'antd/es/typography/Title'
import React, { useEffect } from 'react'
import { styled } from 'styled-components'
import DynamicRenderChart from './components/Chart/DynamicRenderChart'
import InfoCircle from './components/Icon/InfoCircle'

const PredictionResult = ({ data }: any) => {
  // useEffect(() => {
  //   console.log('data:', data)
  // }, [data])

  return (
    <RoundedBox>
      <Title level={4} style={{ color: '#002D65', display: 'inline-block' }}>
        Prediction Result
        <InfoCircle content="모델의 예측 결과" />
      </Title>
      <DynamicRenderChart type="prediction" data={data} />
    </RoundedBox>
  )
}

export default PredictionResult

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
