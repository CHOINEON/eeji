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

import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
// //[
//   {
//     x: dataObj.data,
//     y: 0,
//     type: 'line',
//     mode: 'lines',
//     marker: { color: 'red' },
//     name: 'data',
//   },
//   {
//     x: dataObj.anomaly_pred,
//     y: 0,
//     type: 'line',
//     mode: 'lines',
//     marker: { color: 'blue' },
//     name: 'data',
//   },
//   // Additional data traces as needed
// ]
const AdvancedChart = () => {
  const [socketData, setSocketData] = useState({})
  const [chartData, setChartData] = useState([])
  // const [anomaly_pred, setAnomalyPred] = useState([])
  // const [thr, setThr] = useState([])
  const [isAnomaly, setIsAnomaly] = useState([])
  // const [model, setModel] = useState([])
  // const [dataName, setDataName] = useState([])
  // const [chartDataArray, setChartDataArray] = useState([])
  const [dataArr, setDataArr] = useState([])
  const [index, setIndex] = useState([])

  useEffect(() => {
    console.log('socketData:', socketData)

    //socketData안의 값들 state로 관리
    setChartData(socketData.data)
    setIndex([...index, socketData.index])
    setIsAnomaly([...isAnomaly, socketData.is_anormaly])

    // setIndex(socketData.index)
    // setAnomalyPred(socketData.anomaly_pred)
    // setThr(socketData.thr)
    // setModel(socketData.model)
    // setDataName(socketData.dataname)
    // setIsAnomaly(socketData.is_anormaly)
    // var objarray = [socketData.data]
    // console.log(objarray)
  }, [socketData])

  useEffect(() => {
    console.log('chartData:', chartData)
    setDataArr((prev) => [chartData, ...prev])
  }, [chartData])

  useEffect(() => {
    console.log('dataArr:::::', dataArr)

    console.log(isAnomaly)
  }, [dataArr])

  useEffect(() => {
    console.log('mounted')
    const ws = new WebSocket('ws://172.30.1.65:8000/ws/web')

    ws.onopen = () => {
      console.log('WebSocket connection opened')
    }

    ws.onmessage = (message) => {
      const dataString = message.data.trim()
      console.log('dataString::', dataString)

      try {
        const dataObj = JSON.parse(dataString)
        console.log('data obj:', dataObj)
        setSocketData(dataObj)
      } catch (error) {
        console.error('JSON parsing error:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }
    return () => {
      ws.close()
    }
  }, [])

  // const colors = isAnomaly.map(() => {
  //   if (isAnomaly == 1) {
  //     return 'black'
  //   } else return 'pink'
  // })

  const testdata = [
    {
      x: index,
      y: dataArr,
      type: 'line',
      mode: 'lines',
      name: 'data',
      // marker: isAnomaly === false ? { color: 'red' } : { color: 'blue' },
    },
    // {
    //   x: index,
    //   y: dataArr,
    //   type: 'dot',
    //   mode: 'markers',
    //   // marker: isAnomaly === false ? { color: 'red' } : { color: 'blue' },
    //   marker: { color: colors, size: 8 },
    //   name: 'is_anomaly',
    // },
  ]

  const layout = {
    title: 'Line and Scatter Plot',
    xaxis: {
      title: 'Index',
    },
    yaxis: {
      title: 'Data',
    },
    width: 1400,
    height: 350,
    // Additional layout configurations
  }

  return (
    <div>
      <h2>WebSocket Line Chart Example</h2>
      <Plot data={testdata} layout={layout} />
    </div>
  )
}

export default AdvancedChart
