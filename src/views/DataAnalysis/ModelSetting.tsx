import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Grid, Typography } from '@mui/material'
import LineChart from './components/Chart/LineChart'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  stepCountStore,
  variableStoreX,
  variableStoreY,
  selectedVarStoreX,
  selectedVarStoreY,
  dataSetStore,
  dataFileStore,
} from './store/atom'
import { Col, Divider, Row, Select, Space, Spin, Button, Popover, message } from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'
// import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined'
import './style/styles.css'
import ModelSavePopup from './components/Modeling/ModelSavePopup'

const ModelSetting = (props: any) => {
  const setActiveStep = useSetRecoilState(stepCountStore)

  const [selectedDataSet, setSelectedDataSet] = useRecoilState(dataSetStore)
  const [selectedDataFile, setSelectedDataFile] = useRecoilState(dataFileStore)

  //step2에서 선택된 변수
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [chartData, setChartData] = useState<any>()
  const [model, setModel] = useState('plsr')
  const [resultText, setResultText] = useState({ mae: '', r2: '', rmse: '' })
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modelingInfo, setModelingInfo] = useState({})

  //modal
  const [open, setOpen] = useState(false)

  const [options, setOptions] = useState([
    { value: 'plsr', label: 'PLS' },
    { value: 'rfr', label: 'Random Forest' },
  ])

  //step4에서 선택된 변수
  const [selectedTagsX, setSelectedTagsX] = useState([])
  const [selectedTagsY, setSelectedTagsY] = useState([])

  const text = <span>Title</span>
  const content = (
    <div>
      <p>MAE : {resultText.mae}</p>
      <p>R² : {resultText.r2}</p>
      <p>RMSE : {resultText.rmse}</p>
    </div>
  )

  //messages
  const [messageApi, contextHolder] = message.useMessage()
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    })
  }

  // const mergedArrow = useMemo(() => {
  //   if (arrowAtCenter) return { pointAtCenter: true };
  //   return showArrow;
  // }, [showArrow, arrowAtCenter]);

  useEffect(() => {
    setSelectedTagsY([selectedVarY[0]]) //첫번째 타겟 선택
    setSelectedTagsX(selectedVarX)
  }, [])

  const fetchModelingData = (type: string, modelName?: string) => {
    // const ChartDataArr: any = []

    // console.log(selectedTagsX)
    // console.log(selectedDataFile)

    if (selectedTagsX.length > 0 && selectedTagsY.length > 0) {
      const param = {
        com_id: localStorage.getItem('companyId'),
        dataset_id: selectedDataSet,
        file_nm: selectedDataFile,
        y_value: selectedTagsY,
        x_value: selectedTagsX,
        predict_type: model,
        model_nm: modelName,
        upload: type === 'SAVE' ? true : false,
      }
      // console.log(param)

      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/aimodel', param).then(
        (response) => {
          setLoading(true)
          if (response.status === 200) {
            // console.log('chartData response:', response.data)

            if (type === 'RUN') {
              const result = response.data
              const dataArray = []
              setResultText({ mae: '', r2: '', rmse: '' })
              for (let i = 0; i < result.length; i++) {
                if (result[i].name === 'evaluation') {
                  setResultText(result[i])
                } else {
                  dataArray.push(result[i])
                }
              }
              setChartData(dataArray)
            } else if (type === 'SAVE') {
              alert('Saved!')
              handleClose()
              setOpen(false)
            }
          }
          setLoading(false)
        },
        (error) => console.log(error)
      )

      // axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/chartData?', param).then((response) => {
      //   setLoading(true)
      //   if (response.status === 200) {
      //     // console.log('chartData response:', response.data)
      //     const result = response.data

      //     const dataArray = []
      //     setResultText({ mae: '', r2: '', rmse: '' })
      //     for (let i = 0; i < result.length; i++) {
      //       if (result[i].name === 'evaluation') {
      //         setResultText(result[i])
      //       } else {
      //         dataArray.push(result[i])
      //       }
      //     }
      //     setChartData(dataArray)
      //   }
      //   setLoading(false)
      // })
      // } else {
      //   alert('Variables are not selected')
      //   setActiveStep(1)
      //   setLoading(false)
      // }
    }
  }

  const handleRun = (event: any) => {
    fetchModelingData('RUN')
  }

  const handleChange = (value: string) => {
    // console.log('test:', value)
    setModel(value)
  }

  const handleChangeTag = (type: string, tag: string, checked: boolean) => {
    if (type === 'y') {
      if (checked && selectedTagsY.length > 0) {
        const nextSelectedTags = checked ? [tag] : selectedVarY.filter((t) => t !== tag)
        setSelectedTagsY(nextSelectedTags)
      }
    } else if (type === 'x') {
      let nextSelectedTags = []
      if (checked) {
        nextSelectedTags = [...selectedTagsX, tag]
        setSelectedTagsX(nextSelectedTags)
      } else {
        if (selectedTagsX.length == 1) {
          //마지막 하나 선택된거는 유지
          setSelectedTagsX(selectedTagsX)
        } else {
          nextSelectedTags = selectedTagsX.filter((t) => t !== tag)
          setSelectedTagsX(nextSelectedTags)
        }
      }
      // const nextSelectedTags = checked ? [...selectedTagsX, tag] : selectedTagsX.filter((t) => t !== tag)
    }
  }

  const handleFeatureSuggest = () => {
    if (selectedTagsY && selectedTagsY.length > 0) {
      fetchFeatureSuggest(selectedTagsY[0])
    } else {
      alert('타겟변수를 선택해주세요')
    }
  }

  const fetchFeatureSuggest = (y: any) => {
    setBtnLoading(true)

    const param = {
      y_value: selectedTagsY[0],
      x_value: selectedTagsX,
      com_id: localStorage.getItem('companyId'),
      dataset_id: selectedDataSet,
      file_nm: selectedDataFile,
    }

    // console.log('param:', param)
    axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/boruta', param).then((response) => {
      setBtnLoading(false)

      // console.log('boruta resp:', response)

      const suggestedArr = response.data
      const newSelection = []
      if (suggestedArr.length > 0) {
        for (let i = 0; i < suggestedArr.length; i++) {
          if (selectedVarX.includes(suggestedArr[i]))
            newSelection.push(selectedVarX.filter((x: any) => x === suggestedArr[i])[0])
        }
        setSelectedTagsX(newSelection)
        // console.log('selectedTagX:', newSelection)
      } else {
        alert('추천 변수가 없습니다')
      }
    })
  }

  const handleModelSave = () => {
    setOpen(true)
    setModelingInfo({ predict_type: model, x_value: selectedTagsX, y_value: selectedTagsY[0] })
    // fetchModelingData('SAVE')
  }

  const handleClose = () => {
    // setOpen(false)
  }

  const handleSave = (title: string) => {
    // console.log('title:', title)
    fetchModelingData('SAVE', title)
    // success()
  }

  return (
    <>
      <Box
        id="example"
        className="rounded-box"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            // width: '100%',
            // height: 100,
          },
        }}
      >
        <Grid item width="100%" style={{ textAlign: 'left' }}>
          {/* <Divider orientation="left"></Divider> */}
          <Row justify="space-evenly" align="top" style={{ marginTop: '15px' }}>
            <Col span="8">
              <div style={{ width: '70%', margin: 'auto', minWidth: '150px' }}>
                <Typography variant="subtitle2" gutterBottom marginLeft={1}>
                  AI Model
                </Typography>
                <Select
                  value={model}
                  options={options}
                  onChange={handleChange}
                  // defaultValue={selectedArr}
                />
              </div>
            </Col>
            <Col span="8">
              <Typography variant="subtitle2" gutterBottom marginLeft={1}>
                타겟변수(Y)
              </Typography>
              {/* <span style={{ marginRight: 8 }}>타겟변수(Y) : </span> */}
              <Space size={[0, 8]} wrap>
                {selectedVarY.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTagsY.includes(tag)}
                    onChange={(checked) => handleChangeTag('y', tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
              <div style={{ width: '90%', margin: '6px' }}>
                {selectedVarY.length > 0 && (
                  <Button
                    type="default"
                    style={{ width: '100%' }}
                    onClick={handleFeatureSuggest}
                    // icon={<AssistantOutlinedIcon />}
                    loading={btnLoading}
                  >
                    Feature Suggestion
                  </Button>
                )}
              </div>
            </Col>
            <Col span="8">
              <Typography variant="subtitle2" gutterBottom marginLeft={1}>
                원인변수(X)
              </Typography>
              <Space size={[0, 8]} wrap>
                {selectedVarX.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTagsX.includes(tag)}
                    onChange={(checked) => handleChangeTag('x', tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </Col>
          </Row>
          <Button type="primary" onClick={handleRun} style={{ float: 'right', textAlign: 'right' }} loading={loading}>
            RUN
          </Button>
        </Grid>
      </Box>
      <Box
        marginTop={2}
        paddingBottom={2}
        className="rounded-box"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 3,
            // width: '100%',
            // height: 100,
          },
        }}
      >
        {/* </Paper> */}
        <div style={{ display: 'block' }}>
          <Popover placement="rightTop" title="평가 지표" content={content}>
            <Button>평가 지표</Button>
          </Popover>
        </div>
        <div style={{ display: 'block', width: '100%', margin: 'auto' }}>
          <LineChart chartData={chartData} />
        </div>
      </Box>
      <Button
        type="primary"
        onClick={handleModelSave}
        style={{ float: 'right', textAlign: 'right', marginTop: '10px' }}
      >
        MODEL SAVE
      </Button>
      <ModelSavePopup modalOpen={open} onClose={handleClose} data={modelingInfo} onSave={handleSave} />
      {contextHolder}
    </>
  )
}

export default ModelSetting
