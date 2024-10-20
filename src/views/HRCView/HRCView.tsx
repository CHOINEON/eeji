import { Spin } from 'antd'
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
import annotationPlugin from 'chartjs-plugin-annotation'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import XAIPanel from './XAIPanel'

type DataType = {
  time: string
  value: number
}

type DatasetType = {
  name: string
  data: Array<DataType>
}

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
ChartJS.register(
  zoomPlugin,
  annotationPlugin,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const HRCView = () => {
  //서버에서 가져온 데이터
  const [inputData, setInputData] = useState([])
  const [featureData, setFeatureData] = useState<FeatureDataType>()

  //차트에 렌더링할 데이터
  const [hrcData, setHrcData] = useState([])
  const [predData, setPredData] = useState([])

  const chartRef = useRef<Chart<'line'> | null>(null) // Chart.js 참조를 위한 ref

  const [selectedX, setSelectedX] = useState<{ pixel: number; value: string }>() //클릭된 점선 위치(pixel)와 실제값(날짜)
  const [shadeRange, setShadeRange] = useState<{ start: number; end: number }>()
  const [date, setDate] = useState<{ start: string; end: string }>()

  const [selectedFeature, setSelectedFeature] = useState<DatasetType>({
    //우측 패널에서 선택된 변수
    name: '',
    data: [],
  })

  const [xaiData, setXaiData] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchInputData = async () => {
    const result = await ModelApi.getJsonResult(url_input_data)

    setInputData(result)
    setHrcData(formatObjectToArray(result['중국 HRC 가격']))
  }

  const fetchResultData = async () => {
    const result = await ModelApi.getJsonResult(url_hrc_result)
    setLoading(false)
    setFeatureData(result)
  }

  useEffect(() => {
    fetchInputData()
    fetchResultData()
  }, [])

  useEffect(() => {
    if (selectedX) {
      generateChartData(selectedX.value)

      //shading 효과를 더하기 위한 x범위 찾기
      getPreviousNElements(selectedX, 50)
    }
  }, [selectedX])

  function getPreviousNElements(endDate: { pixel: number; value: string }, n: number) {
    //선택된 날짜의 인덱스 번호 찾기
    const endIndex = hrcData.findIndex((element) => element.time == endDate.value)
    const chart = chartRef.current

    //인덱스가 50보다 크면, -50번째의 날짜 찾기
    if (endIndex > n) {
      const startDate = hrcData[endIndex - 50].time
      const startPixel = chart.scales.x.getPixelForValue(startDate)

      setDate({ start: startDate, end: selectedX.value })
      setShadeRange({ start: startPixel, end: endDate.pixel })
    }
  }

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
      },
    }
  }, [selectedX])

  //TODO. 리렌더링으로 state에 저장된 값을 불러오지 못함
  const rangeColorPlugin = {
    id: 'rangeColorPlugin',
    afterDatasetsDraw: (chart: ChartJS) => {
      const { ctx, scales } = chart
      const xAxis = scales.x
      const yAxis = scales.y

      // 음영 처리 범위가 설정된 경우에만 처리
      if (shadeRange && shadeRange.start !== null && shadeRange.end !== null) {
        const rangeStart = xAxis.getPixelForValue(shadeRange.start)
        const rangeEnd = xAxis.getPixelForValue(shadeRange.end)

        // Set the color and draw the background rectangle for the range
        ctx.save()
        ctx.fillStyle = 'rgba(255, 99, 132, 0.2)' // Set the background color for the range
        ctx.fillRect(rangeStart, yAxis.top, rangeEnd - rangeStart, yAxis.bottom - yAxis.top)
        ctx.restore()
      }
    },
  }

  // Register the plugin
  ChartJS.register([customHoverPlugin, rangeColorPlugin])

  const chartData = {
    labels: hrcData.map((d) => d.time),
    datasets: [
      {
        label: 'HRC 가격',
        data: hrcData.map((d) => d.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 0, // 포인트 마커를 없앰
        borderWidth: 1.5,
        yAxisID: 'y',
      },
      {
        label: 'HRC 예측 가격',
        data: predData.map((d) => d.value),
        borderColor: 'rgb(228,1,119)',
        backgroundColor: 'rgb(228,1,119, 0.2)',
        fill: true,
        pointRadius: 0, // 포인트 마커를 없앰
        spanGaps: true,
        borderWidth: 1.5,
        yAxisID: 'y',
      },
      ...(selectedFeature.name !== ''
        ? [
            {
              label: selectedFeature?.name,
              data: selectedFeature?.data.map((d) => d.value),
              borderColor: 'rgb(87,87,87)',
              fill: false,
              pointRadius: 0, // 포인트 마커를 없앰
              spanGaps: true,
              borderWidth: 1.5,
              yAxisID: 'y1',
            },
          ]
        : []),
    ],
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const, // x축을 기준으로 hover시 라인 표시
      intersect: false,
    },
    plugins: {
      annotation: {
        annotations: selectedX?.value
          ? {
              horizontalLine1: {
                type: 'line' as const,
                borderColor: 'black', // 선 색상
                borderDash: [5, 5], // 점선 설정
                borderWidth: 1, // 선 굵기
                scaleID: 'x',
                value: selectedX?.value, // Only set if verticalLine exists
                label: {
                  display: true, // 라벨 표시 활성화
                  content: '입력 끝', // 라벨 내용
                  position: 'end' as const, // 라벨 위치
                  backgroundColor: 'rgba(0,0,0,0.1)', // 라벨 배경 색상
                  color: 'black', // 라벨 텍스트 색상
                  font: {
                    size: 12, // 라벨 폰트 크기
                  },
                },
              },
              horizontalLine2: {
                type: 'line' as const,
                borderColor: 'rgb(240,135,0)', // 선 색상
                borderDash: [5, 5], // 점선 설정
                borderWidth: 1, // 선 굵기
                scaleID: 'x',
                value: date?.start, // Only set if verticalLine exists
                label: {
                  display: true, // 라벨 표시 활성화
                  content: '입력 시작', // 라벨 내용
                  position: 'start' as const, // 라벨 위치
                  backgroundColor: 'rgba(0,0,0,0.1)', // 라벨 배경 색상
                  color: 'black', // 라벨 텍스트 색상
                  font: {
                    size: 12, // 라벨 폰트 크기
                  },
                },
              },
            }
          : {}, // Empty annotations object if no verticalLine
      },
      datalabels: {
        display: false,
      },
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true, // 툴팁을 비활성화하여 숫자 표시를 없앰
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
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
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
      const activeElements = chart.tooltip.getActiveElements()

      if (activeElements.length) {
        const activePoint = activeElements[0]

        const xValueIndex = activePoint.index // This gives the index of the clicked element
        const xAxisValue = chart.data.labels?.[xValueIndex] // Get the actual x-axis label value

        setSelectedX({ pixel: xValueIndex, value: xAxisValue as string }) // Store the x-axis value
      }
    },
  }

  function formatObjectToArray(inputObj: { [key: string]: number }) {
    return Object.entries(inputObj).map(([key, value]) => ({
      time: key,
      value: value,
    }))
  }

  function generateChartData(keyDate: string): Record<string, object> {
    const result: Record<string, any[]> = {}
    if (featureData) {
      const selectedData = featureData[keyDate]
      setXaiData(selectedData)

      if (featureData[keyDate]) {
        // 해당 날짜에 포함된 예측 데이터 날짜 추출
        const innerKeyDate = Object.keys(featureData[keyDate]).slice(0, 7)

        if (innerKeyDate) {
          const predData: Array<any> = []
          innerKeyDate.map((x) => {
            predData.push({ time: x, value: selectedData[x].value })
          })

          //기존의 x축과 동기화하기 위해 비교 후 null값 주입
          const mergedArr = hrcData.map((item) => {
            const found = predData.find((i) => i.time === item.time)
            return found ? found : { time: item.time, value: null }
          })

          setPredData(mergedArr)
        }
      }
    }

    return result
  }

  const onChangeFeature = (value: string) => {
    const filteredData = inputData[value as keyof typeof inputData]

    //chartdata로 push하기 위한 formatting
    setSelectedFeature({ name: value, data: formatObjectToArray(filteredData) })
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽 영역 (차트 영역, 80%) */}
      <div className="w-4/6 bg-white p-4">
        <div className="mt-8">
          {selectedX?.value && <p className="text-lg font-bold m-2">선택된 날짜 : {selectedX?.value}</p>}
          <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[customHoverPlugin]} />
        </div>
      </div>

      {/* 오른쪽 영역 (20%) */}
      <div className="w-2/6 bg-gray-100 p-4">
        <Spin spinning={loading} tip="Loading...">
          <XAIPanel xaiData={xaiData} onChangeFeature={onChangeFeature} />
        </Spin>
      </div>
    </div>
  )
}

export default HRCView
