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
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import XAITable from './XAITable'

// Define the type for featureData
type FeatureDataType = {
  [date: string]: {
    [date: string]: {
      time_delta: number
      value_delta: number
      value: number
      positive_xai: { [key: string]: number }
      negative_xai: { [key: string]: number }
    }
  }
}

const url_hrc_result =
  'https://storage.googleapis.com/cloudai-test-bucket/google/seongyeop%40ineeji.com/hrc_result_d.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloudai-data-uploader%40ineeji-cloudai-test.iam.gserviceaccount.com%2F20241017%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241017T091854Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=180f6f46380b483a81ae3fdb2fdea352a006d0923b9f953b6aab7672926fabc4a1f2d7ed8cafc234dc8dc8813d278e83a4940793da8cb411bded1cca457132f62e995103138e7e50805b21eec0b9ff7df5548b396e3c06125e16e15579435fb1755f20455e2e502efa7d36d4196f5fdf3acf74231f39614092dee13e7e06d622326ae560306ec780f781e0784a458352c32fc3e98e44c44ff4e28335f6aa085841d7af8ae58b1a0698b3938ac7e11576ec324072f9f6d492b1b34909813c8da5902961b6df3bed1e9149e1d15ce8e949ce30c4aa61ad772a420e8a7645d92648329e756523d4e5592c027eabba744057bf6105422d04e3509e02070535429e34'
const url_input_data =
  'https://storage.googleapis.com/cloudai-test-bucket/google/seongyeop%40ineeji.com/hrc_input_data.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloudai-data-uploader%40ineeji-cloudai-test.iam.gserviceaccount.com%2F20241017%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241017T091553Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=4b860d8e3e73bb03884bb0c469e24e3baeb27f08a5e3edd57bd0039573a679fcbc8dc203916562038cb62ccc83402f73d08ec415b448fcd9a56d010d66993a200cd2e825c87f80c0e1f83a5b194cd2cf06127badc3f636f15771cff78206784274eb9f4957813f6d8b642b438a2399cf0024ae2505ee8db51a0e1c6ba32872bd6a5094b12609631c7bcffe8e583e9bb12473505fc75cfe616036e0bdc0479247bf02504840c1d7e954b11e5045ee1f26ba0b041299ed2a671f9a2a676f123cb0dd1088a7dbf0d6376b186da570bb0d53e3c959f335fc28c99fe43a8c513b40c3442eaad4b5047bba1a99d68253a1b7047471d4f38959a919c24179b2701d614a'

