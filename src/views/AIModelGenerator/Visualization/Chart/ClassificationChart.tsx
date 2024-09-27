import styled from '@emotion/styled'
import { Chart, ChartConfiguration, LegendItem, TooltipItem } from 'chart.js'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useRecoilValue } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'

interface CustomTooltipItem {
  z: string // Specify the expected structure
}

const ClassificationChart = () => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const selectedData = useRecoilValue(selectedDataState)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    const arr: Array<unknown> = []

    //TODO: 일단 Classification 은 50개만 보여주게 slice 처리함
    analysisResponse.map((_d: unknown, i: number) => {
      if (i === 0) {
        arr.push(generateSeriesForClassification(`Ground-truth`, analysisResponse[i]['pred_data']['truth'], '#617EFF'))
        arr.push(
          generateSeriesForClassification(`INEEJI prediction`, analysisResponse[i]['pred_data']['pred'], '#000000')
        )
      } else {
        arr.push(
          generateSeriesForClassification(`Prediction${i}`, analysisResponse[i]['pred_data']['pred'], colorChips[i])
        )
      }
    })

    setDataset(arr)
  }, [analysisResponse])

  const generateSeriesForClassification = (label: string, dataArr: Array<unknown>, color: string) => {
    return {
      key: color,
      type: 'scatter' as const,
      label: label === 'truth' ? `${label} (${selectedData.targetY})` : label,
      borderColor: color,
      backgroundColor: label === 'INEEJI prediction' ? 'rgba(69, 58, 246, 0)' : color,
      borderWidth: label === 'truth' ? 1 : 1,
      fill: label === 'INEEJI prediction' ? true : false,
      data: dataArr,
      pointRadius: label === 'INEEJI prediction' ? 5 : 2,
    }
  }

  const chartData = {
    labels:
      selectedData?.isClassification == 1
        ? [0, 1]
        : Array(analysisResponse[0]['pred_data']['pred'].length)
            .fill(null)
            .map((value, i) => i),
    datasets: dataset,
  }

  const footer = (tooltipItems: Array<TooltipItem<'line'>>) => {
    let tooltipText

    tooltipItems.forEach(function (tooltipItem) {
      const raw = tooltipItem.raw as CustomTooltipItem
      tooltipText = raw.z
    })

    return 'Label Name : ' + tooltipText
  }

  const optionsForClassification = {
    radius: 2,
    layout: {
      margin: 20,
      padding: 40,
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      htmlLegend: {
        // ID of the container to put the legend in
        containerID: 'legend-container',
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: '',
      },
      tooltip: {
        usePointStyle: true,
        enabled: true,
        callbacks: {
          footer: footer,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scale: {
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        ticks: {
          stepSize: 1,
          padding: 10,
        },
      },
    },
  }

  const getOrCreateLegendList = (chart: Chart<'line'>, id: string) => {
    const legendContainer = document.getElementById(id)
    let listContainer = legendContainer.querySelector('ul')

    if (!listContainer) {
      listContainer = document.createElement('ul')
      listContainer.style.display = 'flex'
      listContainer.style.flexDirection = 'row'
      listContainer.style.justifyContent = 'right'
      listContainer.style.margin = '5px'

      legendContainer.appendChild(listContainer)
    }

    return listContainer
  }

  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart: Chart<'line'>, args: any, options: { containerID: string }) {
      const ul = getOrCreateLegendList(chart, options.containerID)

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove()
      }

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart)

      items.forEach((item: LegendItem) => {
        const li = document.createElement('li')
        li.style.alignItems = 'center'
        li.style.cursor = 'pointer'
        li.style.display = 'flex'
        li.style.flexDirection = 'row'
        li.style.marginLeft = '40px'

        li.onclick = () => {
          const chartConfig = chart.config as ChartConfiguration<any>
          // Now you can safely access 'type'
          const chartType = chartConfig.type

          if (chartType === 'pie' || chartType === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index)
          } else {
            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
          }
          chart.update()
        }

        // Color box
        const boxSpan = document.createElement('span')
        // Type check for CanvasGradient or CanvasPattern
        if (typeof item.fillStyle === 'string') {
          boxSpan.style.background = item.fillStyle // Use fillStyle if it's a string
        } else {
          // Provide a fallback color or handle CanvasGradient or CanvasPattern differently
          boxSpan.style.background = 'black' // fallback color
        }

        if (typeof item.strokeStyle === 'string') {
          boxSpan.style.borderColor = item.strokeStyle
        } else {
          boxSpan.style.borderColor = 'transparent' // Fallback or alternative handling
        }
        boxSpan.style.borderWidth = item.lineWidth + 'px'
        boxSpan.style.display = 'inline-block'
        boxSpan.style.marginRight = '10px'
        boxSpan.style.borderRadius = '20px'

        if (selectedData.isClassification === 1) {
          if (item.text === 'INEEJI prediction') {
            boxSpan.style.height = '20px'
            boxSpan.style.width = '20px'
          } else {
            boxSpan.style.height = '10px'
            boxSpan.style.width = '10px'
          }
        } else {
          boxSpan.style.height = '3px'
          boxSpan.style.width = '60px'
        }

        // Text
        const textContainer = document.createElement('p')
        textContainer.style.color = item.fontColor as string
        textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

        const text = document.createTextNode(item.text)
        textContainer.appendChild(text)

        li.appendChild(boxSpan)
        li.appendChild(textContainer)
        ul.appendChild(li)
      })
    },
  }

  return (
    <ChartWrapper>
      <div id="legend-container"></div>
      <Line options={optionsForClassification} data={chartData} plugins={[htmlLegendPlugin]} />
    </ChartWrapper>
  )
}

export default ClassificationChart

const ChartWrapper = styled.div`
  display: block;
  float: left;
  width: 100%;
  margin: 10px;
  min-width: 760px;
  height: 570px;
  position: relative;
  float: left;
`
