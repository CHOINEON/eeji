import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, Chart as ChartJS, ChartOptions, Legend } from 'chart.js'

ChartJS.register(Legend)

// interface BarProps {
//   options: ChartOptions<'bar'>;
//   data: ChartData<'bar'>;
// }

const options: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  responsive: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: { stacked: true, display: false },
    y: { stacked: true, display: false },
    // yAxes: [
    //   {
    //     ticks: {
    //       display: false,
    //     },
    //   },
    // ],
  },
}

const HorizontalStackedBarChart = (props: any) => {
  const [data, setData] = useState<ChartData<'bar'>>({
    labels: [''],
    datasets: [
      { label: 'a', data: [0], backgroundColor: '#4169e1' },
      { label: 'b', data: [0], backgroundColor: '#87ceeb' },
      { label: 'c', data: [0], backgroundColor: '#b0e0e6' },
    ],
  })

  useEffect(() => {
    console.log('props:', props)

    setData({
      labels: [''],
      datasets: [
        { label: 'a', data: [props.data.age], backgroundColor: '#4169e1' },
        { label: 'b', data: [props.data.weight], backgroundColor: '#87ceeb' },
        { label: 'c', data: [props.data.smoke], backgroundColor: '#b0e0e6' },
      ],
    })
  }, [props])

  // const data = {
  //   labels: [''],
  //   datasets: [
  //     { label: 'a', data: [42], backgroundColor: '#4169e1' },
  //     { label: 'b', data: [83], backgroundColor: '#87ceeb' },
  //     { label: 'c', data: [31], backgroundColor: '#b0e0e6' },
  //   ],
  // }

  return <Bar options={options} data={data} height={50} />
}

export default HorizontalStackedBarChart
