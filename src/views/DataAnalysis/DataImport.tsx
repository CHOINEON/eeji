import React, { useState } from 'react'
import styled from '@emotion/styled'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import './style/styles.css'

const tempData: Array<DescriptionBoxProps> = [
  { name: 'Dataset-1', size: 40, create: '2 weeks ago', update: '1 week ago' },
  { name: 'Dataset-2', size: 23, create: '1 month ago', update: '2 week ago' },
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
    console.log(param)
    const newData = { name: param[0].name, size: param[0].size, create: 'just now', update: '-' }
    // console.log('newData:', newData)
    setDataSet([...dataSet, newData])
  }

  return (
    <>
      <div style={{ width: '100%', display: 'block', float: 'right', margin: '20px 0' }}>
        <Button type="primary" onClick={handleClick} style={{ width: '100%', margin: '20px 0' }}>
          + NEW DATASET
        </Button>
        <Row gutter={[16, 32]}>
          {dataSet.map((item, index) => (
            <Col span={12} key={index}>
              <DescriptionBox data={item} />
            </Col>
          ))}
        </Row>
      </div>

      {/* <DescriptionBox /> */}
      <DataImportModal modalOpen={open} onClose={handleClose} onSaveData={handleSave} />
    </>
  )
}

export default DataImport
