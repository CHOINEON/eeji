/* eslint-disable prettier/prettier */
import { Box } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Switch, Space } from 'antd'

const AdvancedChart = () => {
  //새로운 주소로 바뀔 예정
  const originURL = 'ws://222.121.66.49:8000/ws/web'

  /* managing the states of incoming data */
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  const [index, setIndex] = useState([])
  // const [isAnomaly, setIsAnomaly] = useState([])

  const [dataArr, setDataArr] = useState([])
  const [testData, setTestData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])
  // const [isAnomalyArr, setIsAnomalyArr] = useState([])


  useEffect(() => {
    if (socketData.data) {
      setChartData(socketData.data)

      setDataArr((prev) => {
        return [...prev, socketData.data]
      })
      setIndex((prev) => {
        return [...prev, socketData.index]
      })
      setAnomalyScoreArr((prev) => {
        return [...prev, socketData.anomaly_pred]
      })
      setThresholdArr((prev)=> {
        return [...prev, socketData.thr]
      })

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
          }},
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
          visible : isVisible,
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
          visible : yesVisible,
        },
      ]
      setTestData(plotData)
    }
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

  //Toggle switch function
  const [isVisible, setIsVisible] = useState(true)
  const handleScoreToggle = () => {
    setIsVisible(!isVisible)
  }
  const [yesVisible, setYesVisible] = useState(true)
  const handleThreToggle = () => {
    setYesVisible(!yesVisible)
  }

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
    width: 1900,
    height: 800,
    margin: {
      t: 50,
      b: 80,
      l: 100,
      r: 80,
    },
    // shapes: highlightAnomaly,
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  }

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{ position: 'relative', zIndex: 1000, width: '82vw', height: '93vh' }}
    >
      <div>
        {/* <h2>WebSocket Line Chart Example</h2>  */}
        <Plot data={testData} layout={layout} useResizeHandler={true} responsive ={true} autosize={true}
style={{width: '100%', height: '100%'}}   />
      </div>
      <Space direction="vertical">
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
