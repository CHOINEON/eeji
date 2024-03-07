import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
} from 'chart.js'
import { ChartData } from 'chart.js'

// type Props = {
//   data: number[][]
// }

// const LineChart: React.FC<Props> = ({ data }) => {
//   const chartData = {
//     labels: Array.from({ length: data[0].length }, (_, i) => i.toString()),
//     datasets: data.map((dataset, index) => ({
//       label: `Dataset ${index + 1}`,
//       data: dataset,
//       fill: false,
//       borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
//     })),
//   }
//   return (
//     <div style={{ width: '100%', height: '500px' }}>
//       <Line data={chartData} />
//     </div>
//   )
// }

// export default LineChart

function PDP_LineChart(props: any) {
  const { chartData } = props
  // const [chartData, setChartData] = useState<ChartData<'bar'>>({ datasets: [] })
  const [data, setData] = useState<any>()
  const [layout, setLayout] = useState({
    responsive: true,
    useResizeHandler: true,
    autosize: true,
    yaxis: {
      dtick: 0.1,
    },
  })

  const config = { displaylogo: false, responsive: true, useResizeHandler: true }
  const [width, setWidth] = useState('100%')

  useEffect(() => {
    console.log('LineChart chartData:', chartData)
  }, [chartData])

  //   const plotData: any[] = [
  //     {
  //       x: [0, 2, 4, 6, 8],
  //       y: chartData[0][0],
  //     },

  //     {
  //       x: [0, 2, 4, 6, 8],
  //       y: chartData[0][1],
  //     },
  //     {
  //       x: [0, 2, 4, 6, 8],
  //       y: chartData[0][2],
  //     },
  //     {
  //       x: [0, 2, 4, 6, 8],
  //       y: chartData[0][3],
  //     },
  //   ]

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

  //   return <Plot style={{ width: width, height: '100%' }} config={config} data={chartData} layout={layout} />
  return <Line data={chartData} />
}

export default PDP_LineChart
