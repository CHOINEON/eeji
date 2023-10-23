import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function ScatterChart(props: any) {
  const { chartData } = props
  const [data, setData] = useState<any>()
  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })
  const config = { displaylogo: false, responsive: true, useResizeHandler: true }

  useEffect(() => {
    if (chartData !== undefined && Object.keys(chartData).length !== 0) {
      console.log('ScatterChart chartData:', chartData)

      setData(chartData.data)
      setLayout(layout)
    }
  }, [chartData])

  return <Plot style={{ width: '100%' }} config={config} data={data} layout={layout} />
}

export default ScatterChart
