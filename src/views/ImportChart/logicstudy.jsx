// import { Box } from '@chakra-ui/react'
// import React, { useState, useEffect} from 'react'
// import Plot from 'react-plotly.js'

// const AdvancedChart = () => {
// const originlURL = 'ws://222.121.66.49:8000/ws/web'
// const connectNum =  5;
// var reURL = 0;
// /* 들어오는 데이터 종류별로 상태 관리 */
//   const [socketData, setSocketData] = useState({})
//   const [chartData, setChartData] = useState([])
//   const [isAnomaly, setIsAnomaly] = useState([])
// /* 상태 업데이트된 데이터 누적 저장을 위한 배열 */ 
//   const [dataArr, setDataArr] = useState([])
//   const [index, setIndex] = useState([])
// }

// useEffect(() => {
//   setChartData(socketData.data)
//     setIndex([...index, socketData.index])
//     setIsAnomaly([...isAnomaly, socketData.is_anormaly])
// /*스프레드 연산자를 사용하여 비구조화 할당*/ 
// }, [socketData])

// useEffect(() => {
// setDataArr((prev) => [chartData, ...prev])
// }, [chartData])

// useEffect(()=> {

// }, [dataArr])

// useEffect(() => {
//   for (let i = 0; i < connectNum; i++) {
//     const timestamp = Date.now()
//     var newURL = `${originURL}?timetamp=${timestamp}` 
// }
//     const ws = WebSocket(newURL)
//     ws.onopen = () => {
//         console.log('WebSocket connection `${i + 1}` opened with timestamp `${timestamp}`')
// }

//     ws.onmessage = (message) => {
//         const dataString = message.data.trim()

//         try {
//             const dataObj = JSON.parse(dataString)
//             setSocketData(dataObj)
//         } catch (error) {
//             console.error('JSON parsing error:', error)
//         }
//     }

//     ws.onclose = (event) => {
//         if (event.wasClean) {
//             console.log(`WebSocket connection closed unexpectedly`);
//         }
//         else {
//         console.log('WebSocket connection closed')}
//     }
//     return () => {
//         ws.close()
//     }
// }, [])

// const testdata = [
//     {
//         x : index,
//         y: dataArr,
//         type : 'line',
//         mode: 'lines',
//         name: 'data',
//     }
// ]
// const layout = {
//     title: 'Line and Scatter Plot',
//     xaxis: {
//         title : 'Index',
//     },
//     yaxis: {
//         title : 'Data',
//     },
//     width : 1400,
//     height: 350,
// }

// export default AdvancedChart
// var trace1 = {
//     x: [1, 2, 3],
//     y: [40, 50, 60],
//     name: 'yaxis data',
//     type: 'scatter'
// }

// var trace2 = {
//     x: [2,3,4],
//     y: [4, 5, 6],
//     name: 'yaxis2 data',
//     type : 'scatter'
// }

// var data = [trace1, trace2];

// var layout = {
//     title: 'Double Y Axis Ex',
//     yaxis: {title: 'yaxis tilte'},
//     yaxis2: {
//         title : 'yaxis2 title',
//         titlefont: {color: 'rgb()'},
//         tickfont: {color: ''},
//         overlaying: 'y',
//         side : 'right',

//     }
