import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

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

  useEffect(() => {
    setLayout(chartData.layout)

    if (chartData) {
      const newTitle = {
        text: chartData.layout?.title?.text,
        automargin: true,
        font: { color: 'black', size: 12 },
        x: 0.5,
        xanchor: 'center',
        y: 0.98,
        yanchor: 'top',
      }
      setLayout({ ...layout, title: newTitle })

      // if (chartData.layout['title']) {
      //   chartData.layout['title'] = newTitle
      //   console.log('after:', chartData.layout)
      // }

      setData(chartData.data)
    }

    if (props.width) {
      setWidth(props.width)
    }
  }, [chartData])

  return <Plot style={{ width: width }} config={config} data={data} layout={layout} />
}

export default LineChart
