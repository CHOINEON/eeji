import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import './style/styles.css'
import axios from 'axios'
import DataFileModal from './components/DataInfo/DataFileModal'

// const tempData: Array<DescriptionBoxProps> = [
//   { name: 'Dataset-1', size: 40, create: '2 weeks ago', update: '1 week ago' },
//   { name: 'Dataset-2', size: 23, create: '1 month ago', update: '2 week ago' },
// ]

const DataSet = () => {
  const [importOpen, setImportOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [dataSet, setDataSet] = useState([])
  const reqParams = { url: '/api/tag/uploadfile', param: 'undefined' }

  useEffect(() => fetchDataSetList(), [])

  const handleClick = () => {
    setDataSet
    setImportOpen(true)
  }

  const handleImportClose = () => {
    setImportOpen(false)
  }

  const handleListClose = () => {
    setListOpen(false)
  }

  const handleSave = (param: any) => {
    fetchDataSetList()
  }

  const fetchDataSetList = () => {
    const com_id = localStorage.getItem('companyId')
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/dataset?com_id=' + com_id)
      .then((response) => {
        setDataSet(response.data)
      })
      .catch((err) => console.log(err))
  }

  const handleSelect = (param: any) => {
    setListOpen(true)
  }

  const handleDelete = (param: boolean) => {
    if (param) fetchDataSetList()
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
              <DescriptionBox data={item} onSelect={handleSelect} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      </div>
      <DataFileModal modalOpen={listOpen} onClose={handleListClose} />
      <DataImportModal
        type="TRAIN"
        modalOpen={importOpen}
        onClose={handleImportClose}
        onSaveData={handleSave}
        reqParams={reqParams}
      />
    </>
  )
}

export default DataSet
