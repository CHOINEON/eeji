import { Spin, Table, Typography, message, Row, Col } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataPropertyState, uploadedDataState } from 'views/DataAnalysis/store/dataset/atom'
import styled from '@emotion/styled'

interface DataType {
  name: string
  rowCount: number
  colCount: number
  startDate: string
  endDate: string
}

const DataSummary = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const inputOption = useRecoilValue(dataPropertyState)
  const [visible, setVisible] = useState(false)

  const [spinning, setSpinning] = useState(false)
  const [summaryData, setSummaryData] = useState([])

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    // console.log('DataSummary uploadedData:', uploadedData)
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
    if (uploadedData.file !== undefined && uploadedData.rowCount > 0) {
      setVisible(true)
    } else {
      setVisible(false)
    }
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
      <Row>
        <Col span={12}>
          <Title style={{ width: '35%' }}>∙ Row</Title>
          <Text>{uploadedData.rowCount}</Text>
        </Col>
        <Col span={12}>
          <Title style={{ width: '25%' }}>∙ Start</Title>
          <Text>{uploadedData.startDate}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Title style={{ width: '35%' }}>∙ Column</Title>
          <Text>{uploadedData.colCount}</Text>
        </Col>
        <Col span={12}>
          <Title style={{ width: '25%' }}>∙ End</Title>
          <Text>{uploadedData.endDate}</Text>
        </Col>
      </Row>
    </DataSummaryContainer>
  )
}

export default DataSummary

const DataSummaryContainer = styled.div<{ visible: boolean }>`
  display: block;
  float: left;
  // margin-top: 20px;
  padding: 8px;
  background-color: #f6f8ff;
  border-radius: 10px;
  width: 100%;
  height: 60px;
  // display: ${(props: any) => (props.visible ? 'block' : 'none')};
`

const Title = styled.div`
  float: left;
  display: inline-block;
  color: #a3afcf;
`

const Text = styled.span`
  color: #002d65;
`
