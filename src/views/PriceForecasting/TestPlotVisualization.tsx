import { Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const TestChart = () => {
  const [data, setData] = useState([])
  const [verticalLineTime, setVerticalLineTime] = useState([])
  const [ObservedTempData, setObservedTempData] = useState([])

  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })
  const config = { responsive: true, useResizeHandler: true }

  useEffect(() => {
    fetchChartData()
  }, [])

  useEffect(() => {
    const newLayout = {
      title: 'Price Forecasting',
      showlegent: true,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
      shapes: [
        {
          type: 'line',
          x0: verticalLineTime,
          y0: 0,
          x1: verticalLineTime,
          y1: 250,
          line: {
            color: 'grey',
            width: 3,
            dash: 'dot',
          },
        },
      ],
    }
    setLayout(newLayout)
  }, [verticalLineTime])

  const fetchChartData = () => {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/index_predict')
      .then((response) => {
        console.log('response', response)
        const respData = response.data
        formatChartData(respData)

        //세로 줄
        const arr = respData.predicted_time_points[0]

        setVerticalLineTime(respData.observed_time_points.slice(-1)[0])
      })
      .catch((error) => console.log('error:', error))
  }

  const formatChartData = (data: any) => {
    const trace1 = {
      name: 'observed_data',
      x: data.observed_time_points,
      y: data.observed_data_values,
      mode: 'lines',
      connectgaps: true,
    }
    const trace2 = {
      name: 'predicted_data',
      x: data.predicted_time_points,
      y: data.predicted_data_values,
      mode: 'lines',
      connectgaps: true,
    }

    const trace3 = {
      name: 'observed_data - 10',
      x: [...data.predicted_time_points, ...data.predicted_time_points.reverse()],
      y: [...data.predicted_data_values.map((x: any) => x - 10), ...data.predicted_data_values.map((x: any) => x + 10)], // observed_data_values에서 -10 한 데이터 series로 만들기
      mode: 'lines',
      connectgaps: true,
      showlegend: false,
      fill: 'tozeroy',
      fillcolor: 'rgba(255,170,102,0.2)',
      line: { color: 'transparent' },
    }

    // console.log('trace3:', trace3)
    setData([trace1, trace2])
    //
  }

  const generateChartData = (...props: any) => {
    console.log('props:', props)
    //
  }

  return (
    <>
      <div style={{ width: '200px' }}>
        <Select defaultValue="Sample" style={{ width: 120 }} options={[{ value: 'sample', label: 'Sample Price' }]} />
      </div>
      <Plot style={{ width: '100%' }} config={config} data={data} layout={layout} />
    </>
  )
}

export default TestChart
