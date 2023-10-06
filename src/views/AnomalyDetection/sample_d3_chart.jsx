/* eslint-disable prettier/prettier */
import { Box } from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import { Switch, Space, Button, Col, InputNumber, Row, Slider } from 'antd'
import { Checkbox } from 'antd'
// import styled from 'styled-components'
import FeatureSlider from './components/Slider'
import CSS from './components/style.module.css'
import { useRecoilState } from 'recoil'
import { sliderValueState } from './atom'
import axios from 'axios'

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`)
}

const AdvancedChart = () => {
  const originURL = 'ws://222.121.66.49:8001/ws/web'
  /* managing the states of incoming data */
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
          type: 'line',
          mode: 'lines',
          line: {
            color: 'green',
          },
          yaxis: 'y2',
          visible: yesVisible,
          hovertemplate: '<b>Threshold</b><br>Index: %{x}<br>Threshold: %{y}',
        },
      ]
      setTestData(plotData)
    }
    // else (socketData.data[0][0]//T가 매우 클 경우
    //  ){
    // }
  }, [socketData])

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

  //Toggle switch
  const [isVisible, setIsVisible] = useState(true)
  const handleScoreToggle = () => {
    setIsVisible(!isVisible)
  }
  const [yesVisible, setYesVisible] = useState(true)
  const handleThreToggle = () => {
    setYesVisible(!yesVisible)
  }
  // const colors = isAnomaly.map(() => {
  //   if (isAnomaly == 1) {
  //     return 'black'
  //   } else return 'pink'
  // })
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
      t: 50,
      b: 80,
      l: 100,
      r: 80,
    },
    responsive: true,
    useResizeHandler: true,
    autosize: true,
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

  const handleClick = () => {
    // "revised_values": [
    //   [
    //     1,
    //     2
    //   ]
    // ]

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
      <div>
        <Plot
          data={testData}
          layout={layout}
          useResizeHandler={true}
          responsive={true}
          autosize={true}
          style={{ width: '100%', height: '100%' }}
          config={{ displayModeBar: true }}
          onClick={handleChartClick}
        />
      </div>
      <div className={CSS.panelContainer}>
        <div
          style={{ responsive: true, useResizeHandler: true, autosize: true, width: '100%' }}
          id="ControlPanel"
          className={CSS.controlPanel}
        >
          Control Panel
          <h1>
            Selected Data x: {[clickedPoint.clickedXvalue, clickedPoint.clickedYvalue]} y:{[clickedPoint.clickedYvalue]}
          </h1>
          <h1>Features</h1>
          <div>
            <Checkbox onChange={onChange}>{price}</Checkbox>
          </div>
          <div>
            <Checkbox onChange={onChange}>{volume}</Checkbox>
          </div>
        </div>
        <FeatureSlider clickedPoint={clickedPoint} />
        <Button onClick={handleClick}> click</Button>
        <div className="index"> </div>
      </div>
      <div>
        <div style={{ fontSize: '20px', marginTop: '20px', textAlign: 'center' }}>Shap Result</div>
        <div
          id="shapPlotContainer"
          style={{ width: '100%', height: '150px', backgroundColor: 'white', paddingTop: '20px' }}
        />
      </div>

      <Space direction="vertical">
        <Button onClick={load_shap_plot}>Shap 플롯 로드</Button>
        <Switch
          style={{ width: 150 }}
          onClick={handleThreToggle}
          checkedChildren="Show Threshold"
          unCheckedChildren="Hide Threshold"
          defaultChecked
        />
        <Switch
          style={{ width: 150 }}
          onClick={handleScoreToggle}
          checkedChildren="Show AnomalyScore"
          unCheckedChildren="Hide AnomalyScore"
          defaultChecked
        />
      </Space>
    </Box>
  )
}

export default AdvancedChart
