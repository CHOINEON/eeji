import React, { useEffect, useState } from 'react'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import DataFileModal from './components/DataInfo/DataFileModal'
import './style/styles.css'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { importModalAtom, listModalAtom } from './store/modal/atom'

const DataSet = () => {
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)
  const [fileListOpen, setFileListOpen] = useRecoilState(listModalAtom)
  const [dataSet, setDataSet] = useState([])
  const reqParams = { url: '/api/tag/uploadfile', param: 'undefined' }

  useEffect(() => {
    fetchDataSetList()
  }, [])

  const handleClick = () => {
    console.log('clicked')
    setImportOpen(true)
  }

  const handleSave = () => {
    fetchDataSetList()
  }

  const fetchDataSetList = () => {
    const com_id = localStorage.getItem('companyId')
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/dataset?com_id=' + com_id)
      .then((response) => {
        // console.log('api/dataset::', response.data)
        setDataSet(response.data)
      })
      .catch((err) => console.log(err))
  }

  const handleSelect = () => {
    setFileListOpen(true)
  }

  const handleDelete = (param: boolean) => {
    if (param) fetchDataSetList()
  }

  return (
    <>
      <div style={{ width: '100%', display: 'block', float: 'right', margin: '20px 0' }}>
        <Button type="primary" onClick={handleClick} style={{ width: '100%', height: '40px', margin: '20px 0' }}>
          + NEW DATASET
        </Button>
        <Row gutter={[16, 16]}>
          {dataSet.map((item, index) => (
            <Col span={12} key={index}>
              <DescriptionBox data={item} onSelect={handleSelect} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      </div>
      {/* <DataFileModal modalOpen={listOpen} onClose={handleListClose} /> */}
      <DataFileModal />
      <DataImportModal
        type="TRAIN"
        // modalOpen={importOpen}
        // onClose={handleImportClose}
        onSaveData={handleSave}
        reqParams={reqParams}
      />
    </>
  )
}

export default DataSet
