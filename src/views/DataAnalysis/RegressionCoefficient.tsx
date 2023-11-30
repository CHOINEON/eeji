import styled from '@emotion/styled'
import { Carousel } from 'antd'
import React, { useEffect } from 'react'
import LineChart from './components/Chart/LineChart'
import InfoCircle from './components/Icon/InfoCircle'

const RegressionCoefficient = ({ data }: any) => {
  // useEffect(() => console.log('RegressionCoefficient:', data), [data])

  // const onChange = (currentSlide: number) => {
  //   console.log(currentSlide)
  // }

  return (
    <ComponentContainer>
      {/* <Pagination defaultCurrent={1} total={50} /> */}
      <Carousel autoplay style={{ marginTop: '50px' }}>
        {data &&
          Object.entries(data).map((d: any, index: number) => {
            const title = d[0]
            const data = d[1]
            return <LineChart key={index} chartData={data} />
          })}
      </Carousel>
    </ComponentContainer>
  )
}

export default RegressionCoefficient

const ComponentContainer = styled.div`
  float: right;
  margin-left: 10px;
  width: 500px;
  height: 650px;
  background-color: #f6f8ff;
  border: 1px solid var(--unnamed-color-a3afcf);
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
`

const Title = styled.div`
  display: block;
  float: left;
  color: #002d65;
  font-weight: bold;
  margin: 27px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

const SubTitle = styled(Title)`
  font-size: 23px;
`

const ContentsTitle = styled(Title)`
  font-size: 21px;
`
