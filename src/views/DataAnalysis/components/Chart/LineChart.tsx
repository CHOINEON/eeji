import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function LineChart(props: any) {
  const { chartData } = props
  const [data, setData] = useState<any>()

  const config = {
    displaylogo: false,
    responsive: true,
  }

  const updatemenus = [
    {
      buttons: [
        {
          args: [{ 'contours.showlines': false, type: 'contour' }],
          label: 'Hide lines',
          method: 'restyle',
        },
        {
          args: [{ 'contours.showlines': true, type: 'contour' }],
          label: 'Show lines',
          method: 'restyle',
        },
      ],
      direction: 'down',
      pad: { r: 10, t: 10 },
      showactive: true,
      type: 'dropdown',
      x: 0.78,
      xanchor: 'left',
      // y: button_layer_2_height,
      yanchor: 'auto',
    },
  ]
  const layout: any = {
    hovermode: 'closest',
    title: 'PLS regression result',
    // width: '1450',
    // height: '500',
    plot_bgcolor: 'rgba(255,255,255,0)',
    // paper_bgcolor: 'lightpink',
    xaxis: {
      rangeslider: {},
    },
    yaxis: {
      fixedrange: true,
    },
    // updatemenus: updatemenus,
  }

  useEffect(() => {
    if (chartData) {
      // console.log(chartData)
      // setData(chartData)

      const newArray = []
      for (let i = 0; i < chartData.length; i++) {
        if (chartData[i].name === 'Predict') {
          const newObj = {
            mode: 'lines',
            // marker: { size: 2 },
            name: chartData[i].name,
            type: chartData[i].type,
            line: { color: chartData[i].line.color, dash: 'dot', width: 3 },
            x: chartData[i].x,
            y: chartData[i].y,
          }
          newArray.push(newObj)
        } else {
          const newObj = {
            mode: 'lines',
            // marker: { size: 2 },
            name: chartData[i].name,
            type: chartData[i].type,
            line: { color: 'rgb(255,127,14)', dash: 'dot', width: 3 },
            x: chartData[i].x,
            y: chartData[i].y,
          }
          newArray.push(newObj)
        }
      }
      // console.log('newArray:', newArray)
      setData(newArray)
    }
  }, [chartData])

  function gaussianRand() {
    let rand = 0
    for (let i = 0; i < 6; i += 1) {
      rand += Math.random()
    }
    return rand / 6 - 0.5
  }

  return (
    <div id="plotlydiv" style={{ display: 'block', width: '100%', height: '360px' }}>
      <Plot
        data={data}
        layout={layout}
        config={config}
        useResizeHandler={true}
        style={{ width: '100%', height: '340px' }}
      />
      {/* <Plot data={data2} layout={layout} config={config} /> */}
    </div>
  )
}

export default LineChart
