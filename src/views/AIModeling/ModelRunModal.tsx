import { Divider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { runModalAtom } from './store/atom'
import { DotChartOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import LineChart from 'views/DataAnalysis/components/Chart/LineChart'
import axios from 'axios'

const ModelRunModal = (props: any) => {
  const [importOpen, setImportOpen] = useRecoilState(runModalAtom)
  const selectedData = props.selectedData
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [imgsrc, setImgsrc] = useState(undefined)

  useEffect(() => {
    getOldPredictionChart(selectedData.model_id)
  }, [selectedData])

  const UploadProps: UploadProps = {
    name: 'file',
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info) {
      console.log('info:', info)
      getChartdata(info.file)

      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList)
      // }
      // if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`)
      // } else if (info.file.status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`)
      // }
    },
  }

  const showModal = () => {
    setImportOpen(true)
  }

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

    console.log('param:', param)
    axios
      .post<Blob>(process.env.REACT_APP_API_SERVER_URL + '/api/load_model_graph', param, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        console.log('/api/load_mpodel_graph resp:', res)

        const myFile = new File([res.data], 'imageName')
        const reader = new FileReader()
        reader.onload = (ev) => {
          const previewImage = String(ev.target?.result)
          console.log('111::', previewImage)
          setImgsrc(previewImage) // myImage라는 state에 저장했음
        }
        reader.readAsDataURL(myFile)
      })
      .catch((error) => console.log('error:', error))
  }

  const getChartdata = (rawFile: any) => {
    console.log('file：', rawFile)
    console.log('selectedData:', selectedData)
    // const modelArr = new Array(selectedRow.model_id.toString())
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

  return (
    <Modal
      width={1000}
      title="Run Model"
      open={importOpen}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#002D65', fontSize: '20px', fontWeight: 'bold', float: 'left', width: '100%' }}>
          Summary of Prediction
        </p>
        <p>yyyymmdd ~ yyyymmdd</p>

        {imgsrc ? (
          <img src={imgsrc} style={{ margin: 'auto', width: '40vw' }} />
        ) : (
          <DotChartOutlined style={{ fontSize: 120, color: '#bfbfbf' }} />
        )}
        <Divider />
        <div>
          <div style={{ display: 'block', width: '100%', margin: 'auto' }}>
            <LineChart />
          </div>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>
      </div>
    </Modal>
  )
}

export default ModelRunModal
