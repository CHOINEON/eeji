import { Table, Typography, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { dateTimeToString } from 'common/DateFunction'
import { useRecoilValue } from 'recoil'
import { uploadDataAtom, uploadFileInfoAtom } from 'views/DataAnalysis/store/base/atom'
import styled from '@emotion/styled'

interface DataType {
  name: string
  rowCount: number
  colCount: number
  startDate: string
  endDate: string
}

const DataSummaryContainer = styled.div`
  margin-top: 30px;
`

const SummaryDataGrid = (props: any) => {
  const [data, setData] = useState([])
  const columns: ColumnsType<DataType> = [
    { key: 'name', dataIndex: 'name', title: 'File Name', width: 200, align: 'center' },
    { key: 'rowCount', dataIndex: 'rowCount', title: 'Row', width: 100, align: 'center' },
    { key: 'colCount', dataIndex: 'colCount', title: 'Column', width: 80, align: 'center' },
    { key: 'startDate', dataIndex: 'startDate', title: 'Start Date', width: 200, align: 'center' },
    { key: 'endDate', dataIndex: 'endDate', title: 'End Date', width: 200, align: 'center' },
    // {
    //   title: 'Missing Value',
    //   dataIndex: '',
    //   key: 'x',
    //   render: () => <a>Show</a>,
    // },
  ]

  useEffect(() => {
    setData(props.data)
  }, [props])

  return (
    <>
      <div className="ag-theme-alpine">
        <Table
          columns={columns}
          dataSource={data}
          // expandable={{
          //   expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
          //   rowExpandable: (record) => record.name !== 'Not Expandable',
          // }}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </>
  )
}

const DataSummary = () => {
  const { Title } = Typography

  const uploadData = useRecoilValue(uploadDataAtom)
  const uploadFileInfo = useRecoilValue(uploadFileInfoAtom)
  // const [visible, setVisible] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()
  const [summaryData, setSummaryData] = useState([])

  useEffect(() => {
    if (uploadData.length > 0) {
      // setVisible(true)
      searchStartEndDate(uploadData)
    } else {
      setSummaryData([])
    }
  }, [uploadData])

  const searchStartEndDate = (array: Array<any>) => {
    console.log('searchStartEndDate:', Object.keys(array[0]))

    //min & max datetime 찾기
    const dateColumnName = Object.keys(array[0])[0]
    const newArr = array.map((obj) => {
      return { ...obj, dateTime: new Date(obj[dateColumnName]) } //0번째 컬럼 : 날짜
    })

    // console.log('newArr:', newArr)

    //Sort in Ascending order(low to high)
    //https://bobbyhadz.com/blog/javascript-sort-array-of-objects-by-date-property
    const sortedAsc = newArr.sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
    // console.log('sortedAsc:', sortedAsc)

    const summary = []
    const lengthOfArray = array.length

    const start = sortedAsc[0].dateTime
    const end = sortedAsc[lengthOfArray - 1].dateTime
    // console.log('start:', dateTimeToString(start).length)
    // console.log('end:', typeof dateTimeToString(end))

    summary.push({
      key: 1,
      name: uploadFileInfo.name,
      size: Math.round(uploadFileInfo.size / 1024),
      rowCount: sortedAsc.length,
      colCount: Object.keys(sortedAsc[0]).length,
      startDate: dateTimeToString(start).length === 19 ? dateTimeToString(start) : '-',
      endDate: dateTimeToString(end).length === 19 ? dateTimeToString(end) : '-',
    })

    // console.log('summary:', summary)
    setSummaryData(summary)
  }

  return (
    <DataSummaryContainer>
      {/* <p style={{ color: '#002D65', fontSize: '18px', float: 'left', width: '100%' }}>Data Summary</p> */}
      <Title level={4} style={{ color: '#002D65' }}>
        Data Summary
      </Title>
      {summaryData && <SummaryDataGrid data={summaryData} size="small" />}
      {contextHolder}
    </DataSummaryContainer>
  )
}

export default DataSummary
