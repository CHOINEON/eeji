import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, Chart as ChartJS, ChartOptions, Legend } from 'chart.js'
import { colorsForStackedBarChart } from 'views/AIModelGenerator/components/Chart/colors'

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

interface IDataset {
  label: string
  data: Array<any>
  backgroundColor: string
}

const HorizontalStackedBarChart = ({ value, weight, columns }: any) => {
  // const [data, setData] = useState<ChartData<'bar'>>({
  //   labels: [''],
  //   datasets: [
  //     { label: 'a', data: [0], backgroundColor: '#4169e1' },
  //     { label: 'b', data: [0], backgroundColor: '#87ceeb' },
  //     { label: 'c', data: [0], backgroundColor: '#b0e0e6' },
  //   ],
  // })

  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    datasets: [],
  })

  useEffect(() => {
    // console.log('weight:', weight)
    // console.log('localValue:', localValue)

    const newArr: Array<IDataset> = []

    //datasets 안에 들어갈 내용
    columns.forEach((col: Array<any>, i: number) => {
      if (i < 10) {
        newArr.push({ label: columns[i], data: [weight[i]], backgroundColor: colorsForStackedBarChart[i] })
      }
    })
    // console.log('newArr:', newArr)
    setChartData({
      labels: [''],
      datasets: newArr,
    })
  }, [])

  // const data = {
  //   labels: [''],
  //   datasets: [
  //     { label: 'a', data: [42], backgroundColor: '#4169e1' },
  //     { label: 'b', data: [83], backgroundColor: '#87ceeb' },
  //     { label: 'c', data: [31], backgroundColor: '#b0e0e6' },
  //   ],
  // }

  return <Bar options={options} data={chartData} height={50} />
}

export default HorizontalStackedBarChart
