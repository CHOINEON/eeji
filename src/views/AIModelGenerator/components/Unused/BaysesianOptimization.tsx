import { Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import { styled } from 'styled-components'
import InfoCircle from '../Icon/InfoCircle'

const BaysesianOptimization = ({ data, columns }: any) => {
  return (
    <RoundedBox style={{ height: '635px' }}>
      <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
        Bayesian Optimization
        <InfoCircle content="각 모델별로 학습된 결과(성능)을 나타냅니다" />
      </Title>
      <div style={{ marginTop: '30px' }}>
        <Table dataSource={data} columns={columns} size="small" />
      </div>
    </RoundedBox>
  )
}

export default BaysesianOptimization

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
