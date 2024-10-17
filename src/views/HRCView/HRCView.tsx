import { Radio } from 'antd'
import ModelApi from 'apis/ModelApi'
import {
  CategoryScale,
  Chart,
  Chart as ChartJS,
  ChartEvent,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { ActiveElement } from 'chart.js/dist/plugins/plugin.tooltip'
import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import InputData from './hrc_input_data.json'
import XAITable from './XAITable'

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function formatObjectToArray(inputObj: { [key: string]: number }) {
  return Object.entries(inputObj).map(([key, value]) => ({
    time: key,
    value: value,
  }))
}

const HRCView = () => {
  const tempData = InputData
  const [data, setData] = useState([])
  const [period, setPeriod] = useState('30')
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null) // 클릭된 포인트를 고정하기 위한 상태
  const chartRef = useRef<Chart<'line'> | null>(null) // Chart.js 참조를 위한 ref
  const [verticalLine, setVerticalLine] = useState<number>() // 클릭된 점선 위치를 저장

  //403 forbidden(Access denied)  --- 확인 필요
  const fetchPredictionData = async () => {
    const result = await ModelApi.getJsonResult(
      'https://storage.googleapis.com/cloudai-test-bucket/google/seongyeop%40ineeji.com/hrc_res[…]523d4e5592c027eabba744057bf6105422d04e3509e02070535429e34'
    )

    const formattedData = formatObjectToArray(result['HRC:4.75mm'])
    setData(formattedData)
  }

  useEffect(() => {
    // fetchPredictionData()
    setData(formatObjectToArray(tempData['HRC:4.75mm']))
  }, [])

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: 'HRC Line Data',
        data: data.map((d) => d.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 0, // 포인트 마커를 없앰
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const, // x축을 기준으로 hover시 라인 표시
      intersect: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: true,
      },
      tooltip: {
        enabled: false, // 툴팁을 비활성화하여 숫자 표시를 없앰
      },
    },
    scales: {
      x: {
        display: true, // x축을 표시
        grid: {
          display: true, // x축에 그리드 선을 표시
          color: 'rgba(200, 200, 200, 0.5)', // 그리드 선 색상
        },
        title: {
          display: false,
        },
      },
      y: {
        display: true, // y축을 표시
        grid: {
          display: true, // y축에 그리드 선을 표시
          color: 'rgba(200, 200, 200, 0.5)', // 그리드 선 색상
        },
        title: {
          display: false,
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
      const activeElements = chart.tooltip.getActiveElements()

      if (activeElements.length) {
        const activePoint = activeElements[0]
        const xPosition = activePoint.element.x // Capture the x position in pixels

        setVerticalLine(xPosition) // Store the x-axis value
        chart.update() // 차트를 업데이트하여 세로선이 반영되도록 함
      }
    },
  }

  const customHoverPlugin = {
    id: 'hoverLine',
    afterDatasetsDraw: (chart: ChartJS) => {
      const activeElements = chart.tooltip.getActiveElements() // Hover된 엘리먼트 가져오기

      // Hover된 위치에 세로선 그리기
      if (activeElements.length) {
        const activePoint = activeElements[0]
        const ctx = chart.ctx
        const x = activePoint.element.x
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.restore()
      }

      // 클릭된 위치에 고정된 세로선 그리기
      if (verticalLine !== undefined) {
        // verticalLine이 정의된 경우에만 그리기
        const xAxisValue = chart.scales.x.getValueForPixel(verticalLine) // Convert x position to x-axis value
        console.log('xAxisValue:', xAxisValue)

        const ctx = chart.ctx
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(xAxisValue, topY)
        ctx.lineTo(xAxisValue, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)' // 고정된 선은 빨간색으로
        ctx.setLineDash([]) // 실선으로 고정
        ctx.stroke()
        ctx.restore()
      }
    },
  }

  // Register the plugin
  ChartJS.register(customHoverPlugin)

  const handleRadioClick = (args: any) => {
    setPeriod(args.target.value)
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽 영역 (차트 영역, 80%) */}
      <div className="w-4/5 bg-white p-4">
        <div>
          <Radio.Group defaultValue="a" buttonStyle="solid" onChange={handleRadioClick} value={period}>
            <Radio.Button value="30">30일</Radio.Button>
            <Radio.Button value="60">60일</Radio.Button>
            <Radio.Button value="90">90일</Radio.Button>
            <Radio.Button value="150">150일</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
          {selectedPoint !== null && (
            <div style={{ marginTop: '10px', color: 'red' }}>
              Selected Value: {chartData.datasets[0].data[selectedPoint]}
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 영역 (20%) */}
      <div className="w-1/5 bg-gray-100 p-4">
        <XAITable period={period} />
      </div>
    </div>
  )
}

export default HRCView
