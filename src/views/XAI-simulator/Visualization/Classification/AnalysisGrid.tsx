import styled from '@emotion/styled'
import React from 'react'
import HorizontalStackedBarChart from './HorizontalStackedBarChart'

const single_data = [
  {
    no: 1,
    name: 'Mira JO',
    age: 30,
    status: 'Normal',
    result: { age: 40, weight: 30, smoke: 30 },
  },
  {
    no: 2,
    name: 'Songhwan KIM',
    age: 30,
    status: 'Danger',
    result: { age: 10, weight: 30, smoke: 60 },
  },
]

const RowItem = (item: any) => {
  const itemObj = item.item

  return (
    <Row>
      <div style={{ width: '2%' }}>{itemObj.no}</div>
      <div style={{ width: '10%' }}>{itemObj.name}</div>
      <div style={{ width: '10%' }}>{itemObj.age}</div>
      <div style={{ width: '10%' }}>{itemObj.status}</div>
      <div style={{ height: '50px !important' }}>
        <HorizontalStackedBarChart data={itemObj.result} />
      </div>
    </Row>
  )
}

const AnalysisGrid = () => {
  return (
    <>
      {single_data.map((value: any) => {
        return <RowItem item={value} />
      })}
    </>
  )
}

export default AnalysisGrid

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-content: space-evenly;
  align-items: center;
  width: 100%;
  // height: 51px;
  background-color: #f6f8ff;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  margin: 10px 0;
`

const Idx = styled.div`
  text-align: center;
`

const Name = styled.div`
  text-align: center;
`
