import { Carousel } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import LineChart from './components/Chart/LineChart'
import InfoCircle from './components/Icon/InfoCircle'

const FeatureImportance = ({ data }: any) => {
  const [page, setPage] = useState(1)
  //   useEffect(() => console.log('FeatureImportance:', data), [data])

  const onChange = (currentSlide: number) => {
    // console.log(currentSlide)
  }

  // useEffect(() => {
  //   console.log('FeatureImportance data:', data)
  // }, [data])

  return (
    <RoundedBox style={{ height: '635px' }}>
      <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
        Feature Importance
        <InfoCircle content="변수 중요도가 높을 수록 예측 모델에 대한 영향력이 큽니다." />
      </Title>
      {/* <Pagination defaultCurrent={1} total={50} /> */}
      <Carousel autoplay afterChange={onChange} style={{ marginTop: '40px', padding: '10px' }}>
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

export default FeatureImportance

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
