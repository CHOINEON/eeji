import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

function LineChart(props: any) {
  // const { data, layout } = props?.chartData

  const { chartData } = props
  const [data, setData] = useState<any>()
  const [layout, setLayout] = useState({
    // responsive: true,
    // useResizeHandler: true,
    // autosize: true,
  })
  const config = { displaylogo: false, responsive: true, useResizeHandler: true }
  const [width, setWidth] = useState('100%')

  useEffect(() => {
    console.log('LineChart chartData:', chartData)
  }, [chartData])

  // useEffect(() => {
  //   console.log('layout:', layout)
  // }, [layout])

  useEffect(() => {
    // if (props.chartData?.data.length > 0) {
    //   setLayout(chartData?.layout)
    //   const newTitle = {
    //     // text: chartData.layout?.title?.text || chartData.layout?.title,
    //     automargin: true,
    //     font: { color: 'black', size: 12 },
    //     x: 0.5,
    //     xanchor: 'center',
    //     y: 0.98,
    //     yanchor: 'top',
    //   }
    //   setLayout({ ...chartData.layout, title: newTitle, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' })

    //   if (chartData?.layout['title']) {
    //     chartData.layout['title'] = newTitle
    //   }

    // setData(chartData?.data.data)
    // setLayout(chartData?.layout)
    // }

    if (props?.width) {
      setWidth(props.width)
    }
  }, [props])

  return (
    <Plot style={{ width: width, height: '100%' }} config={config} data={chartData?.data} layout={chartData?.layout} />
  )
}

export default LineChart
