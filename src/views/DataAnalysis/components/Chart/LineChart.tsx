import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function LineChart(props: any) {
  // const { data, layout } = props?.chartData

  const { chartData } = props
  const [data, setData] = useState<any>()
  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })
  const config = { displaylogo: false, responsive: true, useResizeHandler: true }

  useEffect(() => {
    if (chartData) {
      // console.log('LineChart chartData:', chartData)
      setData(chartData.data)
      setLayout(chartData.layout)
    }
  }, [chartData])

  return <Plot style={{ width: '100%' }} config={config} data={data} layout={layout} />
}

export default LineChart
