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
  // const { number, columns, predResult, value, weight } = props
  console.log('props', props)
  // const itemObj = item.item

  ////////24.03.05 Backend 요청으로 input data가 모두 0인 row를 걸러냄
  return (
    <></>
    // !Object.values(weight).every((val: any) => val == 0) && (
    //   <DataRow style={{ padding: '0 2%', marginBottom: '1%' }}>
    //     <div style={{ width: '10%', textAlign: 'center' }}>{number}</div>
    //     <div style={{ width: '20%', textAlign: 'center' }}>
    //       pred : <b>{predResult[number] || ''}</b>
    //     </div>
    //     <div style={{ width: '70%', height: '50px !important' }}>
    //       <HorizontalStackedBarChart {...props} />
    //     </div>
    //   </DataRow>
    // )
  )
}

const AnalysisGrid = ({ data }: any) => {
  const { input_data, xai_local, predict_result, feature_list } = data

  return (
    <>
      <div style={{ display: 'block', width: '100%', padding: '0 2%' }}>
        <ColumnHeader width={'10%'}>No</ColumnHeader>
        <ColumnHeader width={'20%'}>예측결과</ColumnHeader>
        <ColumnHeader width={'70%'}>입력변수</ColumnHeader>
      </div>
      {xai_local.map((value: any, i: number) => {
        return <RowItem key={i} number={i} value={xai_local} />
      })}
    </>
  )
}

export default AnalysisGrid

export const DataRow = styled.div`
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

export const ColumnHeader = styled.div<{ width: string }>`
  display: inline-block;
  text-align: center;
  width: ${(props: any) => (props.width ? props.width : '100%')};
  color: #002d65;
  font-family: 'Helvetica Neue';
`

const Idx = styled.div`
  text-align: center;
`

const Name = styled.div`
  text-align: center;
`
