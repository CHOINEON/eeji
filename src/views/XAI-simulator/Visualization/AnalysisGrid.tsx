import styled from '@emotion/styled'
import { Badge, Space } from 'antd'
import React from 'react'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import HorizontalStackedBarChart from './HorizontalStackedBarChart'

const RowItem = ({ number, value, weight, pred }: any) => {
  // const { number, columns, predResult, value, weight } = props
  // console.log('RowItem weight', weight)
  // const itemObj = item.item

  ////////24.03.05 Backend 요청으로 input data가 모두 0인 row를 걸러냄
  return (
    <>
      {!Object.values(weight).every((val: any) => val == 0) && (
        <DataRow style={{ padding: '0 2%', marginBottom: '1%' }}>
          <div style={{ width: '10%', textAlign: 'center' }}>{number}</div>
          <div style={{ width: '20%', textAlign: 'center' }}>
            <b>{pred}</b>
          </div>
          <div style={{ width: '70%', height: '50px !important' }}>
            <HorizontalStackedBarChart weight={weight} value={value} />
          </div>
        </DataRow>
      )}
    </>
  )
}

const AnalysisGrid = (props: any) => {
  const { localWeight, localValue, predResult, featureList } = props

  const hoverContent = (feature_list: any) => {
    return (
      <LegendContainer>
        <Space direction="horizontal">
          {feature_list?.map((value: number, index: any) => (
            <Badge color={colorChips[index]} text={value} />
          ))}
        </Space>
      </LegendContainer>
    )
  }

  return (
    <>
      <div style={{ display: 'block', width: '100%', padding: '0 2%', marginTop: 15 }}>
        <ColumnHeader width={'10%'}>No</ColumnHeader>
        <ColumnHeader width={'20%'}>예측결과</ColumnHeader>
        <ColumnHeader width={'70%'}>입력변수</ColumnHeader>
      </div>
      {localValue?.map((value: any, i: number) => {
        return <RowItem key={i} number={i} value={value} weight={localWeight[i]} pred={predResult[i]} />
      })}
    </>
  )
}

export default React.memo(AnalysisGrid)

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
  font-family: 'Helvetica Neue';
  display: inline-block;
  text-align: center;
  width: ${(props: any) => (props.width ? props.width : '100%')};
  color: #002d65;
`

const Idx = styled.div`
  text-align: center;
`

const Name = styled.div`
  text-align: center;
`

const LegendContainer = styled.div`
  // margin-bottom: 20px;
  text-align: right;
`
