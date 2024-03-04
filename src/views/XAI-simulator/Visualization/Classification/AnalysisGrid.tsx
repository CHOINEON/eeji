import styled from '@emotion/styled'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { customModelStore } from 'views/XAI-simulator/store/analyze/atom'
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

const RowItem = (props: any) => {
  // console.log('props', props)
  // const itemObj = item.item

  return (
    <Row>
      {/* {columns.map((col: any, i: number) => {
        return <div style={{ width: '100px', border: '1px solid red' }}>{columns[i]}</div>
      })} */}
      <div style={{ width: '10%' }}>{props.number}</div>
      <div style={{ width: '10%' }}>{props.pred}</div>
      <div style={{ height: '50px !important' }}>
        <HorizontalStackedBarChart {...props} />
      </div>
      {/* <div style={{ width: '10%' }}>{itemObj?.name}</div>
      <div style={{ width: '10%' }}>{itemObj?.age}</div>
      <div style={{ width: '10%' }}>{itemObj?.status}</div>
      <div style={{ height: '50px !important' }}>
        <HorizontalStackedBarChart data={itemObj.result} />
      </div> */}
    </Row>
  )
}

const AnalysisGrid = ({ localWeight, localValue, columns }: any) => {
  // console.log('predResult:', predResult)
  // console.log('columns:', columns)

  // const analysisResult = useRecoilValue(customModelStore)

  //pred={predResult[i]}
  return (
    <div style={{ height: '100%' }}>
      {localWeight.map((value: any, i: number) => {
        return <RowItem key={i} number={i} value={localValue} weight={value} columns={columns} />
      })}
    </div>
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
