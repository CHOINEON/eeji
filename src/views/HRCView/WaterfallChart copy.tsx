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
import { useEffect, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { XAIDataType } from './XAIPanel'

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface DataItem {
  [key: string]: number
}
interface WaterfallChartProps {
  data: DataItem[]
}

// Custom plugin for drawing connector lines
const connectorPlugin = {
  id: 'connectorPlugin',
  afterDatasetDraw: (chart: ChartJS) => {
    const {
      ctx,
      chartArea: { top, bottom },
    } = chart

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      for (let i = 1; i < dataset.data.length; i++) {
        const meta = chart.getDatasetMeta(datasetIndex)
        const currentBar = meta.data[i]
        const prevBar = meta.data[i - 1]

        if (currentBar && prevBar) {
          const x1 = prevBar.x
          const y1 = prevBar.y
          const x2 = currentBar.x
          const y2 = currentBar.y

          ctx.save()
          ctx.strokeStyle = 'black' // Connector line color
          ctx.lineWidth = 1 // Connector line width
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          ctx.restore()
        }
      }
    })
  },
}

const WaterfallChart = ({ data }: XAIDataType) => {
  console.log('data:', data)

  const chartRef = useRef<ChartJS<'bar', number[][]> | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [])

  // 기본값으로 빈 배열과 기본 base_value 설정
  const aggregatedXAI = data?.['aggregated_xai'] || []
  const baseValue = data?.['base_value'] || 0
  console.log('test', formatArrayBasedOnN(aggregatedXAI, baseValue))

  function formatArrayBasedOnN(arr: Array<Record<string, number>>, N: number): number[][] {
    return arr.map((item) => {
      const value = Object.values(item)[0]

      // Ensure the return type is always number[] (i.e., [number, number])
      return value >= 0 ? [N, N + value] : [value, N - value]
    })
  }

  const chartData = {
    labels: aggregatedXAI.map((x) => Object.keys(x)[0]),
    datasets: [
      {
        label: 'Revenue',
        data: formatArrayBasedOnN(aggregatedXAI, baseValue), // Use the updated function
        backgroundColor: (context: any) => {
          return context.raw >= 0 ? 'rgba(255, 50, 0, 0.8)' : 'rgba(0, 175, 240, 0.8)'
        },
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
        text: 'Waterfall Chart with Connector Lines',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  return <Bar ref={chartRef} data={chartData} options={chartOptions} plugins={[connectorPlugin]} />
}

export default WaterfallChart
