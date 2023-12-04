import { Carousel } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { Chart, ArcElement, CategoryScale, LinearScale, registerables } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import { colors, colorsForDoughnut } from './components/Chart/colors'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectModelState } from './store/userOption/atom'
import { analysisResponseAtom } from './store/response/atoms'

Chart.register(ArcElement, CategoryScale, LinearScale, zoomPlugin, ...registerables)

const FeatureImportance = ({ data }: any) => {
  const [chartData, setChartData] = useState([])
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const [selectedModel, setSelectedModel] = useRecoilState(selectModelState)

  useEffect(() => {
    console.log('FeatureImportance data:', data)
  }, [data])

  // useEffect(() => {
  //   // console.log('selectedModel:', selectedModel)
  //   // console.log('analysisResponse:', analysisResponse)

  //   setChartData(analysisResponse[parseInt(selectedModel)]['data']['feature_piechart_data'])
  // }, [selectedModel])

  // const labels = data?.labels

  const doughnutData = {
    labels: data?.labels,
    datasets: [
      {
        label: '% of importance',
        data: data?.values,
        backgroundColor: colorsForDoughnut.slice(0, data?.labels?.length),
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
        data: data?.values?.map((val: any) => val * 100),
        barThickness: 18,
        borderColor: data?.labels?.map(() => '#F6F8FF'),
        backgroundColor: colorsForDoughnut.slice(0, data?.labels?.length),
      },
    ],
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
        display: true,
        backgroundColor: '#ccc',
        borderRadius: 3,
        font: {
          color: 'red',
          weight: 'bold',
        },
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
    <div style={{ width: '100%', height: '500px', marginTop: '1.5vw' }}>
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
