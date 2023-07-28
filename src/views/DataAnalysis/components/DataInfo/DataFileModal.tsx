import React, { useState, useEffect } from 'react'
import { Button, Modal, Spin } from 'antd'
import { List, Select, Space, Typography } from 'antd'
import axios from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  dataFileStore,
  dataSetStore,
  stepCountStore,
  usedVariableStore,
  variableStore,
} from 'views/DataAnalysis/store/atom'

const { Option } = Select

const DataFileModal = (props: any) => {
  const { modalOpen, onClose, onSaveData, dsId } = props

  const [selectedDataSet, setSelectedDataSet] = useRecoilState(dataSetStore)
  const setActiveStep = useSetRecoilState(stepCountStore)
  const setSelectedDataFile = useSetRecoilState(dataFileStore)
  const setVariableList = useSetRecoilState(variableStore)
  const setUsedVariable = useSetRecoilState(usedVariableStore)

  const [open, setOpen] = useState(false)
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchIncludedFileList()
  }, [selectedDataSet])

  useEffect(() => setOpen(modalOpen), [props])

  const handleOk = () => {
    setOpen(false)
    onClose()
    setFileList([])
  }

  const handleCancel = () => {
    setOpen(false)
    onClose()
    setFileList([])
  }

  const fetchIncludedFileList = () => {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/dataset/file?ds_id=' + selectedDataSet)
      .then((response) => {
        // console.log('/api/dataset/file:', response)
        setFileList(response.data)
      })
      .catch((error) => console.log('/api/dataset/file :', error))
  }

  const renderItem = () => {
    return (
      fileList.length > 0 && (
        <Spin key="spin" spinning={loading}>
          {fileList.map((item, idx) => (
            <List.Item key={idx}>
              <List.Item.Meta
                key={idx}
                title={<a onClick={() => handleClick(item.name)}>{item.name}</a>}
                description={`${Math.round(item.size) / 1024} MB `}
                //| start date : ${item.start_date} | end date: ${  item.end_date}
              />
            </List.Item>
          ))}
        </Spin>
      )
    )
  }

  const handleClick = (fileName: string) => {
    setLoading(true)
    setSelectedDataFile(fileName)
    fetchTaglistData(fileName)
  }

  const fetchTaglistData = (fileName: string) => {
    const param = [
      {
        id: selectedDataSet,
        file_name: fileName,
      },
    ]
    // console.log('/api/tag param::', param)

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag', param)
      .then((response) => {
        setLoading(false)

        setVariableList(response.data)
        setActiveStep(1)

        const values = response.data[0].options
        const valueArr: Array<any> = values.map((item: any) => item.value)

        const result: Array<any> = []
        valueArr.forEach((value: any) => {
          result.push({ value: value, used: false })
        })

        //feature 사용관리 하기 위한 최초 store
        setUsedVariable(result)
      })
      .catch((error) => alert('TagData Load Failed::'))
  }

  return (
    <div>
      <Modal open={open} title="Select file" onOk={handleOk} onCancel={handleCancel} footer={null}>
        <List bordered dataSource={fileList} renderItem={renderItem} />

        {/* <Select onChange={handleChange} style={{ width: 400 }}>
          {fileList.length > 0 &&
            fileList.map((item, idx) => (
              <Option value={item.name} key={idx} label={item.name}>
                <Space>
                  <span role="img" aria-label="China">
                    {item.name}
                  </span>
                  /{item.size}/{item.start_date}/{item.end_date}
                </Space>
              </Option>
            ))}
        </Select> */}
      </Modal>
    </div>
  )
}

export default DataFileModal
