import { Row } from 'antd'
import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function LineChart(props: any) {
  const { chartData } = props
  const [data, setData] = useState<any>()

  const config = {
    displaylogo: false,
    responsive: true,
  }

  const layout: any = {
    hovermode: 'closest',
    title: 'PLS regression result',
    width: '1450',
    height: '500',
    plot_bgcolor: 'rgba(255,255,255,0)',
    // paper_bgcolor: 'lightpink',
    xaxis: {
      rangeslider: {},
    },
    yaxis: {
      fixedrange: true,
    },
  }

  useEffect(() => {
    if (chartData) setData(chartData)
  }, [chartData])

  function gaussianRand() {
    let rand = 0
    for (let i = 0; i < 6; i += 1) {
      rand += Math.random()
    }
    return rand / 6 - 0.5
  }

  return (
    <div style={{ display: 'block', width: '100%' }}>
      <Plot data={data} layout={layout} config={config} />
      {/* <Plot data={data2} layout={layout} config={config} /> */}
    </div>
  )
}

export default LineChart
