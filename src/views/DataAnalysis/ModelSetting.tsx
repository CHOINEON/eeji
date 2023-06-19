import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import LineChart from './components/Chart/LineChart'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRecoilState, useRecoilValue } from 'recoil'
import { stepCountStore, variableStoreX, variableStoreY, selectedVarStoreX, selectedVarStoreY } from './atom'
import TagSelectList from './components/TagTree/TagSelectList'
import { Col, Divider, Row, Select } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'

const ModelSetting = (props: any) => {
  const varListX = useRecoilValue(variableStoreX)
  const varListY = useRecoilValue(variableStoreY)
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const [chartData, setChartData] = useState<any>()
  const [model, setModel] = useState('PLS')
  const [resultText, setResultText] = useState({ mae: '', r2: '', rmse: '' })
  const [loading, setLoading] = useState(false)

  const [options, setOptions] = useState([{ value: 'PLS', label: 'PLS' }])

  const fetchChartData = () => {
    // const ChartDataArr: any = []

    if (selectedVarX.length > 0 && selectedVarY !== undefined) {
      setLoading(true)

      const param = {
        x_value: selectedVarX[0].variable,
        y_value: selectedVarY[0].variable[0],
      }
      // console.log(param)

      axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/chartData?', param).then((response) => {
        console.log('response:', response.data)
        const result = response.data

        const dataArray = []
        for (let i = 0; i < result.length; i++) {
          if (i == result.length - 1) {
            setResultText(result[i])
          } else {
            dataArray.push(result[i])
          }
          // chartDataObj = [real_data, pred_data]
          // chartDataObj = {
          //   name: `test`,
          //   x: data[i].x,
          //   y: data[i].y,
          //   // type: 'scatter',
          //   mode: 'lines',
          //   // mode: 'markers',
          //   marker: { size: 1 },
          // }
          // dataArray.push(chartDataObj)
        }
        // console.log('dataArray::', dataArray)

        setLoading(false)
        setChartData(dataArray)
      })
    } else {
      alert('Variables not selected')
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
    console.log('test:', value)
    // setModel(value)
  }

  return (
    <>
      <Box
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
          <Row justify="space-evenly" align="top" style={{ marginTop: '10px' }}>
            <Col span="8">
              <div style={{ width: '70%', margin: 'auto', minWidth: '150px' }}>
                <Typography variant="subtitle2" gutterBottom marginLeft={1}>
                  AI Model
                </Typography>
                <Select
                  value="PLS"
                  options={options}
                  onChange={handleChange}
                  // defaultValue={selectedArr}
                />
              </div>
            </Col>
            <Col span="8">
              {/* <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="multiple"
                type="TARGET_VARIABLE"
                title="타겟변수(Y)"
                onSelectionChanged={onSelectionChanged}
              /> */}
            </Col>
            <Col span="8">
              {/* <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="multiple"
                type="EXPLANATORY_VARIABLE"
                title="원인변수(X)"
                // defaultValue={selectedArr}
              /> */}
            </Col>
          </Row>
          <Button onClick={handleRun} style={{ float: 'right', textAlign: 'right' }}>
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
      <div style={{ width: '100%', float: 'right', marginTop: '30px' }}>
        <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
          {loading ? <CircularProgress /> : null}
        </Box>
      </div>
    </>
  )
}

export default ModelSetting
