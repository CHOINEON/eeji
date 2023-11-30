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
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'react-chartjs-2'
import { analysisResponseAtom } from './store/response/atoms'
import { useRecoilValue } from 'recoil'
import { selectedDataState } from './store/dataset/atom'
import { colors } from './components/Chart/colors'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, zoomPlugin, Title, Tooltip, Legend)

//https://itwithruilan.tistory.com/77 커스텀
const PredictionResult = ({ data }: any) => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const selectedData = useRecoilValue(selectedDataState)

  const [dataset, setDataset] = useState([])

  useEffect(() => {
    console.log('data:', data)
  }, [data])

  useEffect(() => {
    console.log('pred:', analysisResponse)

    const arr: Array<any> = []
    analysisResponse.map((_d: any, i: number) => {
      if (i === 0) {
        arr.push(generateSeries(`truth`, analysisResponse[i].data['prediction_data']['truth'], colors[0]))
      }
      arr.push(generateSeries(`pred${i + 1}`, analysisResponse[i].data['prediction_data']['pred'], colors[i + 1]))
    })

    console.log('arr:', arr)
    setDataset(arr)
  }, [analysisResponse])

  const generateSeries = (label: string, dataArr: any, color: string) => {
    return {
      key: color,
      type: 'line' as const,
      label: label === 'truth' ? `${label} (${selectedData.targetY})` : label,
      borderColor: color,
      backgroundColor: color,
      borderWidth: label === 'truth' ? 2 : 1,
      fill: false,
      data: dataArr,
    }
  }

  const chartData = {
    datasets: dataset,
  }

  const options = {
    layout: {
      padding: 20,
    },
    responsive: true,
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

  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart: any, args: any, options: any) {
      console.log('options.containerID:', options.containerID)
      const ul = getOrCreateLegendList(chart, options.containerID)
      console.log('ul:', ul)
      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove()
      }

      // Reuse the built-in legendItems generator
      // const items = chart.options.plugins.legend.labels.generateLabels(chart)

      // items.forEach((item: any) => {
      //   const li = document.createElement('li')
      //   li.style.alignItems = 'center'
      //   li.style.cursor = 'pointer'
      //   li.style.display = 'flex'
      //   li.style.flexDirection = 'row'
      //   li.style.marginLeft = '10px'

      //   li.onclick = () => {
      //     const { type } = chart.config
      //     if (type === 'pie' || type === 'doughnut') {
      //       // Pie and doughnut charts only have a single dataset and visibility is per item
      //       chart.toggleDataVisibility(item.index)
      //     } else {
      //       chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
      //     }
      //     chart.update()
      //   }

      //   // Color box
      //   const boxSpan = document.createElement('span')
      //   boxSpan.style.background = item.fillStyle
      //   boxSpan.style.borderColor = item.strokeStyle
      //   boxSpan.style.borderWidth = item.lineWidth + 'px'
      //   boxSpan.style.display = 'inline-block'
      //   // boxSpan.style.flexShrink = 0
      //   boxSpan.style.height = '20px'
      //   boxSpan.style.marginRight = '10px'
      //   boxSpan.style.width = '20px'

      //   // Text
      //   const textContainer = document.createElement('p')
      //   textContainer.style.color = item.fontColor
      //   // textContainer.style.margin = 0
      //   // textContainer.style.padding = 0
      //   textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

      //   const text = document.createTextNode(item.text)
      //   textContainer.appendChild(text)

      //   li.appendChild(boxSpan)
      //   li.appendChild(textContainer)
      //   ul.appendChild(li)
      // })
    },
  }

  return (
    <ComponentContainer>
      <Line options={options} data={chartData} />
    </ComponentContainer>
  )
}

export default PredictionResult

const ComponentContainer = styled.div`
  // display: ${(props: any) => (props.toggle ? 'block' : 'none')};
  // border: 1px solid pink;
  float: left;
  width: 100%;
  height: 100%;
  margin: 10px;
`
