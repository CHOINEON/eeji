import { Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const TestChart = () => {
  const [data, setData] = useState([])
  const [verticalLineTime, setVerticalLineTime] = useState([])
  const [ObservedTempData, setObservedTempData] = useState([])
  const [selectedOption, setSelectedOption] = useState()

  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })
  const config = { responsive: true, useResizeHandler: true }
  const options = [
    { value: 'brent', label: 'brent' },
    { value: 'wti', label: 'wti' },
  ]

  const [predObj, setPredObj] = useState({ index_pred: '', predict: '' })
  const [histObj, setHistObj] = useState({ index_hist: '', pred_hist: '' })
  const [gtObj, setGtObj] = useState({ index_hist: '', gt_hist: '' })

  // const predict_obj = { index_pred: '', predict: '' }
  // const hist_obj = { index_hist: '', pred_hist: '' }
  // const gt_obj = { index_hist: '', gt_hist: '' }

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
    const user_id = localStorage.getItem('userId')
    const param = {
      user_id: user_id,
    }

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/oil_predict', param)
      .then((response) => {
        console.log('/api/oil_predict response', response)
        const respData = response.data
        // formatChartData(respData)
        //gt_hist, index_hist, index_pred, predict_hist, predict
        if (selectedOption === 'wti') {
          //response.data.wti
          const predict_obj = { index_pred: '', predict: '' }
          const hist_obj = { index_hist: '', pred_hist: '' }
          const gt_obj = { index_hist: '', gt_hist: '' }
        }

        //세로 줄
        // const arr = respData.predicted_time_points[0]
        // setVerticalLineTime(respData.observed_time_points.slice(-1)[0])
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

  const handleChange = (param: any) => {
    // console.log('param:', param)
    setSelectedOption(param)
  }

  return (
    <>
      <div style={{ width: '200px' }}>
        <Select defaultValue={options[0]} style={{ width: 120 }} options={options} onChange={handleChange} />
      </div>
      <Plot style={{ width: '100%' }} config={config} data={data} layout={layout} />
    </>
  )
}

export default TestChart
