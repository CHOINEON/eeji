import styled from '@emotion/styled'
import { Badge, Pagination, PaginationProps, Space } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { xaiPaginationStore } from '../store/analyze/atom'
import HorizontalStackedBarChart from './HorizontalStackedBarChart'

const RowItem = ({ number, value, weight, pred }: any) => {
  //24.03.05 Backend 요청으로 input data가 모두 0인 row를 걸러냄
  return (
    <>
      {!Object.values(weight).every((val: any) => val == 0) && (
        <DataRow style={{ padding: '0 2%', marginBottom: '1%' }}>
          <div style={{ width: '10%', textAlign: 'center' }}>{number}</div>
          <div style={{ width: '20%', textAlign: 'center' }}>
            <b>{pred?.toString()}</b>
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
  const { t } = useTranslation()

  const { localWeight, localValue, predResult } = props
  const [xaiPagination, setXaiPagination] = useRecoilState(xaiPaginationStore)

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

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    if (xaiPagination.limit !== pageSize)
      setXaiPagination({ ...xaiPagination, offset: pageSize * (current - 1) + 1, limit: pageSize })
  }

  const onChange = (e: any) => {
    // pageSize 변경할 때도 호출되어 분기처리
    if (e !== xaiPagination.page)
      setXaiPagination({ ...xaiPagination, page: e, offset: xaiPagination.limit * (e - 1) + 1 })
  }

  return (
    <>
      <div style={{ display: 'block', width: '100%', padding: '0 2%', marginTop: 15 }}>
        <ColumnHeader width={'10%'}>{t('No')}</ColumnHeader>
        <ColumnHeader width={'20%'}>{t('Prediction Result')}</ColumnHeader>
        <ColumnHeader width={'70%'}>{t('Input Variables')}</ColumnHeader>
      </div>
      {localValue?.map((value: any, i: number) => {
        const index = xaiPagination.offset === 1 ? i + 1 : xaiPagination.offset + i
        return <RowItem key={i} number={index} value={value} weight={localWeight[i]} pred={predResult[index]} />
      })}
      <Pagination
        className="text-center"
        defaultCurrent={1}
        total={xaiPagination.total}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
        showTotal={(total) => `Total ${total} items`}
      />
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

const LegendContainer = styled.div`
  // margin-bottom: 20px;
  text-align: right;
`
