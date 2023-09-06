/* eslint-disable prettier/prettier */
// import * as d3 from 'd3';

// // Sample data: time vs temperature
// const data = [
//   { time: new Date('2023-07-01T00:00:00'), temperature: 20 },
//   { time: new Date('2023-07-02T00:00:00'), temperature: 22 },
//   { time: new Date('2023-07-03T00:00:00'), temperature: 25 },
//   // Add more data points...
// ];

// // Create SVG dimensions
// const width = 600;
// const height = 400;
// const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// // Create SVG container
// const svg = d3.select('body')
//   .append('svg')
//   .attr('width', width)
//   .attr('height', height);

// // Create scales
// const xScale = d3.scaleTime()
//   .domain(d3.extent(data, d => d.time))
//   .range([margin.left, width - margin.right]);

// const yScale = d3.scaleLinear()
//   .domain([0, d3.max(data, d => d.temperature)])
//   .nice()
//   .range([height - margin.bottom, margin.top]);

// // Create line generator
// const line = d3.line<{ time: Date; temperature: number }>()
//   .x(d => xScale(d.time))
//   .y(d => yScale(d.temperature));

// // Add line
// svg.append('path')
//   .datum(data)
//   .attr('fill', 'none')
//   .attr('stroke', 'steelblue')
//   .attr('stroke-width', 2)
//   .attr('d', line);

// // Add threshold line
// const thresholdTemperature = 24; // Example threshold value
// svg.append('line')
//   .attr('x1', margin.left)
//   .attr('x2', width - margin.right)
//   .attr('y1', yScale(thresholdTemperature))
//   .attr('y2', yScale(thresholdTemperature))
//   .attr('stroke', 'red')
//   .attr('stroke-width', 2)
//   .attr('stroke-dasharray', '4 4');

// // Add x and y axes
// svg.append('g')
//   .attr('transform', `translate(0,${height - margin.bottom})`)
//   .call(d3.axisBottom(xScale));

// svg.append('g')
//   .attr('transform', `translate(${margin.left},0)`)
//   .call(d3.axisLeft(yScale));

// // Add labels
// svg.append('text')
//   .attr('x', width / 2)
//   .attr('y', height - margin.bottom / 2)
//   .attr('text-anchor', 'middle')
//   .text('Time');

// svg.append('text')
//   .attr('transform', 'rotate(-90)')
//   .attr('x', -height / 2)
//   .attr('y', margin.left / 2)
//   .attr('text-anchor', 'middle')
//   .text('Temperature (°C)');

//   export default sampled3chart
import { Box } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Switch, Space } from 'antd'

const AdvancedChart = () => {
  /*socket url*/
  const originURL = 'ws://222.121.66.49:8000/ws/web'

  /* managing the states of incoming data */
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  // const [anomalyScore, setAnomalyScore] = useState([])
  const [threshold, setThreshold] = useState([])
  const [index, setIndex] = useState([])
  const [isAnomaly, setIsAnomaly] = useState([])

  /*accumulating updated data into an array for storage.Soon these will be used as a plotly data*/
  const [dataArr, setDataArr] = useState([])
  const [testData, setTestData] = useState([])
  const [anomalyScoreArr, setAnomalyScoreArr] = useState([])
  const [thresholdArr, setThresholdArr] = useState([])
  // const [isAnomalyArr, setIsAnomalyArr] = useState([])

  //whenever socketData comes in, keep updates

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
      setThresholdArr((prev) => {
        return [...prev, socketData.thr]
      })

      //for plotly chart
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
          // marker: isAnomaly === false ? { color: 'red' } : { color: 'blue' },
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
        },
        //   type: 'dot',
        //   mode: 'markers',
        //   // marker: isAnomaly === false ? { color: 'red' } : { color: 'blue' },
        //   marker: { color: colors, size: 8 },
        // },
      ]
      setTestData(plotData)
    }
    // setAnomalyScore(socketData.anomaly_pred)
    // setThreshold(socketData.thr)
    // setIsAnomaly(socketData.is_anormaly)
    // setIndex([...index, socketData.index])
    // setIndex(socketData.index)
  }, [socketData])

  /*store data into array by using spread operator*/
  // useEffect(() => {
  //   //  setDataArr((prev) => [ ...prev,chartData])
  //   setAnomalyScoreArr((prev) => [...prev, anomalyScore ])
  //   setThresholdArr((prev)=> [...prev,threshold])
  //   setIsAnomalyArr((prev) => [...prev,isAnomaly ])
  // }, [socketData])

  /*add timestamp to the end of the url*/
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
        // console.log('dataOjb:', dataObj)
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

  // const colors = isAnomaly.map(() => {
  //   if (isAnomaly == 1) {
  //     return 'black'
  //   } else return 'pink'
  // })

  // const showAnomaly = isAnomalyArr.map(() => {
  //   if (isAnomalyArr == true) {
  //     return index
  //   }
  //   else return
  // })

  // const highlightAnomaly = [
  //   {
  //     type: 'rect',
  //     xref: 'x',
  //     yref: 'paper',
  //     x0: 400,
  //     y0:2,
  //     x1: 100,
  //     y1: 1,

  //     fillcolor: 'red',
  //     opacity: 0.2,
  //     line: { width: 0 },
  //   },
  // {
  //   type: 'rect',
  //   xref: 'x',
  //   yref: 'paper',
  //   x1: 500,
  //   y1: 1,
  //   x0: 100,
  //   y0: 0,

  //   fillcolor: 'red',
  //   opacity: 0.2,
  //   line: { width: 0 },
  // },
  // {
  //   type: 'rect',
  //   // x-reference is assigned to the x-values
  //   xref: 'x',
  //   // y-reference is assigned to the plot paper [0,1]
  //   yref: 'paper',
  //   x0: 1800,
  //   y0: 0,
  //   x1: 2100,
  //   y1: 1,
  //   fillcolor: 'red',
  //   opacity: 0.2,
  //   line: { width: 0 },
  // },
  //]

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
    width: 1500,
    height: 800,
    margin: {
      t: 50,
      b: 80,
      l: 100,
      r: 80,
      // },
      // shapes: highlightAnomaly,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
    },
  }

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{ position: 'relative', zIndex: 1000, width: '82vw', height: '93vh' }}
    >
      <div>
        {/* <h2>WebSocket Line Chart Example</h2>  */}
        <Plot data={testData} layout={layout} />
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