// Registering Chart.js components
ChartJS.register(zoomPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const HRCView = () => {
  //서버에서 가져온 데이터
  const [featureData, setFeatureData] = useState<FeatureDataType>()

  //차트에 렌더링할 데이터
  const [data, setData] = useState([])
  const [predData, setPredData] = useState([])

  const [selectedPoint, setSelectedPoint] = useState<number | null>(null) // 클릭된 포인트를 고정하기 위한 상태
  const chartRef = useRef<Chart<'line'> | null>(null) // Chart.js 참조를 위한 ref

  const [verticalLine, setVerticalLine] = useState<number>() // 클릭된 점선 위치를 저장
  const [focusedDate, setFocusedDate] = useState<string>('')

  const [xaiData, setXaiData] = useState({})
  // const [textData, setTextData] = useState('')

  const fetchInputData = async () => {
    const result = await ModelApi.getJsonResult(url_input_data)
    setData(formatObjectToArray(result['HRC:4.75mm']))
  }

  const fetchResultData = async () => {
    const result = await ModelApi.getJsonResult(url_hrc_result)
    console.log('feature data:', result)
    setFeatureData(result)
  }

  function formatObjectToArray(inputObj: { [key: string]: number }) {
    return Object.entries(inputObj).map(([key, value]) => ({
      time: key,
      value: value,
    }))
  }

  useEffect(() => {
    fetchInputData()
    fetchResultData()
  }, [])

  // Memoize the customHoverPlugin to prevent re-creation on every render
  const customHoverPlugin = useMemo(() => {
    return {
      id: 'hoverLine',
      afterDatasetsDraw: (chart: ChartJS<'line'>) => {
        const ctx = chart.ctx
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        // Draw hover vertical line
        const activeElements = chart.tooltip.getActiveElements()
        if (activeElements.length) {
          const { x } = activeElements[0].element

          // Get the actual x-axis value (the label from the x-axis)
          const xAxisValue = chart.scales.x.getValueForPixel(x)
          const index = chart.scales.x.getValueForPixel(x) // This gives you the index in the data.labels array
          const actualLabel = chart.data.labels[index] as string // Fetch the actual x-axis label (e.g., '2023-01-01')

          // console.log('Hovered x-axis value (label):', actualLabel) // This prints the correct label (e.g., '2023-01-01')
          setFocusedDate(actualLabel)

          // Draw dotted hover line
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x, topY)
          ctx.lineTo(x, bottomY)
          ctx.lineWidth = 1
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.setLineDash([5, 5])
          ctx.stroke()
          ctx.restore()
        }

        // Draw fixed line at clicked position (if implemented)
        if (verticalLine !== null) {
          const fixedX = chart.scales.x.getPixelForValue(verticalLine)
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(fixedX, topY)
          ctx.lineTo(fixedX, bottomY)
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'
          ctx.setLineDash([])
          ctx.stroke()
          ctx.restore()
        }
      },
    }
  }, [verticalLine])

  // Register the plugin
  ChartJS.register(customHoverPlugin)

  useEffect(() => {
    if (focusedDate) {
      generateChartData(focusedDate)
      generateTextData(focusedDate)
    }
  }, [focusedDate])

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
        borderWidth: 1.5,
      },
      {
        label: 'Prediction',
        data: predData.map((d) => d.value),
        borderColor: 'rgb(255,100,132)',
        backgroundColor: 'rgba(255,100,132, 0.2)',
        fill: true,
        pointRadius: 0, // 포인트 마커를 없앰
        spanGaps: true,
        borderWidth: 1.5,
      },
    ],
  }

  useEffect(() => {
    // console.log('data:', data)
    // console.log('data2:', data2)
  }, [predData])

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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          // pinch: {
          //   enabled: true,
          // },
          mode: 'xy' as const,
        },
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
        const xAxisValue = chart.scales.x.getValueForPixel(activePoint.element.x) // Get the actual x-axis value

        setVerticalLine(xAxisValue) // Store the x-axis value
      }
    },
  }

  function generateTextData(keyDate: string) {
    // empty value
    // console.log('key:', keyDate)
    // console.log(`hrc_result_d 에서 ${keyDate} 값 :`, featureData[keyDate])
  }

  function generateChartData(keyDate: string): Record<string, object> {
    const result: Record<string, any[]> = {}

    if (featureData) {
      const focusedData = featureData[keyDate]
      console.log('focusedData:', focusedData)
      // 해당 날짜에 포함된 예측 데이터 날짜 추출
      const innerKeyDate = Object.keys(featureData[keyDate]).slice(0, 7)

      //delta_info_list
      console.log(Object.keys(featureData[keyDate])[8])
      //turning_point_list
      console.log(Object.keys(featureData[keyDate])[9])

      if (innerKeyDate) {
        const predData: Array<any> = []
        innerKeyDate.map((x) => {
          predData.push({ time: x, value: focusedData[x].value })
        })

        //기존의 x축과 동기화하기 위해 비교 후 null값 주입
        const mergedArr = data.map((item) => {
          const found = predData.find((i) => i.time === item.time)
          return found ? found : { time: item.time, value: null }
        })

        setPredData(mergedArr)
      }
    }

    return result
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽 영역 (차트 영역, 80%) */}
      <div className="w-4/5 bg-white p-4">
        <div>
          <h2>선택된 날짜 : {focusedDate}</h2>
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
        <XAITable focusedDate={focusedDate} />
      </div>
    </div>
  )
}

export default HRCView
