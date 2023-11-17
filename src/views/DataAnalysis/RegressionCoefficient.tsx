import styled from '@emotion/styled'
import { Carousel } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect } from 'react'
import LineChart from './components/Chart/LineChart'
import InfoCircle from './components/Icon/InfoCircle'

const RegressionCoefficient = ({ data }: any) => {
  // useEffect(() => console.log('RegressionCoefficient:', data), [data])

  // const onChange = (currentSlide: number) => {
  //   console.log(currentSlide)
  // }

  return (
    <RoundedBox minHeight={'100%'}>
      <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
        Regression Coefficient
        <InfoCircle content="각 변수가 예측 모델에 얼마나 기여하는지(예측 모델에 대한 회귀계수), 오차에 얼마나 기여하는지(오차에 대한 회귀계수)" />
      </Title>
      {/* <Pagination defaultCurrent={1} total={50} /> */}
      <Carousel autoplay style={{ marginTop: '50px' }}>
        {data &&
          Object.entries(data).map((d: any, index: number) => {
            const title = d[0]
            const data = d[1]
            return <LineChart key={index} chartData={data} />
          })}
      </Carousel>
    </RoundedBox>
  )
}

export default RegressionCoefficient

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
}

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
