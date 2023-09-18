import { DotChartOutlined, UploadOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Divider, Upload, UploadFile, UploadProps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LineChart from 'views/DataAnalysis/components/Chart/LineChart'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { modelListAtom } from './store/atom'

const FlexContainer = styled.div`
  display: flex;
  alignitems: center;
  flexdirection: column;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`

interface ModelType {
  com_id: string
  create_date: string
  creator: string
  description: string
  error: string
  file_nm: string
  model_id: string
  model_name: string
  model_type: string
  x_value: string
  y_value: string
}

const ModelTest = (props: any) => {
  //https://velog.io/@euji42/Typescript-useParams-%ED%83%80%EC%9E%85-oi26j7va
  const { modelName } = useParams() as { modelName: string }
  const modelList = useRecoilValue(modelListAtom)
  const [model, setModel] = useState<ModelType>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [imgsrc, setImgsrc] = useState(undefined)

  useEffect(() => {
    if (modelList.length > 0) {
      const currentModel = modelList.filter((x) => x.model_name === modelName)[0]
      setModel(currentModel)
    }
  }, [])

  useEffect(() => {
    if (fileList.length === 0) {
      setChartData([])
    }
  }, [fileList])

  useEffect(() => {
    getOldPredictionChart()
  }, [model])

  const getOldPredictionChart = () => {
    if (model) {
      const param = {
        user_id: localStorage.getItem('userId'),
        model_nm: modelName,
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
                console.log('previewImage:', previewImage)
                setImgsrc(previewImage)
              }
              reader.readAsDataURL(myFile)
            }
          }
        })
        .catch((error) => console.log('error:', error))
    }
  }

  const getChartdata = (rawFile: any) => {
    const formData = new FormData()

    // for (const i in selectedRow) {
    // formData.append('com_id', localStorage.getItem('companyId'))
    formData.append('user_id', localStorage.getItem('userId'))
    formData.append('model_nm', model.model_name)
    formData.append('files', rawFile) //single file
    // }

    // key/value 쌍이 담긴 리스트
    // for (const [name, value] of formData) {
    //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
    // }

    // const param = { com_id: com_id, model_id: selectedRow.model_id, file: file }
    const fetch = axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/model_reuse', formData, {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      })
      .then(
        (response: any) => {
          if (response.status === 200) {
            console.log('/api/model_reuse response: ', response.data)
            setChartData(response.data)
            setLoading(false)
            return 'done'
          }
        },
        (error) => {
          console.log('error:', error)
          setLoading(false)
          return 'error'
        }
      )

    return fetch
  }

  const handleChange: UploadProps['onChange'] = (info: any) => {
    // console.log('handle change info:', info)
    let newFileList = [...info.fileList]

    // 1. Limit the number of uploaded files
    // Only to show one recent uploaded file, and old ones will be replaced by the new
    newFileList = newFileList.slice(-1)
    setFileList(newFileList)
  }

  // const handleRemove = (file: any) => {
  //   const index = fileList.indexOf(file)
  //   const newfileList = fileList.slice()
  //   newfileList.splice(index, 1)
  //   setFileList(newfileList)
  // }

  // const handleBeforeUpload = (file: any) => {
  //   setFileList([...fileList, file])
  //   return false
  // }

  const handleCustomRequest = (param: any) => {
    // console.log('param:', param)

    getChartdata(param.file).then((resp) => {
      if (resp === 'done') {
        param.onSuccess()
      } else if (resp === 'error') {
        param.onError()
      }
    })
  }

  return (
    <FlexContainer>
      <p className="w-100" style={{ textAlign: 'center', color: '#002D65', fontSize: '20px', fontWeight: 'bold' }}>
        Summary of Prediction
      </p>
      <div className="w-100" style={{ textAlign: 'center', marginBottom: '10px' }}>
        {' '}
        <p>{model ? model.file_nm : 'not selected'}</p>
        {/* <p> created : {model ? model.create_date : 'yyyy - mm - dd'}</p> */}
      </div>

      {imgsrc ? (
        <img src={imgsrc} style={{ margin: 'auto' }} />
      ) : (
        <DotChartOutlined style={{ fontSize: 120, color: '#bfbfbf' }} />
      )}
      <Divider />

      <div className="w-100 " style={{ textAlign: 'center', width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', width: '20%', margin: 'auto', padding: '10px' }}>
          <Upload
            method="POST"
            action={process.env.REACT_APP_API_SERVER_URL + '/api/model_reuse'}
            style={{ display: 'inline-flex' }}
            maxCount={1}
            fileList={fileList}
            onChange={handleChange}
            customRequest={handleCustomRequest}
            // onRemove={handleRemove}
            // beforeUpload={handleBeforeUpload}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>

        <div style={{ textAlign: 'center', width: '100%', maxWidth: '2040px', margin: 'auto' }}>
          <LineChart chartData={chartData} />
        </div>
      </div>
    </FlexContainer>
  )
}

export default ModelTest
