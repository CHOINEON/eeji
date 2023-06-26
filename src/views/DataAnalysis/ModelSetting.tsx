import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
import { CircularProgress, FormControlLabel, Grid, Typography } from '@mui/material'
import LineChart from './components/Chart/LineChart'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { stepCountStore, variableStoreX, variableStoreY, selectedVarStoreX, selectedVarStoreY } from './atom'
import TagSelectList from './components/TagTree/TagSelectList'
import { Col, Divider, Row, Select, Space, Spin, Button } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'
import CheckableTag from 'antd/es/tag/CheckableTag'
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined'
import './style/styles.css'

const ModelSetting = (props: any) => {
  const setActiveStep = useSetRecoilState(stepCountStore)

  //step2에서 선택된 변수
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [chartData, setChartData] = useState<any>()
  const [model, setModel] = useState('PLS')
  const [resultText, setResultText] = useState({ mae: '', r2: '', rmse: '' })
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [options, setOptions] = useState([{ value: '예측1', label: '예측1' }])

  //step4에서 선택된 변수
  const [selectedTagsX, setSelectedTagsX] = useState([])
  const [selectedTagsY, setSelectedTagsY] = useState([])

  useEffect(() => {
    // console.log('selectedVarX:', selectedVarX)
    // console.log('selectedVarY:', selectedVarY)
    // console.log('selectedVarY[0]:', selectedVarY[0])

    setSelectedTagsY([selectedVarY[0]]) //첫번째 타겟 선택
    setSelectedTagsX(selectedVarX)
  }, [])

  const fetchChartData = () => {
    // const ChartDataArr: any = []

    if (selectedTagsX.length > 0 && selectedTagsY.length > 0) {
      const param = {
        x_value: selectedTagsX,
        y_value: selectedTagsY[0],
      }
      console.log(param)

      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/chartData?', param).then((response) => {
        setLoading(true)
        if (response.status === 200) {
          console.log('chartData response:', response.data)
          const result = response.data

          const dataArray = []
          for (let i = 0; i < result.length; i++) {
            if (i == result.length - 1) {
              setResultText(result[i])
            } else {
              dataArray.push(result[i])
            }
          }
          setChartData(dataArray)
        }
        setLoading(false)
      })
    } else {
      alert('Variables are not selected')
      setActiveStep(1)
      setLoading(false)
    }
  }

  const handleRun = (event: any) => {
    fetchChartData()
  }

  const onSelectionChanged = (type: any, payload: any) => {
    // if (type === 'EXPLANATORY_VARIABLE') setExplanatoryVar(payload)
    // if (type === 'TARGET_VARIABLE') setTargetVar(payload)
  }

  const handleChange = (value: string | string[]) => {
    // console.log('test:', value)
    // setModel(value)
  }

  const handleChangeTag = (type: string, tag: string, checked: boolean) => {
    if (type === 'y') {
      if (checked && selectedTagsY.length > 0) {
        const nextSelectedTags = checked ? [tag] : selectedVarY.filter((t) => t !== tag)
        console.log('nextSelectedTags:', nextSelectedTags)
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
    console.log('selectedTagsX:', selectedTagsY)
    if (selectedTagsY && selectedTagsY.length > 0) {
      fetchFeatureSuggest(selectedTagsY[0])
    } else {
      alert('타겟변수를 선택해주세요')
    }

    // alert('테스트중입니다')
    // console.log('handleFeatureSuggest:', param)
  }

  const fetchFeatureSuggest = (y: any) => {
    console.log('y:', y)

    setBtnLoading(true)
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/predict/boruta?value=' + y).then((response) => {
      setBtnLoading(false)

      console.log('boruta resp:', response)

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
          <Row justify="space-evenly" align="top" style={{ marginTop: '20px' }}>
            <Col span="8">
              <div style={{ width: '70%', margin: 'auto', minWidth: '150px' }}>
                <Typography variant="subtitle2" gutterBottom marginLeft={1}>
                  AI Model
                </Typography>
                <Select
                  value="예측1"
                  options={options}
                  // onChange={handleChange}
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
              {/* <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="multiple"
                type="EXPLANATORY_VARIABLE"
                title="원인변수(X)"
                // selectedValue={selectedVarX}
                // defaultValue={selectedArr}
              /> */}
            </Col>
          </Row>
          <Button type="text" onClick={handleRun} style={{ float: 'right', textAlign: 'right' }} loading={loading}>
            RUN
          </Button>
        </Grid>
      </Box>
      <Box
        marginTop={5}
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
        <div style={{ display: 'block', width: '100%' }}>
          <p>MAE : {resultText.mae}</p>
          <p>R2 : {resultText.r2}</p>
          <p>RMSE : {resultText.rmse}</p>
        </div>
        <LineChart chartData={chartData} />
      </Box>
      {/* <div style={{ width: '100%', float: 'right', marginTop: '30px' }}>
        <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
          {loading ? <CircularProgress /> : null}
        </Box>
      </div> */}
    </>
  )
}

export default ModelSetting
