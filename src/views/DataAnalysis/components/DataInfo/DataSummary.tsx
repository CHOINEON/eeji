import { Spin, Table, Typography, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataPropertyState, summaryFetchState, uploadedDataState } from 'views/DataAnalysis/store/base/atom'
import styled from '@emotion/styled'

interface DataType {
  name: string
  rowCount: number
  colCount: number
  startDate: string
  endDate: string
}

const DataSummaryContainer = styled.div<{ visible: boolean }>`
  margin-top: 30px;
  display: ${(props: any) => (props.visible ? 'block' : 'none')};
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

  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  // const [summaryFetch, setSummaryFetch] = useRecoilState(summaryFetchState)
  const inputOption = useRecoilValue(dataPropertyState)

  const [spinning, setSpinning] = useState(false)
  const [visible, setVisible] = useState(false)
  const [summaryData, setSummaryData] = useState([])

  const [messageApi, contextHolder] = message.useMessage()

  // useEffect(() => {
  //   if (summaryFetch === 'requested' || summaryFetch === 'completed') {
  //     setVisible(true)
  //     setSpinning(true)
  //   } else {
  //     setVisible(false)
  //   }
  // }, [summaryFetch])

  useEffect(() => {
    // console.log('uploadedData:', uploadedData)

    const summary = []

    summary.push({
      key: 1,
      name: uploadedData.name,
      size: Math.round(uploadedData.file ? uploadedData.file.size / 1024 : 0),
      rowCount: uploadedData.rowCount,
      colCount: uploadedData.colCount,
      startDate: uploadedData.startDate,
      endDate: uploadedData.endDate,
    })

    // console.log('summary:', summary)
    setSummaryData(summary)
    setSpinning(false)
  }, [uploadedData])

  const searchStartEndDate = (array: Array<any>) => {
    //min & max datetime 찾기
    // const dateColumnName = Object.keys(array[0])[0]
    const dateColumnName = inputOption.date_col

    const newArr = array.map((obj) => {
      return { ...obj, dateTime: new Date(obj[dateColumnName]) } //날짜컬럼(사용자가 선택한 값)
    })

    if (!newArr[0].dateTime.getTime()) {
      alert('날짜 컬럼이 아닙니다.')
    }
    // console.log('newArr[0].dateTime:', newArr[0].dateTime)
    // console.log('test:', isValidDate(newArr[0].dateTime))

    //Sort in Ascending order(low to high)
    //https://bobbyhadz.com/blog/javascript-sort-array-of-objects-by-date-property
    // const sortedAsc = newArr.sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
    // console.log('sortedAsc:', sortedAsc)

    // console.log('-----test:', Object.prototype.toString.call(sortedAsc[0].dateTime))

    // const summary = []
    // const lengthOfArray = array.length

    // const start = sortedAsc[0].dateTime
    // const end = sortedAsc[lengthOfArray - 1].dateTime
    // console.log('start:', dateTimeToString(start).length)
    // console.log('end:', typeof end)

    // summary.push({
    //   key: 1,
    //   name: uploadFileInfo.name,
    //   size: Math.round(uploadFileInfo.size / 1024),
    //   rowCount: sortedAsc.length,
    //   colCount: Object.keys(sortedAsc[0]).length,
    //   startDate: dateTimeToString(start).length === 19 ? dateTimeToString(start) : '-',
    //   endDate: dateTimeToString(end).length === 19 ? dateTimeToString(end) : '-',
    // })

    // console.log('summary:', summary)
    // setSummaryData(summary)
  }

  return (
    <DataSummaryContainer visible={visible}>
      {/* <p style={{ color: '#002D65', fontSize: '18px', float: 'left', width: '100%' }}>Data Summary</p> */}
      <Title level={4} style={{ color: '#002D65' }}>
        Data Summary
      </Title>
      <Spin spinning={spinning}> {summaryData && <SummaryDataGrid data={summaryData} size="small" />}</Spin>
      {contextHolder}
    </DataSummaryContainer>
  )
}

export default DataSummary
