import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function LineChart(props: any) {
  const { chartData } = props
  const [data, setData] = useState<any>()

  // useEffect(() => console.log('chartData:', chartData), [props])
  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
  })
  const config = { displaylogo: false, responsive: true, useResizeHandler: true }

  useEffect(() => {
    if (chartData !== undefined) {
      setData(chartData.data)

      // const tempLayout = chartData.layout
      // if (tempLayout !== undefined) {
      //   if (tempLayout['title'] !== undefined) {
      //     tempLayout['title'] = {
      //       text: tempLayout['title'].text,
      //       xanchor: 'center',
      //       yanchor: 'top',
      //       x: 0.5,
      //       y: 0.9,
      //     }

      //     setLayout(tempLayout)
      //   }
      // }
    }
  }, [chartData])

  return <Plot style={{ width: '100%' }} config={config} data={data} layout={layout} />
}

export default LineChart
