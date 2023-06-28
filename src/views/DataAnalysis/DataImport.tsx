import React, { useState } from 'react'
import styled from '@emotion/styled'
import DescriptionBox, { DescriptionBoxProps } from './components/DataDesc/DescriptionBox'
import { Button, Col, Row } from 'antd'
import DataImportModal from './components/DataDesc/DataImportModal'
import './style/styles.css'

const tempData: Array<DescriptionBoxProps> = [
  { name: 'Dataset-1', totalSize: '40MB', create: '2 weeks ago', update: '1 week ago' },
  { name: 'Dataset-2', totalSize: '23MB', create: '1 month ago', update: '2 week ago' },
]

const DataImport = () => {
  const [open, setOpen] = useState(false)
  const [dataSet, setDataSet] = useState(tempData)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = (param: any) => {
    // console.log(' 데이터:', param)
    const newData = { name: param.data, totalSize: '? MB', create: 'just now', update: '-' }
    setDataSet([...dataSet, newData])
  }

  return (
    <>
      <div style={{ width: '100%', display: 'block', float: 'right', margin: '20px 0' }}>
        <Button type="primary" onClick={handleClick} style={{ width: '100%', margin: '20px 0' }}>
          + NEW DATASET
        </Button>
        <Row gutter={[16, 32]}>
          {dataSet.map((item) => (
            <Col span={12}>
              <DescriptionBox data={item} />
            </Col>
          ))}
          {/* <Col span={12}>
            {' '}
            <DescriptionBox data={dataSet[0]} />
          </Col>
          <Col span={12}>
            {' '}
            <DescriptionBox data={dataSet[1]} />
          </Col> */}
        </Row>
      </div>

      {/* <DescriptionBox /> */}
      <DataImportModal modalOpen={open} onClose={handleClose} onSaveData={handleSave} />
    </>
  )
}

export default DataImport
