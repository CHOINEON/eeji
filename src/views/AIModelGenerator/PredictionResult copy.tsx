import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
// import LineChart from './components/Chart/LineChart'
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
import zoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'react-chartjs-2'
import { analysisResponseAtom } from './store/response/atoms'
import { useRecoilValue } from 'recoil'
import { selectedDataState } from './store/dataset/atom'
import { chartColors } from './components/Chart/colors'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, zoomPlugin, Title, Tooltip, Legend)

//https://itwithruilan.tistory.com/77 커스텀
const PredictionResult = ({ data }: any) => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const selectedData = useRecoilValue(selectedDataState)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    // console.log('analysisResponse:', analysisResponse)
    const arr: Array<any> = []

    //TODO: 일단 Classification 은 50개만 보여주게 slice 처리함
    if (selectedData.isClassification === 1) {
      analysisResponse.map((_d: any, i: number) => {
        if (i === 0) {
          arr.push(generateSeries(`Truth`, analysisResponse[i]['pred_data']['truth'].slice(0, 30), 'rgb(87,220,49)'))
          arr.push(generateSeries(`INEEJI pred`, analysisResponse[i]['pred_data']['pred'].slice(0, 30), '#4A40F7'))
        } else {
          arr.push(
            generateSeries(`Prediction${i}`, analysisResponse[i]['pred_data']['pred'].slice(0, 30), chartColors[i])
          )
        }
      })
    } else {
      analysisResponse.map((_d: any, i: number) => {
        if (i === 0) {
          arr.push(generateSeries(`Truth`, analysisResponse[i]['pred_data']['truth'], 'rgb(87,220,49)'))
          arr.push(generateSeries(`INEEJI pred`, analysisResponse[i]['pred_data']['pred'], '#4A40F7'))
        } else {
          arr.push(generateSeries(`Prediction${i}`, analysisResponse[i]['pred_data']['pred'], chartColors[i]))
        }
      })
    }

    setDataset(arr)
  }, [analysisResponse])

  const generateSeries = (label: string, dataArr: any, color: string) => {
    return {
      key: color,
      type: 'line' as const,
      label: label === 'truth' ? `${label} (${selectedData.targetY})` : label,
      borderColor: color,
      backgroundColor:
        selectedData.isClassification == 0 && label === 'INEEJI pred'
          ? (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, 'rgba(69,58,246,1)')
              gradient.addColorStop(1, 'rgba(69,58,246,0)')
              return gradient
            }
          : 'rgba(255,10,13,0)',
      borderWidth: label === 'truth' ? 1 : 1,
      fill: label === 'INEEJI pred' ? true : false,
      data: dataArr,
      pointRadius: label === 'INEEJI pred' ? 2 : 5,
    }
  }

  useEffect(() => {
    console.log('dataset:', dataset)
  }, [dataset])

  const chartData = {
    labels: selectedData.isClassification == 1 ? [0, 1] : new Array(100).fill(undefined).map((value, i) => i),
    // datasets: selectedData.isClassification == 1 ? dataset.slice(0, 50) : dataset,
    datasets: dataset,
  }

  const options = {
    radius: 2,
    layout: {
      padding: 20,
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      htmlLegend: {
        // ID of the container to put the legend in
        containerID: 'legend-container',
      },
      legend: {
        display: true,
      },
      title: {
        display: false,
        text: '',
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  // useEffect(() => {
  //   // console.log('PredictionResult data:', data)
  //   // setChartData(tempData)
  // }, [data])

  const getOrCreateLegendList = (chart: any, id: any) => {
    const legendContainer = document.getElementById(id)
    console.log('legendContainer:', legendContainer)
    let listContainer = legendContainer.querySelector('ul')

    if (!listContainer) {
      listContainer = document.createElement('ul')
      listContainer.style.display = 'flex'
      listContainer.style.flexDirection = 'row'
      // listContainer.style.margin = 0;
      // listContainer.style.padding = 0;

      legendContainer.appendChild(listContainer)
    }

    return listContainer
  }

  // const htmlLegendPlugin = {
  //   id: 'htmlLegend',
  //   afterUpdate(chart: any, args: any, options: any) {
  //     console.log('options.containerID:', options.containerID)
  //     const ul = getOrCreateLegendList(chart, options.containerID)
  //     console.log('ul:', ul)
  //     // Remove old legend items
  //     while (ul.firstChild) {
  //       ul.firstChild.remove()
  //     }

  //     // Reuse the built-in legendItems generator
  //     // const items = chart.options.plugins.legend.labels.generateLabels(chart)

  //     // items.forEach((item: any) => {
  //     //   const li = document.createElement('li')
  //     //   li.style.alignItems = 'center'
  //     //   li.style.cursor = 'pointer'
  //     //   li.style.display = 'flex'
  //     //   li.style.flexDirection = 'row'
  //     //   li.style.marginLeft = '10px'

  //     //   li.onclick = () => {
  //     //     const { type } = chart.config
  //     //     if (type === 'pie' || type === 'doughnut') {
  //     //       // Pie and doughnut charts only have a single dataset and visibility is per item
  //     //       chart.toggleDataVisibility(item.index)
  //     //     } else {
  //     //       chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
  //     //     }
  //     //     chart.update()
  //     //   }

  //     //   // Color box
  //     //   const boxSpan = document.createElement('span')
  //     //   boxSpan.style.background = item.fillStyle
  //     //   boxSpan.style.borderColor = item.strokeStyle
  //     //   boxSpan.style.borderWidth = item.lineWidth + 'px'
  //     //   boxSpan.style.display = 'inline-block'
  //     //   // boxSpan.style.flexShrink = 0
  //     //   boxSpan.style.height = '20px'
  //     //   boxSpan.style.marginRight = '10px'
  //     //   boxSpan.style.width = '20px'

  //     //   // Text
  //     //   const textContainer = document.createElement('p')
  //     //   textContainer.style.color = item.fontColor
  //     //   // textContainer.style.margin = 0
  //     //   // textContainer.style.padding = 0
  //     //   textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

  //     //   const text = document.createTextNode(item.text)
  //     //   textContainer.appendChild(text)

  //     //   li.appendChild(boxSpan)
  //     //   li.appendChild(textContainer)
  //     //   ul.appendChild(li)
  //     // })
  //   },
  // }

  return (
    <>
      <ChartWrapper isClassification={selectedData.isClassification}>
        <Line options={options} data={chartData} />
      </ChartWrapper>
    </>
  )
}

export default PredictionResult

const ChartWrapper = styled.div<{ isClassification: number }>`
  // display: ${(props: any) => (props.toggle ? 'block' : 'none')};
  border: 1px solid pink;
  width: ${(props: any) => (props.isClassification === 1 ? '200px' : '100%')};
  height: ${(props: any) => (props.isClassification === 1 ? '600px' : '100%')};
  position: relative;
  float: left;
  margin: 10px;
`
