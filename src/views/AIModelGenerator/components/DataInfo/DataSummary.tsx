import styled from '@emotion/styled'
import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataPropertyState, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

const DataSummary = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const inputOption = useRecoilValue(dataPropertyState)
  const [visible, setVisible] = useState(false)

  const [summaryData, setSummaryData] = useState([])

  useEffect(() => {
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

    setSummaryData(summary)
    if (uploadedData.file !== undefined && uploadedData.rowCount > 0) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [uploadedData])

  return (
    <DataSummaryContainer visible={visible}>
      <Row>
        <Col span={12}>
          <Title style={{ width: '35%' }}>∙ Row</Title>
          <Text>{uploadedData.rowCount > 0 ? uploadedData.rowCount : ''}</Text>
        </Col>
        <Col span={12}>
          <Title style={{ width: '25%' }}>∙ Start</Title>
          <Text>{uploadedData.startDate}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Title style={{ width: '35%' }}>∙ Column</Title>
          <Text>{uploadedData.colCount > 0 ? uploadedData.colCount : ''}</Text>
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
  padding: 8px;
  background-color: #f6f8ff;
  border-radius: 10px;
  width: 100%;
  height: 60px;
`

const Title = styled.div`
  float: left;
  display: inline-block;
  color: #a3afcf;
`

const Text = styled.span`
  color: #002d65;
`
