import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { Chart, ArcElement, CategoryScale, LinearScale, registerables, Tooltip } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import { chartColors, colorsForDoughnut } from './components/Chart/colors'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ArcElement, CategoryScale, LinearScale, ChartDataLabels, zoomPlugin, Tooltip, ...registerables)

const FeatureImportance = ({ data, colors }: any) => {
  const [colorChips, setColorChips] = useState([])

  useEffect(() => {
    if (colors) {
      const colorOrder = data?.labels?.map((el: string) => data?.all_input_x?.indexOf(el))

      const newColor: Array<any> = []
      colorOrder?.map((el: number) => {
        if (el === -1) newColor.push('#9E9E9E')
        else newColor.push(colors[el])
      })
      setColorChips(newColor)
    } else {
      setColorChips(chartColors.slice(0, data?.labels?.length))
    }
  }, [data])

  const doughnutData = {
    labels: data?.labels,
    datasets: [
      {
        label: '',
        data: data?.values?.map((val: any) => (val * 100).toFixed(1)),
        backgroundColor: colorChips,
        borderColor: data?.labels?.map(() => '#F6F8FF'),
        borderWidth: 3,
      },
    ],
  }

  const barData = {
    labels: data?.labels,
    datasets: [
      {
        label: '',
        data: data?.values?.map((val: any) => (val * 100).toFixed(1)),
        backgroundColor: colorChips,
        barThickness: 18,
        borderColor: data?.labels?.map(() => '#F6F8FF'),
      },
    ],
  }

  const footer = (tooptipItems: any) => {
    return tooptipItems + '%'
  }

  ///bar
  const barOptions = {
    maintainAspectRatio: false, //to obey the custom size
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'TOP 3 Features',
      },
    },
    scales: {
      // to remove the labels
      x: {
        ticks: {
          display: false,
        },

        // to remove the x-axis grid
        grid: {
          drawBorder: true,
          display: false,
        },
      },
      // to remove the y-axis labels
      y: {
        ticks: {
          display: true,
          beginAtZero: true,
        },
        // to remove the y-axis grid
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      //왜 안되냐고....
      datalabels: {
        display: false,
        backgroundColor: '#ccc',
        borderRadius: 3,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'TOP 3 Features',
      },
    },
    // pointLabels: {
    //   fontSize: 20,
    //   fontColor: 'ff0000',
    // },
  }

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <div className="inline-block float-left" style={{ marginLeft: '20px', width: '59%', height: '200px !important' }}>
        <Bar data={barData} options={barOptions} width={'100%'} height={'200px'} />
      </div>

      <div className="inline-block float-left" style={{ width: '30%', marginTop: '20px' }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  )
}

export default FeatureImportance

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
