import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { DatePicker, Space, Select, Button } from 'antd'
import ItemBox from './components/DataEntry/ItemBox'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { dataFileStore, dataSetStore, variableStore } from './store/atom'
import NewTagSelect from './components/TagTree/NewTagSelect'
import SliderWithNumber from './components/DataEntry/SliderWithNumber'
import Plot from 'react-plotly.js'
import RadioButtonGroup from './components/DataEntry/RadioButtonGroup'

const CorrelationViewContainer = styled.div`
  display: block;
  float: left;
  width: 100%;
  height: 700px;
  margin: 0 1vw;
  // border: 1px solid red;
`
const HyperpararmeterWrapper = styled.div`
  display: block;
  float: left;
  margin-left: 2vw;
  width: 35%;
  height: 450px;
  // border: 1px solid blue;
`
const PlotWrapper = styled.div`
  padding: 3vw 0;
  display: block;
  float: left;
  width: 60%;
  height: 465px;
  // border: 1px solid blue;
  // background-color: pink;
`

const CorrelationView = () => {
  const { RangePicker } = DatePicker
  const selectedDataset = useRecoilState(dataSetStore)
  const selectedFile = useRecoilState(dataFileStore)

  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [plotData, setPlotData] = useState()
  const [plotImg, setPlotImg] = useState('')
  const [base64, setBase64] = useState('')
  const [scalingOption, setScalingOption] = useState('iqr')
  const [layoutOption, setLayoutOption] = useState()
  const [featureX, setFeatureX] = useState([])
  const [featureY, setFeatureY] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // fetchTaglistData()
    // fetchCorrelationPlot()
    setLoading(false)
  }, [])

  // const layoutOption: any = {
  //   // automargin: true,
  //   autoresize: true,
  //   hovermode: 'closest',
  //   title: 'Result',
  //   // width: '1000',
  //   height: '420',
  //   plot_bgcolor: 'rgba(255,255,255,0)',
  //   // paper_bgcolor: 'lightpink',
  //   xaxis: {
  //     type: 'date',
  //     tickformat: '%d %b\n %H:%M',
  //     // tickangle: 90,
  //     rangeslider: {},
  //   },
  //   yaxis: {
  //     fixedrange: true,
  //   },
  //   pad: { r: 10, b: 10 },
  //   // margin: { top: 0 },
  //   // updatemenus: updatemenus,
  // }

  // const fetchTaglistData = () => {
  //   // console.log('selectedDataset:', selectedDataset)
  //   // console.log('selectedFile:', selectedFile)

  //   const param = [
  //     {
  //       id: selectedDataset[0],
  //       file_name: selectedFile[0],
  //     },
  //   ]

  //   // console.log('param：', param)

  //   axios
  //     .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag', param)
  //     .then((response) => {
  //       // console.log('fetchTaglistData:', response.data)
  //       setVariableList(response.data)

  //       const values = response.data[0].options
  //       const valueArr: Array<any> = values.map((item: any) => item.value)

  //       const result: Array<any> = []
  //       valueArr.forEach((value: any) => {
  //         result.push({ value: value, used: false })
  //       })

  //       // setUsedVariable(result)
  //     })
  //     .catch((error) => alert('TagData Load Failed::'))
  // }

  const fetchCorrelationPlot = async () => {
    setLoading(true)

    const param = {
      response_type: 'img',
      dataset_id: selectedDataset[0],
      file_nm: selectedFile[0],
      scaling_method: scalingOption,
      x_value: featureX,
      y_value: featureY,
    }

    console.log('param:', param)

    // response type: 'json'
    await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/corrplot/cplot', param)
      .then((response: any) => {
        setLoading(false)

        if (typeof response.data === 'object') {
          setPlotData(response.data.data)
          setLayoutOption(response.data.layout)
        } else if (typeof response.data === 'string') {
          console.log('img received::', response)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })

    // response_type : 'img' 인 경우
    // await axios
    //   .post<Blob>('http://101.101.209.181:8080' + '/api/corrplot/cplot', param, {
    //     responseType: 'blob',
    //   })
    //   .then((res) => {
    //     const myFile = new File([res.data], 'imageName')
    //     const reader = new FileReader()
    //     reader.onload = (ev) => {
    //       const previewImage = String(ev.target?.result)
    //       console.log('111::', previewImage)
    //       setPlotImg(previewImage) // myImage라는 state에 저장했음
    //     }
    //     reader.readAsDataURL(myFile)
    //   })
  }

  const handleSearchClick = () => {
    fetchCorrelationPlot()
  }

  const handleRadioButtonChange = (e: any) => {
    // console.log('radio checked', e.target.value)
    setScalingOption(e.target.value)
  }

  const handleFeatureSelect = (param: any) => {
    // console.log('param:', param)

    if (param.type === 'y') setFeatureY(param.value)
    if (param.type === 'x') setFeatureX(param.value)
  }

  return (
    <>
      <CorrelationViewContainer>
        <PlotWrapper className="rounded-box">
          {plotImg && <img src={plotImg} width="500" height="200" style={{ margin: 'auto' }} />}
          {/* {plotData && <Plot data={plotData} layout={layoutOption} />} */}
        </PlotWrapper>

        <HyperpararmeterWrapper>
          {' '}
          <Box
            className="rounded-box"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > :not(style)': {
                width: '100%',
                height: '70%',
                p: 5,
                // m: 1,
              },
            }}
          >
            <Space direction="vertical" size={12}>
              {/* <Typography
                variant="subtitle2"
                gutterBottom
                marginLeft={0}
                style={{ display: 'inline-block', float: 'left' }}
              >
                시계열 데이터
              </Typography> */}
              {/* <Switch onChange={onChangeSwitch} checked={checked} style={{ margin: '0 10px' }} /> */}
              {/* <ItemBox title="Date Range" component={<RangePicker size="middle" style={{ width: '100%' }} />} /> */}
              <ItemBox
                title="Variable X"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="TARGET_VARIABLE"
                    onChange={handleFeatureSelect}
                  />
                }
              />
              <ItemBox
                title="Variable Y"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="EXPLANATORY_VARIABLE"
                    onChange={handleFeatureSelect}
                  />
                }
              />
              {/* <ItemBox title="Marker Size" component={<SliderWithNumber />} /> */}
              <ItemBox
                title="Scaling Option"
                component={<RadioButtonGroup onChangeValue={handleRadioButtonChange} />}
              />

              <Button type="primary" block style={{ marginTop: '50px' }} onClick={handleSearchClick} loading={loading}>
                Search
              </Button>
            </Space>
          </Box>
        </HyperpararmeterWrapper>
      </CorrelationViewContainer>
    </>
  )
}

export default CorrelationView
