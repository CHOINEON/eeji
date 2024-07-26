import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useRecoilValue } from 'recoil'
import { styled } from 'styled-components'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import FeatureAnalysis from '../Features/FeatureAnalysis'

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  zoomPlugin,
  Title,
  Tooltip,
  Legend
)

const RegressionResult = () => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const selectedModel = useRecoilValue(selectedModelAtom)
  const [dataset, setDataset] = useState([])

  useEffect(() => {
    const arr: Array<any> = []

    analysisResponse.map((_d: any, i: number) => {
      if (i === 0) {
        arr.push(generateSeries(`Ground-truth`, analysisResponse[i]['pred_data']['truth'], 'rgb(87,220,49)'))
        arr.push(generateSeries(`INEEJI prediction`, analysisResponse[i]['pred_data']['pred'], '#4A40F7'))
      } else {
        arr.push(generateSeries(`Prediction${i}`, analysisResponse[i]['pred_data']['pred'], colorChips[i]))
      }
    })

    setDataset(arr)
  }, [analysisResponse])

  const generateSeries = (label: string, dataArr: any, color: string) => {
    return {
      key: color,
      type: 'line' as const,
      label: label === 'truth' ? `${label} (${selectedModel.target})` : label,
      borderColor: color,
      backgroundColor:
        label === 'INEEJI prediction'
          ? (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, 'rgba(69,58,246,1)')
              gradient.addColorStop(1, 'rgba(69,58,246,0)')
              return gradient
            }
          : color,
      borderWidth: label === 'truth' ? 1 : 1,
      fill: label === 'INEEJI prediction' ? true : false,
      data: dataArr,
    }
  }

  const chartData = {
    labels: selectedModel?.is_classification
      ? [0, 1]
      : Array(analysisResponse[0]['pred_data']['pred'].length)
          .fill(null)
          .map((value, i) => i),
    // datasets: selectedData.isClassification == 1 ? dataset.slice(0, 50) : dataset,
    datasets: dataset,
  }

  const footer = (tooltipItems: any) => {
    let tooltipText

    tooltipItems.forEach(function (tooltipItem: any) {
      tooltipText = tooltipItem.raw.z
    })

    return 'Label Name : ' + tooltipText
  }

  const options = {
    radius: 2,
    layout: {
      padding: 20,
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
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  const optionsForClassification = {
    radius: 2,
    layout: {
      padding: 20,
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
          // forces step size to be 50 units
          stepSize: 1,
          padding: 10,
        },
      },
    },
  }

  const getOrCreateLegendList = (chart: any, id: any) => {
    const legendContainer = document.getElementById(id)
    let listContainer = legendContainer.querySelector('ul')

    if (!listContainer) {
      listContainer = document.createElement('ul')
      listContainer.style.display = 'flex'
      listContainer.style.flexDirection = 'row'
      listContainer.style.justifyContent = 'right'
      listContainer.style.margin = '15px'

      legendContainer.appendChild(listContainer)
    }

    return listContainer
  }

  const htmlLegendPlugin: any = {
    id: 'htmlLegend',
    afterUpdate(chart: any, args: any, options: any) {
      const ul = getOrCreateLegendList(chart, options.containerID)

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove()
      }

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart)

      items.forEach((item: any) => {
        const li = document.createElement('li')
        li.style.alignItems = 'center'
        li.style.cursor = 'pointer'
        li.style.display = 'flex'
        li.style.flexDirection = 'row'
        li.style.marginLeft = '40px'

        li.onclick = () => {
          const { type } = chart.config
          if (type === 'pie' || type === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index)
          } else {
            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
          }
          chart.update()
        }

        // Color box
        const boxSpan = document.createElement('span')
        boxSpan.style.background = item.fillStyle
        boxSpan.style.borderColor = item.strokeStyle
        boxSpan.style.borderWidth = item.lineWidth + 'px'
        boxSpan.style.display = 'inline-block'
        boxSpan.style.marginRight = '10px'
        boxSpan.style.borderRadius = '20px'
        // boxSpan.style.flexShrink = 0

        if (selectedModel.is_classification) {
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
        textContainer.style.color = item.fontColor
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
    <>
      <div
        style={{
          width: '68%',
          padding: '5px 30px',
          display: 'block',
          float: 'left',
        }}
      >
        <ChartWrapper /**isClassification={selectedData.isClassification} */>
          <div id="legend-container"></div>
          <Line
            options={selectedModel.is_classification ? optionsForClassification : options}
            data={chartData}
            plugins={[htmlLegendPlugin]}
          />
        </ChartWrapper>
      </div>
      <div style={{ width: '30%', marginBottom: '25px', display: 'inline-block', float: 'left' }}>
        <FeatureAnalysis textVisible={true} />
      </div>
    </>
  )
}

export default RegressionResult

const ChartWrapper = styled.div`
  // border: 1px solid pink;
  width: 100%;
  height: 600px;
  position: relative;
  float: left;
  margin: 0 10px;
`
