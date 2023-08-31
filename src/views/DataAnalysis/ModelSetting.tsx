import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Grid, Typography } from '@mui/material'
import LineChart from './components/Chart/LineChart'
import './style/styles.css'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { stepCountStore, dataSetStore, dataFileStore } from './store/atom'
import { selectedVarStoreX, selectedVarStoreY } from './store/variable/atom'
import { Col, Row, Select, Space, Button, Popover, message, Statistic, CountdownProps, notification } from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'
import ModelSavePopup from './components/Modeling/ModelSavePopup'
import { saveModalAtom } from './store/modal/atom'
import { NotificationPlacement } from 'antd/es/notification/interface'
import styled from '@emotion/styled'

const TimerContainer = styled.div<{ visible: boolean }>`
  display: ${(props: any) => (props.visible ? 'inline-block' : 'none')};
  float: right;
  margin-top: 10px;
  margin-right: 10px;
`

const ModelSetting = (props: any) => {
  const { Countdown } = Statistic

  const setActiveStep = useSetRecoilState(stepCountStore)
  const setSaveModalOpen = useSetRecoilState(saveModalAtom)
  const selectedDataSet = useRecoilValue(dataSetStore)
  const selectedDataFile = useRecoilValue(dataFileStore)

  //step2에서 선택된 변수(for rendering)
  const selectedVarX = useRecoilValue(selectedVarStoreX)
  const selectedVarY = useRecoilValue(selectedVarStoreY)

  //step4에서 선택된 변수(for fetching data)
  const [selectedTagsX, setSelectedTagsX] = useState([])
  const [selectedTagsY, setSelectedTagsY] = useState([])

  const [chartData, setChartData] = useState({})
  const [model, setModel] = useState('plsr')
  const [resultText, setResultText] = useState({ mae: '', rmse: '' })

  const [btnLoading, setBtnLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [modelingInfo, setModelingInfo] = useState({})
  const [saveDisabled, setSaveDisabled] = useState(true)

  const [messageApi, msgContextHolder] = message.useMessage()
  const [api, apiContextHolder] = notification.useNotification()
  const [countdownValue, setCountdownValue] = useState(Date.now() + 3000 * 1000)
  const [timerVisible, setTimerVisible] = useState(false)

  const options = [
    { value: 'ineeji', label: 'INEEJI' },
    { value: 'plsr', label: 'PLS' },
    { value: 'rfr', label: 'Random Forest' },
    { value: 'cnn1d', label: '1DCNN' },
    { value: 'mlp', label: 'MLP' },
    { value: 'cnnlstm', label: 'CNNLSTM' },
    { value: 'lstm', label: 'LSTM' },
    // { value: 'pls_1dcnn', label: 'PLS_1DCNN' },
    { value: 'nbeats', label: 'NBEATS' },
    { value: 'nhits', label: 'NHITS' },
    { value: 'nlinear', label: 'NLINEAR' },
    { value: 'tstmodel', label: 'TSTMODEL' },
    { value: 'tftmodel', label: 'TFTMODEL' },
  ]

  const content = (
    <div>
      <p>MAE : {resultText.mae}</p>
      <p>RMSE : {resultText.rmse}</p>
    </div>
  )

  // const mergedArrow = useMemo(() => {
  //   if (arrowAtCenter) return { pointAtCenter: true };
  //   return showArrow;
  // }, [showArrow, arrowAtCenter]);

  useEffect(() => {
    setSelectedTagsY([selectedVarY[0]]) //step3에서 선택된 타겟 렌더링
    setSelectedTagsX(selectedVarX)
  }, [])

  const refreshData = () => {
    setChartData({})
    setResultText({ mae: '', rmse: '' })
  }
  const fetchModelingData = (type: string, modelName?: string, desc?: string) => {
    setRunning(true)
    setTimerVisible(false)

    if (selectedTagsX.length > 20) {
      messageApi.open({
        type: 'error',
        content: 'X는 20개까지만 선택 가능합니다.',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
      return false
    } else if (selectedTagsX.length > 0 && selectedTagsY.length > 0) {
      const param = {
        com_id: localStorage.getItem('companyId'),
        user_id: localStorage.getItem('userId'),
        dataset_id: selectedDataSet,
        file_nm: selectedDataFile,
        y_value: selectedTagsY,
        x_value: selectedTagsX,
        predict_type: model,
        upload: type === 'SAVE' ? true : false,
        model_nm: type === 'SAVE' ? modelName : null,
        desc: type === 'SAVE' ? desc : null,
      }
      // console.log(param)
      refreshData()

      axios
        .post(process.env.REACT_APP_API_SERVER_URL + '/api/aimodel', param)
        .then((response) => {
          if (type === 'RUN') {
            const result = response.data
            console.log('/api/aimodel::', result)

            setResultText(result.evaluation)

            setRunning(false)
            setChartData(result)
            setTimerVisible(true)
            setSaveDisabled(false)
            setCountdownValue(Date.now() + 3000 * 1000)
          }
        })
        .catch((err) => {
          setRunning(false)
          setSaveModalOpen(false)
          setTimerVisible(false)
          setSaveDisabled(true)
          console.log(err)
        })
    } else {
      setSaveModalOpen(false)
    }
  }

  const fetchSaveModel = (modelName?: string, desc?: string) => {
    const param = {
      user_id: localStorage.getItem('userId'),
      model_name: modelName,
      desc: desc,
    }

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/save_model', param)
      .then((response) => {
        console.log('/api/save_model::', response)
        if (response.status === 200) {
          messageApi.open({
            type: 'success',
            content: 'Saved.',
            duration: 1,
            style: {
              margin: 'auto',
            },
          })
          setSaveModalOpen(false)
        }
      })
      .catch((err) => {
        setSaveModalOpen(false)
        messageApi.open({
          type: 'error',
          content: '저장 실패. 관리자에게 문의하세요.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
        console.log(err)
      })
  }

  const handleRun = () => {
    setSaveDisabled(true)
    // console.log('x:', selectedTagsX)
    // console.log('y:', selectedTagsY)
    if (selectedTagsX.length === 0) {
      messageApi.open({
        type: 'error',
        content: '변수가 선택되지 않았습니다.',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
    } else {
      fetchModelingData('RUN')
    }
  }

  const handleChange = (value: string) => {
    setModel(value)

    // const tempModels = ['pls_1dcnn']
    // setSaveDisabled(tempModels.includes(value))
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
        if (selectedTagsX.length < 21) {
          nextSelectedTags = [...selectedTagsX, tag]
          setSelectedTagsX(nextSelectedTags)
        } else {
          alert('20개까지만 선택 가능합니다.')
        }
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
      user_id: localStorage.getItem('userId'),
      dataset_id: selectedDataSet,
      file_nm: selectedDataFile,
    }

    // console.log('param:', param)
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/boruta', param)
      .then((response) => {
        // console.log('boruta resp:', response)

        const suggestedArr = response.data
        const newSelection: Array<any> = []

        if (suggestedArr.length > 0) {
          for (let i = 0; i < suggestedArr.length; i++) {
            if (selectedVarX.includes(suggestedArr[i]))
              newSelection.push(selectedVarX.filter((x: any) => x === suggestedArr[i])[0])
          }

          if (selectedVarX.every((item: any) => newSelection.includes(item))) {
            messageApi.open({
              type: 'success',
              content: '모든 추천 변수가 선택 되었습니다.',
              duration: 1,
              style: {
                margin: 'auto',
              },
            })
          } else {
            setSelectedTagsX(newSelection)
          }
        } else {
          messageApi.open({
            type: 'error',
            content: '추천 변수가 없습니다.',
            duration: 1,
            style: {
              margin: 'auto',
            },
          })
        }
        setBtnLoading(false)
      })
      .catch((error) => {
        console.log('error:', error)
        setBtnLoading(false)
      })
  }

  function isEmptyObj(obj: any) {
    if (obj.constructor === Object && Object.keys(obj).length === 0) {
      return true
    }
    return false
  }

  const handleModelSave = () => {
    // console.log('chartData:', chartData)
    if (isEmptyObj(chartData)) {
      messageApi.open({
        type: 'error',
        content: '저장할 모델이 없습니다.',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
    } else {
      setSaveModalOpen(true)
      setModelingInfo({ predict_type: model, x_value: selectedTagsX, y_value: selectedTagsY[0] })
    }
  }

  const handleSave = (title: string, desc: string) => {
    fetchSaveModel(title, desc)
  }

  const onChange: CountdownProps['onChange'] = (val) => {
    if (typeof val === 'number' && 59.95 * 1000 < val && val < 60 * 1000) {
      openNotification('topRight')
    }
  }

  const openNotification = (placement: NotificationPlacement) => {
    api.warning({
      message: `Notification`,
      description: '저장하지 않은 모델은 1분 뒤 사라집니다.',
      placement,
    })
  }

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!')
    setActiveStep(0)
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
          <Button type="primary" onClick={handleRun} style={{ float: 'right', textAlign: 'right' }} loading={running}>
            RUN
          </Button>
        </Grid>
      </Box>
      <Box
        style={{ minHeight: '600px' }}
        marginTop={2}
        paddingBottom={2}
        className="rounded-box"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          '& > :not(style)': {
            p: 2,
            // width: '100%',
            // height: '100%',
          },
        }}
      >
        <div className="w-100">
          <Popover placement="rightTop" title="평가 지표" content={content}>
            <Button>평가 지표</Button>
          </Popover>
        </div>
        <div className="w-100">
          <LineChart chartData={chartData} />
        </div>
      </Box>
      <Button
        type="primary"
        onClick={handleModelSave}
        style={{ float: 'right', textAlign: 'right', marginTop: '10px' }}
        disabled={saveDisabled}
      >
        MODEL SAVE
      </Button>
      <TimerContainer visible={timerVisible}>
        <Countdown title="" value={countdownValue} onChange={onChange} onFinish={onFinish} />
      </TimerContainer>
      <ModelSavePopup data={modelingInfo} onSave={handleSave} />
      {msgContextHolder}
      {apiContextHolder}
    </>
  )
}

export default ModelSetting
