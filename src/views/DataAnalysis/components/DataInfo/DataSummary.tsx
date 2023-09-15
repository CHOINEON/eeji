import { Table, Typography, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { dateTimeToString } from 'common/DateFunction'

interface DataType {
  name: string
  rowCount: number
  colCount: number
  startDate: string
  endDate: string
}

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

const DataSummary = (props: any) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [summaryData, setSummaryData] = useState([])
  const { Title } = Typography

  useEffect(() => {
    // console.log('DataSummary props:', props.file)

    if (props.file) {
      if (props.file.size <= 10485760) {
        readFile(props.file)
      } else {
        messageApi.open({
          type: 'error',
          content: '업로드 가능 파일용량 초과(최대 10MB)',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
        setSummaryData([])
      }
    } else {
      setSummaryData([])
    }
  }, [props])

  const readFile = (file: any) => {
    console.log('readfile:', file)
    console.log('type:', file.name.split('.', 2)[1])

    const fileReader = new FileReader()

    const fileFormat = file.name.split('.', 2)[1]
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file) {
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result
          csvFileToArray(file.name, file.size, text)
        }

        fileReader.readAsText(file)
      } else {
        messageApi.open({
          type: 'error',
          content: '지원하지 않는 파일 유형입니다.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  const csvFileToArray = (name: string, size: number, string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    const array = csvRows.map((item) => {
      if (item != '') {
        const values = item.split(',')
        const obj = csvHeader.reduce((object: any, header, index) => {
          object[header] = values[index]
          return object
        }, {})
        return obj
      }
    })

    console.log('array:', array)
    //split하면서 마지막 행에 빈 값 들어있어서 자름
    array.splice(array.length - 1)

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
      name: name,
      size: Math.round(size / 1024),
      rowCount: sortedAsc.length,
      colCount: Object.keys(sortedAsc[0]).length,
      startDate: dateTimeToString(start).length === 19 ? dateTimeToString(start) : '-',
      endDate: dateTimeToString(end).length === 19 ? dateTimeToString(end) : '-',
    })

    // console.log('summary:', summary)
    setSummaryData(summary)
  }

  return (
    <div style={{ marginTop: '30px' }}>
      {/* <p style={{ color: '#002D65', fontSize: '18px', float: 'left', width: '100%' }}>Data Summary</p> */}
      <Title level={4} style={{ color: '#002D65' }}>
        Data Summary
      </Title>
      {summaryData && <SummaryDataGrid data={summaryData} size="small" />}
      {contextHolder}
    </div>
  )
}

export default DataSummary
