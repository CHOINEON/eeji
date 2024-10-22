import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { XAIDataType } from './XAIPanel'

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin)

// Custom plugin for drawing connector lines
const connectorPlugin = {
  id: 'connectorPlugin',
  afterDatasetDraw: (chart: ChartJS) => {
    const {
      ctx,
      scales: { x, y },
    } = chart

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)

      for (let i = 1; i < dataset.data.length; i++) {
        const currentBar = meta.data[i] // Current bar
        const prevBar = meta.data[i - 1] // Previous bar

        if (currentBar && prevBar) {
          // Get coordinates for the connector lines
          const x1 = prevBar.x
          const y1 = prevBar.y
          const x2 = currentBar.x
          const y2 = currentBar.y

          // Draw the horizontal connector line between bars
          ctx.save()
          ctx.strokeStyle = 'black' // Set connector line color
          ctx.strokeRect(x1, y2 < y1 ? y1 : y2, x2 - x1, 0)
          ctx.lineWidth = 1 // Set connector line width
          ctx.restore()
        }
      }
    })
  },
}
const WaterfallChart = ({ data }: XAIDataType) => {
  const chartRef = useRef<ChartJS<'bar', number[][]> | null>(null)
  const [yAxis, setYaxis] = useState<{ min: number; max: number }>()

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [])

  useEffect(() => {
    if (data) {
      setYaxis(calculateYaxisValues(data.aggregated_xai, data.base_value))
    }
  }, [data])

  // 기본값으로 빈 배열과 기본 base_value 설정
  const aggregatedXAI = data?.['aggregated_xai'] || []
  const baseValue = data?.['base_value'] || 0

  function calculateYaxisValues(data: Array<Record<string, number>>, baseValue: number) {
    //baseValue 에 aggregateXAI의 최소/최대값 찾아서 y축 범위 찾기
    let positiveSum = baseValue
    let negativeSum = baseValue

    data.forEach((item) => {
      const key = Object.keys(item)[0]
      const value = item[key]

      if (value > 0) positiveSum += value
      if (value < 0) negativeSum += value
    })

    return { min: negativeSum, max: positiveSum }
  }

  function formatDatasetArr(arr: Array<Record<string, number>>, defaultValue: number): number[][] {
    let currentValue = defaultValue
    const result: Array<[number, number]> = []

    arr.forEach((item) => {
      const key = Object.keys(item)[0]
      const value = item[key]
      const previousValue = currentValue

      currentValue = previousValue + value

      if (currentValue > previousValue) {
        result.push([previousValue, currentValue])
      } else {
        result.push([currentValue, previousValue])
      }
    })
    return result
  }

  function generateColorArr(arr: Array<Record<string, number>>) {
    const result: Array<string> = []

    arr.forEach((item) => {
      const key = Object.keys(item)[0]
      const value = item[key]

      if (value >= 0) result.push('rgba(255, 50, 0, 0.8)')
      else result.push('rgba(0, 175, 240, 0.8)')
    })
    return result
  }

  const chartData = {
    labels: aggregatedXAI.map((x) => Object.keys(x)[0]),
    datasets: [
      {
        label: 'Revenue',
        data: formatDatasetArr(aggregatedXAI, baseValue),
        backgroundColor: generateColorArr(aggregatedXAI),
      },
    ],
  }

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
      annotation: {
        annotations: {
          horizontalLine1: {
            type: 'line',
            borderColor: 'grey', // 선 색상
            borderDash: [5, 5], // 점선 설정
            borderWidth: 1, // 선 굵기
            scaleID: 'y', // y축 기준으로 그리기
            value: baseValue, // 수평선이 그려질 y축 값 (baseValue)
            label: {
              display: true, // 라벨 표시 활성화
              content: '오늘 가격', // 라벨 내용
              position: 'end', // 라벨 위치
              backgroundColor: 'rgba(0,0,0,0.5)', // 라벨 배경 색상
              color: 'white', // 라벨 텍스트 색상
              font: {
                size: 12, // 라벨 폰트 크기
              },
            },
          },
          horizontalLine2: {
            type: 'line',
            borderColor: 'blue', // 두 번째 수평선 색상
            borderDash: [5, 5], // 점선 설정
            borderWidth: 1, // 선 굵기
            scaleID: 'y', // y축 기준으로 그리기
            value: data?.['value'], // 두 번째 수평선이 그려질 y축 값 (마지막 y 값)
            label: {
              display: true, // 라벨 표시 활성화
              content: '예상 가격', // 라벨 내용
              position: 'end', // 라벨 위치
              backgroundColor: 'rgba(0,0,255,0.5)', // 라벨 배경 색상 (파란색)
              color: 'white', // 라벨 텍스트 색상
              font: {
                size: 12, // 라벨 폰트 크기
              },
            },
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45, // 최대 회전 각도 설정
          minRotation: 45, // 최소 회전 각도 설정
        },
      },
      y: {
        stacked: true,
        min: yAxis?.min || 0, // y축 시작점을 baseValue로 설정
        max: yAxis?.max || 0, // y축 시작점을 baseValue로 설정
      },
    },
  }

  return <Bar ref={chartRef} data={chartData} options={chartOptions} plugins={[connectorPlugin]} />
}

export default WaterfallChart
