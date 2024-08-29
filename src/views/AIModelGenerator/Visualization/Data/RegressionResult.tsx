import {
  BubbleDataPoint,
  CategoryScale,
  ChartConfiguration,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  Point,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { styled } from 'styled-components'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import FeatureAnalysis from '../Features/FeatureAnalysis'
import '../style.css'

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
  const [dataset, setDataset] = useState([])

  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const selectedModel = useRecoilValue(selectedModelAtom)

  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    const arr: Array<any> = []

    console.log('analysisResponse:', analysisResponse)

    analysisResponse.map((_d: any, i: number) => {
      if (i === 0) {
        arr.push(generateSeries(`Ground-truth`, analysisResponse[i]['pred_data']['truth'], 'rgb(87,220,49)'))
        arr.push(generateSeries(`INEEJI prediction`, analysisResponse[i]['pred_data']['pred'], '#4A40F7'))
      } else {
        arr.push(generateSeries(`Prediction${i}`, analysisResponse[i]['pred_data']['pred'], colorChips[i]))
      }
    })

    console.log('arr:', arr)
    setDataset(arr)

    const totalLabels = Object.keys(analysisResponse[0].row_data).length
    if (totalLabels > 1000) {
      const newWidth = 800 + (totalLabels - 1000) * (totalLabels > 100 ? totalLabels / 100 : 1)
      const containerBody = document.querySelector('.containerBody') as HTMLDivElement
      containerBody.style.width = `${newWidth > 1920 ? 1920 : newWidth}px`
    }
  }, [analysisResponse])

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy() // 기존 차트를 파괴하여 충돌 방지
    }

    const config: ChartConfiguration<'line', (number | [number, number] | Point | BubbleDataPoint)[], unknown> = {
      type: 'line',
      data: {
        labels: selectedModel?.is_classification
          ? [0, 1]
          : analysisResponse[0]['pred_data']['pred'].map((item: { x: number; y: number }) => item.x),
        datasets: dataset,
      },
      options: selectedModel.is_classification ? optionsForClassification : options,
    }

    if (chartRef.current) {
      //chartInstanceRef에 캔버스로 차트 만들어 할당
      chartInstanceRef.current = new ChartJS(chartRef.current, config)

      //차트가 있는 canvas element(chartRef)에 더블클릭 이벤트 리스너 등록
      chartRef.current.addEventListener('dblclick', () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resetZoom() // 줌 리셋
        }
      })
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy() // 컴포넌트 언마운트 시 차트를 파괴
      }
    }
  }, [dataset, selectedModel, analysisResponse])

  const generateSeries = (label: string, dataArr: any, color: string) => {
    return {
      key: color,
      type: 'line' as const,
      label: label === 'truth' ? `${label} (${selectedModel.target})` : label,
      borderColor: color,
      backgroundColor:
        label === 'INEEJI prediction'
          ? (context: any) => {
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

  const options = {
    indexAxis: 'x' as const,
    radius: 1,
    layout: {
      padding: 20,
    },
    showLine: true,
    responsive: true,
    maintainAspectRatio: false,
    animation: false as const,
    plugins: {
      datalabels: {
        display: false,
      },
      htmlLegend: {
        containerID: 'legend-container',
      },
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
      },
      title: {
        display: false,
        text: '',
      },
      zoom: {
        zoom: {
          drag: {
            enabled: true,
          },
          wheel: {
            enabled: false,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  const footer = (tooltipItems: any) => {
    let tooltipText

    tooltipItems.forEach(function (tooltipItem: any) {
      tooltipText = tooltipItem.raw.z
    })

    return 'Label Name : ' + tooltipText
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
        <ChartWrapper>
          <div id="legend-container"></div>
          <div className="container">
            <div className="containerBody">
              <canvas id="predChart" ref={chartRef}></canvas>
            </div>
          </div>
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
  width: 100%;
  height: 600px;
  position: relative;
  float: left;
  margin: 0 10px;
`
