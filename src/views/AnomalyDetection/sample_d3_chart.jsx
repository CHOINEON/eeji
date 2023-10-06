/* eslint-disable prettier/prettier */
import { Box, Flex, flexbox } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Switch, Space, Button, Card, Statistic, Col, Row } from 'antd'
import { Checkbox } from 'antd'
import FeatureSlider from './components/Slider'
import CSS from './components/style.module.css'
import { useRecoilState } from 'recoil'
import { sliderValueState, ThreValueState } from './atom'
import axios from 'axios'
import styled from 'styled-components'
import { column } from 'stylis'
import ThreSlider from './components/ThrSlider'

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`)
}
const AdvancedChart = () => {
  const originURL = 'ws://222.121.66.49:8001/ws/web'
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  const [index, setIndex] = useState([])
  const [dataArr, setDataArr] = useState([])
  const [testData, setTestData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])
  // Control panel을 위한 useState
  const [indexSize, setIndexSize] = useState([])
  const [price, setPrice] = useState([])
  const [volume, setVolume] = useState([])
  const [clickedPoint, setClickedPoint] = useState({ x: null, y: null })

  const handleChartClick = (data) => {
    for (const point of data.points) {
      const clickedXvalue = point.x
      const clickedYvalue = point.y
      console.log('클릭한 포인트 (내부):', clickedXvalue, clickedYvalue)
      setClickedPoint({ clickedXvalue, clickedYvalue })
    }
  }

  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)
      setDataArr((prev) => {
        return [...prev, socketData.data[0][0]]
      })
      setIndex((prev) => {
        return [...prev, socketData.index[0]]
      })
      setAnomalyScoreArr((prev) => {
        return [...prev, socketData.anomaly_pred[0]]
      })
      setThresholdArr((prev) => {
        return [...prev, socketData.thr[0]]
      })
      if (Array.isArray(socketData.feature_names) && socketData.feature_names.length > 0) {
        // 배열의 첫 번째 요소에 접근
        setPrice(socketData.feature_names[0])
        setVolume(socketData.feature_names[1])
      } else {
      }
      setIndexSize(socketData.index_size)

      const plotData = [
        {
          x: index,
          y: dataArr,
          type: 'line',
          mode: 'lines',
          name: 'data',
          line: {
            color: 'black',
            width: '2',
          },
          hovertemplate: '<b>Data</b><br>Index: %{x}<br>Data: %{y}',
        },
        {
          x: index,
          y: anomalyScoreArr,
          name: 'Anomaly Score',
          type: 'line',
          line: {
            color: 'red',
          },
          mode: 'lines',
          yaxis: 'y2',
          visible: isVisible,
          hovertemplate: '<b>Anomaly Score</b><br>Index: %{x}<br>Score: %{y}',
        },
        {
          x: index,
          y: thresholdArr,
          name: 'threshold',
          type: 'scatter',
          mode: 'lines+markers',
          marker: {
            color: 'green',
            size: 3,
            symbol: 'square',
          },
          line: {
            color: 'green',

            dash: 'dash',
          },
          yaxis: 'y2',
          visible: yesVisible,
          hovertemplate: '<b>Threshold</b><br>Index: %{x}<br>Threshold: %{y}',
        },
      ]
      setTestData(plotData)
    }
  }, [socketData])

  const config = [
    {
      displayModeBar: false,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
    },
  ]

  const layout = {
    title: 'Anomaly Detection Plot',
    titlefont: { size: 20 },

    xaxis: {
      title: 'Index',
      titlefont: { size: 20 },
    },

    yaxis: {
      title: 'Data',
      titlefont: { size: 20 },
      tickfont: { size: 15 },
    },

    yaxis2: {
      title: 'anomaly score',
      titlefont: { color: 'black', size: 20 },
      tickfont: { color: 'black', size: 15 },
      overlaying: 'y',
      side: 'right',
      zeroline: false,
    },

    margin: {
      t: 80,
      b: 100,
      l: 110,
      r: 100,
    },

    // displayModeBar: false,
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }
  /*add timestamp*/
  useEffect(() => {
    var timestamp = Date.now()
    var newURL = `${originURL}${timestamp}`
    const ws = new WebSocket(newURL)
    ws.onopen = () => {
      console.log(`WebSocket connection`)
    }
    /*parsing the incoming data*/
    ws.onmessage = (message) => {
      const dataString = message.data.trim()
      try {
        const dataObj = JSON.parse(dataString)
        setSocketData(dataObj)
      } catch (error) {
        console.error('JSON parsing error:', error)
      }
    }
    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed unexpectedly`)
      } else {
        console.log('WebSocket connection closed')
      }
    }
    return () => {
      ws.close()
    }
  }, [])

  const [isVisible, setIsVisible] = useState(true)
  const handleScoreToggle = () => {
    setIsVisible(!isVisible)
  }
  const [yesVisible, setYesVisible] = useState(true)
  const handleThreToggle = () => {
    setYesVisible(!yesVisible)
  }

  async function load_shap_plot(event) {
    event.preventDefault()

    try {
      const response = await fetch('http://222.121.66.49:8001/load_shap_plot', {
        method: 'GET',
      })
      // console.log('test:', response)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.text()

      const shapPlotContainer = document.getElementById('shapPlotContainer')
      shapPlotContainer.innerHTML = getHtmlElement(result) //html 요소만 잘라옴

      addScriptToDom(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function getHtmlElement(text) {
    // var scripts = ''
    // var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
    //   scripts += arguments[1] + '\n'
    //   return ''
    // })
    // return cleaned

    return text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
  }

  function addScriptToDom(text) {
    let scripts = ''
    text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
      scripts += arguments[1] + '\n'
    })

    // console.log('window.execScript:', window.execScript)
    // if (window.execScript) {
    //   window.execScript(scripts)
    //   console.log('hi')
    // } else {

    var head = document.getElementsByTagName('head')[0]
    var scriptElement = document.createElement('script') //public/index

    scriptElement.setAttribute('type', 'text/javascript')
    scriptElement.innerText = scripts

    head.appendChild(scriptElement)
    head.removeChild(scriptElement)
  }

  const [sliderValue, setSliderValue] = useRecoilState(sliderValueState)
  const [threValue, setThreValue] = useRecoilState(ThreValueState)

  const handleClick = () => {
    const param = {
      revised_values: [[sliderValue.price, sliderValue.volume]],
    }

    console.log('param;', param)
    axios
      .post('http://222.121.66.49:8001/post_new_input', param)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const handleSecClick = () => {
    const param = {
      revised_values: [[ThreValueState.Threshold]],
    }

    console.log('param;', param)
    axios
      .post('http://222.121.66.49:8001/post_new_input', param)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{
        position: 'relative',
        zIndex: 1000,
        width: '100%',
        height: '100%',
        useResizeHandler: 'true',
        responsive: 'true',
        autosize: 'true',
      }}
    >
      <div className={CSS.Top}>
        {/* <div className = {CSS.ButtonContainer}> 
              <Switch
                    style={{ width: 100, marginRight : 3 }}
                    onClick={handleThreToggle}
                    checkedChildren=" THRESHOLD "
                    unCheckedChildren="THRESHOLD "
                    defaultChecked/>
              <Switch
                    style={{ width: 100 }}
                    onClick={handleScoreToggle}
                    checkedChildren=" ANOMALY SCORE "
                    unCheckedChildren="ANOMALY SCORE "
                    defaultChecked/> 
        </div> */}
        <Plot
          data={testData}
          layout={layout}
          useResizeHandler={true}
          responsive={true}
          autosize={true}
          style={{ width: '100%', height: '100%' }}
          config={config}
          onClick={handleChartClick}
        />
      </div>

      <div className={CSS.Panel}>
        <Space direction="Vertical">
          <Space direction="Horizontal">
            <Card
              style={{
                width: 400,
                height: 370,
                responsive: true,
                useResizeHandler: true,
                autosize: true,
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Statistic
                value="SELECTED DATA"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                }}
              />
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="X Data" value={[clickedPoint.clickedXvalue]} />
                </Col>
                <Col span={8}>
                  <Statistic title="Y Data" value={[clickedPoint.clickedYvalue]} />
                </Col>
              </Row>
              <br />
              <Statistic
                value="IMPORT DATA"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                }}
              />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="DATA" value={thresholdArr[0]} />
                </Col>
              </Row>
              <br />
              <Statistic
                value="INDEX SIZE"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                }}
              />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="DATA" value={indexSize} />
                </Col>
              </Row>
            </Card>
          </Space>
          {/* <Card style={{ 
                      width:150, 
                      height:150,
                      marginTop : 20,
                      marginBottom : 10,  
                      responsive: true, 
                      useResizeHandler: true, 
                      autosize: true, 
                      }}>
                <Statistic  
                    value="INDEX SIZE" 
                    valueStyle={{
                              fontWeight:500, 
                              fontSize : 20,
                            }}
                /> 
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic title="DATA" value={indexSize} />
                      </Col>
                    </Row>     
          </Card> */}

          <div className={CSS.featureBox}>
            <Card
              style={{
                height: 370,
                marginTop: 20,
                responsive: true,
                useResizeHandler: true,
                autosize: true,
              }}
            >
              <Statistic
                value="FEATURES"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                  marginBottom: 10,
                }}
              />
              <Checkbox onChange={onChange}>{price}</Checkbox>
              <Checkbox onChange={onChange}>{volume}</Checkbox>
              <FeatureSlider clickedPoint={clickedPoint} />{' '}
              <Button
                type="primary"
                onClick={handleClick}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                {' '}
                SUBMIT
              </Button>
            </Card>
          </div>
          <div className={CSS.ThreBox}>
            <Card
              style={{
                height: 370,
                marginTop: 20,
                responsive: true,
                useResizeHandler: true,
                autosize: true,
              }}
            >
              <Statistic
                value="THRESHOLD "
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                }}
              />
              <Row gutter={16}>
                <Col span={10}>
                  <Statistic value={socketData.thr} />
                </Col>
              </Row>

              <ThreSlider clickedPoint={clickedPoint} />
              <Button
                type="primary"
                onClick={handleSecClick}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px',
                }}
              >
                {' '}
                SUBMIT
              </Button>
            </Card>
          </div>
          <div className={CSS.plotButton}>
            <Card
              style={{
                height: 370,
                marginTop: 20,
                responsive: true,
                useResizeHandler: true,
                autosize: true,
              }}
            >
              <Statistic
                value="CHART SETTING"
                valueStyle={{
                  fontWeight: 500,
                  fontSize: 20,
                }}
              />
              <div className={CSS.ButtonContainer}>
                <Switch
                  style={{ width: 100, marginRight: 3, MarginTop: 10 }}
                  onClick={handleThreToggle}
                  checkedChildren=" THRESHOLD "
                  unCheckedChildren="THRESHOLD "
                  defaultChecked
                />
                <Switch
                  style={{ width: 100 }}
                  onClick={handleScoreToggle}
                  checkedChildren=" ANOMALY SCORE "
                  unCheckedChildren="ANOMALY SCORE "
                  defaultChecked
                />
              </div>
            </Card>
          </div>
        </Space>
      </div>

      <Card
        style={{
          height: 250,
          responsive: true,
          useResizeHandler: true,
          autosize: true,
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            textAlign: 'center',
          }}
        >
          <Statistic
            value="SHAP RESULT"
            valueStyle={{
              fontWeight: 600,
            }}
          />
          <Button onClick={load_shap_plot}>Shap 플롯 로드</Button>
          <div
            id="shapPlotContainer"
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: 'white',
              paddingTop: '20px',
            }}
          ></div>
        </div>
      </Card>
    </Box>
  )
}

export default AdvancedChart
