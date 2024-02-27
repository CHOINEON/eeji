import { Divider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { runModalAtom } from './store/atom'
import { DotChartOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import LineChart from 'views/AIModelGenerator/components/Chart/LineChart'
import axios from 'axios'
import styled from '@emotion/styled'

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`

const ModelRunModal = (props: any) => {
  const selectedData = props.selectedData

  const [importOpen, setImportOpen] = useRecoilState(runModalAtom)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [imgsrc, setImgsrc] = useState(undefined)

  useEffect(() => {
    if (selectedData) {
      getOldPredictionChart(selectedData.model_id)
    }
    setFileList([])
  }, [selectedData])

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setImportOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    setImportOpen(false)
  }

  const getOldPredictionChart = (model_id: string) => {
    const param = {
      user_id: localStorage.getItem('userId'),
      model_id: model_id,
    }
    // console.log('param:', param)

    axios
      .post<Blob>(process.env.REACT_APP_API_SERVER_URL + '/api/load_model_graph', param, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        // console.log('/api/load_mpodel_graph resp:', res)

        if (res.status === 200) {
          const myFile = new File([res.data], 'imageName')

          if (myFile.size > 0) {
            const reader = new FileReader()
            reader.onload = (ev) => {
              const previewImage = String(ev.target?.result)
              // console.log('previewImage:', previewImage)
              setImgsrc(previewImage)
            }
            reader.readAsDataURL(myFile)
          }
        }
      })
      .catch((error) => console.log('error:', error))
  }

  const getChartdata = (rawFile: any) => {
    // console.log('file：', rawFile)
    // console.log('selectedData:', selectedData)

    const formData = new FormData()

    // for (const i in selectedRow) {
    formData.append('com_id', localStorage.getItem('companyId'))
    formData.append('user_id', localStorage.getItem('userId'))
    formData.append('model_id', selectedData.model_id)
    formData.append('file', rawFile) //single file
    // }

    // // key/value 쌍이 담긴 리스트
    // // for (const [name, value] of formData) {
    // //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
    // // }

    // // const param = { com_id: com_id, model_id: selectedRow.model_id, file: file }
    // axios
    //   .post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model/chart', formData, {
    //     headers: {
    //       'Content-Type': `multipart/form-data;`,
    //     },
    //   })
    //   .then(
    //     (response: any) => {
    //       if (response.status === 200) {
    //         console.log('/api/predict/model/chart response: ', response.data)
    //         setChartData(response.data)
    //         setLoading(false)
    //       }
    //     },
    //     (error) => {
    //       console.log('error:', error)
    //       setLoading(false)
    //     }
    //   )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // console.log('fileList::', fileList)
    setFileList(newFileList)
    if (fileList.length > 0) {
      getChartdata(fileList[0].originFileObj)
    }
  }

  return (
    <Modal
      width={1000}
      title="Run Model"
      open={importOpen}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <FlexContainer>
        <p className="w-100" style={{ textAlign: 'center', color: '#002D65', fontSize: '20px', fontWeight: 'bold' }}>
          Summary of Prediction
        </p>
        <p className="w-100" style={{ textAlign: 'center' }}>
          {' '}
          yyyymmdd ~ yyyymmdd
        </p>

        {imgsrc ? (
          <img src={imgsrc} style={{ margin: 'auto' }} />
        ) : (
          <DotChartOutlined style={{ fontSize: 120, color: '#bfbfbf' }} />
        )}
        <Divider />

        <div className="w-100">
          <Upload
            style={{ display: 'inline-flex', border: '1px solid red' }}
            maxCount={1}
            fileList={fileList}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          <LineChart />
        </div>
      </FlexContainer>
    </Modal>
  )
}

export default ModelRunModal
