import { Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const TestChart = () => {
  const [data, setData] = useState([])
  const [selectedOption, setSelectedOption] = useState('brent')
  const options = [
    { value: 'brent', label: 'Brent' },
    { value: 'wti', label: 'WTI' },
  ]
  //chart
  const config = { responsive: true, useResizeHandler: true }
  const [chartData, setChartData] = useState([])
  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })

  useEffect(() => {
    fetchChartData()
  }, [])

  useEffect(() => {
    if (data) formatChartData(data)
  }, [data, selectedOption])

  const setVerticalLineOnChart = (datetime: any) => {
    const newLayout = {
      title: 'Oil Price Forecasting',
      font: {
        // family: 'sans-serif',
        // size: 14,
        // color: '#7f7f7f',
      },
      showlegent: true,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
      shapes: [
        {
          type: 'line',
          x0: datetime.toString(),
          y0: 0,
          x1: datetime.toString(),
          y1: 600,
          line: {
            color: 'darkgrey',
            width: 1,
            dash: 'dash',
          },
        },
      ],
      annotations: [
        {
          xref: 'paper',
          yref: 'paper',
          x: 0,
          xanchor: 'right',
          y: 1.1,
          yanchor: 'bottom',
          text: '($/b)',
          showarrow: false,
        },
      ],
    }
    setLayout(newLayout)
  }

  const fetchChartData = () => {
    const param = {
      user_id: localStorage.getItem('userId'),
    }

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/oil_predict', param)
      .then((response) => {
        console.log('response', response.data)

        const respData = response.data
        setData(respData)

        //실제 값과 예측값 시점 분기하는 세로 줄
        const lastDayOfHistoryData = respData[selectedOption].index_hist.slice(-1)
        setVerticalLineOnChart(lastDayOfHistoryData)
      })
      .catch((error) => console.log('error:', error))
  }

  const formatChartData = (data: any) => {
    if (data[selectedOption]) {
      //실제 원유값(과거~현재)
      const realPrice = {
        name: `${selectedOption} Price`,
        x: data[selectedOption].index_hist,
        y: data[selectedOption].gt_hist,
        mode: 'lines',
        connectgaps: true,
        line: {
          color: '#003953',
        },
      }

      const pred_hist = {
        name: `${selectedOption} price forecast`,
        x: data[selectedOption].index_hist,
        y: data[selectedOption].pred_hist,
        mode: 'lines',
        line: {
          color: '#2397d2',
        },
        connectgaps: true,
      }

      //원본 데이터에서 마지막 날짜가 몇번째 데이터인지 찾아서 예측 점선의 첫번째에 넣으려고 사전작업
      //(json parsing하면서 순서 섞이는 경우 있음)
      const dateArr: Array<any> = pred_hist.x
      dateArr.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime()
      })

      //pred_hist의 마지막 값을 미래 예측값 배열의 첫번째에 넣어서 이어진것처럼 보이게
      const index = data[selectedOption].index_hist.indexOf(dateArr[0])
      const first_prediction = { x: dateArr[0], y: data[selectedOption].pred_hist[index] }

      const predict_x = data[selectedOption].index_pred
      const predict_y = data[selectedOption].predict

      predict_x.unshift(first_prediction.x), predict_y.unshift(first_prediction.y)

      const prediction = {
        name: 'prediction',
        x: predict_x,
        y: predict_y,
        mode: 'lines',
        connectgaps: true,
        line: {
          color: '#2397d2',
          dash: 'dot',
          // color:
        },
      }
      // console.log('prediction:', prediction)
      setChartData([realPrice, pred_hist, prediction])
    }
  }

  const handleSelect = (param: any) => {
    setSelectedOption(param)
  }

  return (
    <>
      <div style={{ width: '200px' }}>
        <Select
          style={{ width: 120, backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
          defaultValue={options[0]}
          options={options}
          onSelect={handleSelect}
        />
      </div>
      <Plot style={{ width: '100%' }} config={config} data={chartData} layout={layout} />
    </>
  )
}

export default TestChart
