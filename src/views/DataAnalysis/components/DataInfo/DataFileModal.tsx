import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import FileUploader from 'components/uploader/FileUploader'
// import DatasetSelect from './DataFileSelect'
import { List, Select, Space, Typography } from 'antd'
// import { Typography } from '@mui/material'
import axios from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { dataFileStore, dataSetStore, stepCountStore, variableStore } from 'views/DataAnalysis/store/atom'
const { Option } = Select

const DataFileModal = (props: any) => {
  const { modalOpen, onClose, onSaveData, dsId } = props

  const setActiveStep = useSetRecoilState(stepCountStore)
  const [selectedDataSet, setSelectedDataSet] = useRecoilState(dataSetStore)
  const [selectedDataFile, setSelectedDataFile] = useRecoilState(dataFileStore)
  const [variableList, setVariableList] = useRecoilState(variableStore)

  const [open, setOpen] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    fetchIncludedFileList()
  }, [selectedDataSet])

  useEffect(() => {
    setOpen(modalOpen)
  }, [props])

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
        // console.log('fetchTagList:', response)
        setFileList(response.data)
      })
      .catch((error) => console.log('Fetch tag list failed(Descption box):', error))
  }

  const renderItem = () => {
    return (
      fileList.length > 0 &&
      fileList.map((item, idx) => (
        <List.Item key={idx}>
          <List.Item.Meta
            key={idx}
            title={<a onClick={() => handleClick(item.name)}>{item.name}</a>}
            description={`${item.size} Byte | start date : ${item.start_date} | end date: ${item.end_date}`}
          />
        </List.Item>
      ))
    )
  }

  const handleClick = (fileName: string) => {
    // console.log('clicked:', fileName)
    setSelectedDataFile(fileName)
    fetchTaglistData(fileName)
    setActiveStep(1)
  }

  const fetchTaglistData = (fileName: string) => {
    // console.log('selectedDataset:', selectedDataset)
    // console.log('selectedFile:', selectedFile)

    const param = [
      {
        id: selectedDataSet,
        file_name: fileName,
      },
    ]

    // console.log('param：', param)

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag', param)
      .then((response) => {
        // console.log('/api/tag:', response.data)
        setVariableList(response.data)

        const values = response.data[0].options
        const valueArr: Array<any> = values.map((item: any) => item.value)

        const result: Array<any> = []
        valueArr.forEach((value: any) => {
          result.push({ value: value, used: false })
        })
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
