import React, { useEffect, useState } from 'react'
import DescriptionBox, { DescriptionBoxProps } from './components/DataInfo/DescriptionBox'
import { Button, Col, Row } from 'antd'
import DataImportModal from './components/DataInfo/DataImportModal'
import DataFileModal from './components/DataInfo/DataFileModal'
import './style/styles.css'
import axios from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { importModalAtom, listModalAtom } from './store/modal/atom'
import styled from '@emotion/styled'

const DatasetAddButton = styled.button`
  width: 100%;
  height: 50px;
  margin: 20px 0;
  border-radius: 10px;
  font-size: 17px;
  color: #fff;
  background-color: #4338f7;
  box-shadow: 0 2px 0 rgba(55, 5, 255, 0.06);
`

const DataSet = () => {
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)
  const setFileListOpen = useSetRecoilState(listModalAtom)
  const [dataSet, setDataSet] = useState([])

  useEffect(() => {
    fetchDataSetList()
  }, [importOpen])

  const handleClick = () => {
    setImportOpen(true)
  }

  const fetchDataSetList = () => {
    const com_id = localStorage.getItem('companyId')
    const user_id = localStorage.getItem('userId')

    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/dataset?com_id=' + com_id + '&user_id=' + user_id)
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
        <DatasetAddButton className="ant-btn ant-btn-primary" onClick={handleClick}>
          + NEW DATASET
        </DatasetAddButton>
        <Row gutter={[16, 16]}>
          {dataSet.map((item, index) => (
            <Col span={8} key={index}>
              <DescriptionBox data={item} onSelect={handleSelect} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      </div>
      <DataFileModal />
      <DataImportModal />
    </>
  )
}

export default DataSet
