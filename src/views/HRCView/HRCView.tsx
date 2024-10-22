import { message, Spin } from 'antd'
import DemoApi from 'apis/DemoApi'
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
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js'
import { ActiveElement } from 'chart.js/dist/plugins/plugin.tooltip'
import annotationPlugin from 'chartjs-plugin-annotation'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useMutation } from 'react-query'
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

//Backend server fetching
const HRCView = () => {
  //서버에서 가져온 데이터
  const [inputData, setInputData] = useState()
  const [featureData, setFeatureData] = useState<any>([]) ///TODO: 서버에서 날짜 데이터와 key를 분리해달라고 요청하기

  //차트에 렌더링할 데이터
  const [hrcData, setHrcData] = useState([])
  const [predData, setPredData] = useState([])

  const chartRef = useRef<Chart<'line'> | null>(null) // Chart.js 참조를 위한 ref

  const [selectedX, setSelectedX] = useState<{ pixel: number; value: string }>() //클릭된 점선 위치(pixel)와 실제값(날짜)
  const [shadeRange, setShadeRange] = useState<{ start: number; end: number }>()
  const [date, setDate] = useState<{ start: string; end: string }>()

  const [deltaDataList, setDeltaDataList] = useState<Array<number>>()
  const [turningPointList, setTurningPointList] = useState<Array<number>>()

  const [selectedFeature, setSelectedFeature] = useState<DatasetType>({
    //우측 패널에서 선택된 변수
    name: '',
    data: [],
  })

  const [xaiData, setXaiData] = useState({})
  const [loading, setLoading] = useState(true)

  //TODO: 추후 현재 사용자가 에측하는 위치 blinking 처리 예정
  // const [isBlinking, setIsBlinking] = useState(true)
  const [blinkingIndices, setBlinkingIndices] = useState<Array<number>>() // Indices for the points you want to blink

  const { mutate: mutateHRCInput } = useMutation(DemoApi.getHRCInputList, {
    onSuccess: (result: any) => {
      setInputData(result)
      setHrcData(formatObjectToArray(result['중국 HRC 가격']))
    },
    onError: () => {
      message.error('데이터를 가져오는 데 실패했습니다.')
    },
  })

  const { mutate: mutateHRCResult } = useMutation(DemoApi.getHRCResultList, {
    onSuccess: async (result) => {
      setLoading(false)
      setFeatureData(result)
    },
    onError: () => {
      message.error('데이터를 가져오는 데 실패했습니다.')
    },
  })

  useEffect(() => {
    mutateHRCInput()
    mutateHRCResult()
  }, [])

  useEffect(() => {
    if (selectedX) {
      generateChartData(selectedX.value)

      //shading 효과를 더하기 위한 x범위 찾기
      getPreviousNElements(selectedX, 50)

      if (featureData) {
        //강조할 point 찾기
        const DramaticDates = featureData[selectedX.value]?.dramatic_delta_date_list
        const TurningPointDates = featureData[selectedX.value]?.turning_points_date_list

        // const indices1 = findIndicesByDate(hrcData, DramaticDates)
        // const indices2 = findIndicesByDate(hrcData, TurningPointDates)
        // console.log('indices1:', indices1)
        // console.log('indices2:', indices2)

        if (DramaticDates?.length > 0) setDeltaDataList(findIndicesByDate(hrcData, DramaticDates))
        if (TurningPointDates?.length > 0) setTurningPointList(findIndicesByDate(hrcData, TurningPointDates))
      }
    }
  }, [selectedX])

  function findIndicesByDate(data: Array<DataType>, dates: Array<string>) {
    // data: 검색할 데이터 배열 (객체 배열)
    // dates: 찾고자 하는 날짜 배열

    return dates?.map((date) => data.findIndex((item) => item.time === date))
  }

  function getPreviousNElements(endDate: { pixel: number; value: string }, n: number) {
    //선택된 날짜의 인덱스 번호 찾기
    const endIndex = hrcData.findIndex((element) => element.time == endDate.value)
    const chart = chartRef.current

    const startData = {
      index: hrcData?.findIndex((element) => element?.time === hrcData[endIndex - 50]?.time),
      value: hrcData[endIndex - 50]?.time,
    }

    //인덱스가 50보다 크면, -50번째의 날짜 찾기
    if (endIndex >= n) {
      const startPixel = chart.scales.x.getPixelForValue(startData.value)

      setDate({ start: startData.value, end: selectedX.value })
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

  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart: any, args: any, options: any) {
      const legendContainer = document.getElementById(options.containerID)
      if (!legendContainer) return

      // 기존 범례 지우기
      while (legendContainer.firstChild) {
        legendContainer.firstChild.remove()
      }

      const ulLeft = document.createElement('ul')
      const ulRight = document.createElement('ul')

      // 왼쪽 정렬 스타일 (기본 레전드)
      ulLeft.style.display = 'flex'
      ulLeft.style.flexDirection = 'column'
      ulLeft.style.alignItems = 'flex-start'

      // 오른쪽 정렬 스타일 (커스텀 레전드)
      ulRight.style.display = 'flex'
      ulRight.style.justifyContent = 'flex-end' // 한 줄에 오른쪽 정렬
      ulRight.style.listStyleType = 'none'
      ulRight.style.margin = '0'
      ulRight.style.padding = '0'

      // 기본 레전드 항목 (왼쪽 정렬)
      chart.legend.legendItems.forEach((item: any) => {
        const li = document.createElement('li')
        li.style.listStyleType = 'none'
        li.style.display = 'inline-flex'
        li.style.alignItems = 'center'
        li.style.fontSize = '12px'

        const boxSpan = document.createElement('span')
        boxSpan.style.backgroundColor = item.fillStyle
        boxSpan.style.borderColor = item.strokeStyle
        boxSpan.style.borderWidth = item.lineWidth + 'px'
        boxSpan.style.display = 'inline-block'
        boxSpan.style.width = '50px'
        boxSpan.style.height = '2px'
        boxSpan.style.margin = '15px'

        const textSpan = document.createElement('span')
        textSpan.textContent = item.text

        li.appendChild(boxSpan)
        li.appendChild(textSpan)
        ulLeft.appendChild(li)
      })

      // 레전드를 한 줄에 나열하기 위한 ulLeft 스타일
      ulLeft.style.display = 'flex'
      ulLeft.style.flexDirection = 'row' // 레전드를 가로로 배치
      ulLeft.style.alignItems = 'center' // 수직 중앙 정렬
      ulLeft.style.listStyleType = 'none'
      ulLeft.style.margin = '0'
      ulLeft.style.padding = '0'

      // 커스텀 레전드 항목 (오른쪽 정렬, 한 줄에 나열)
      const customLegendItems = [
        { text: '변곡점', color: 'red' },
        { text: '급변동 지점', color: 'rgb(255,165,0)' },
      ]

      customLegendItems.forEach((customItem) => {
        const li = document.createElement('li')
        li.style.listStyleType = 'none'
        li.style.display = 'inline-flex'
        li.style.alignItems = 'center'
        li.style.fontSize = '12px'
        li.style.marginRight = '10px' // 항목 간 간격

        const boxSpan = document.createElement('span')
        boxSpan.style.backgroundColor = customItem.color
        boxSpan.style.display = 'inline-block'
        boxSpan.style.width = '12px' // 원의 너비
        boxSpan.style.height = '12px' // 원의 높이
        boxSpan.style.borderRadius = '50%' // 원형으로 만들기
        boxSpan.style.marginRight = '5px' // 텍스트와의 간격

        const textSpan = document.createElement('span')
        textSpan.textContent = customItem.text

        li.appendChild(boxSpan)
        li.appendChild(textSpan)
        ulRight.appendChild(li)
        ulRight.style.marginRight = '30px' // Adjust the value as needed for the desired space
      })

      // 왼쪽 정렬 레전드 추가
      legendContainer.appendChild(ulLeft)
      // 오른쪽 정렬 레전드 추가
      legendContainer.appendChild(ulRight)
    },
  }

  // Register the plugin
  ChartJS.register([customHoverPlugin, rangeColorPlugin, htmlLegendPlugin])

  const chartData = {
    labels: hrcData.map((d) => d.time),
    datasets: [
      {
        label: 'HRC 가격',
        data: hrcData.map((d) => d.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        radius: 0,
        fill: true,
        borderWidth: 1.5,
        yAxisID: 'y',
      },
      ...(predData && predData.length > 0
        ? [
            {
              label: 'HRC 예측 가격',
              data: predData.map((d) => d.value),
              borderColor: function (context: ScriptableContext<'line'>) {
                const index = context.dataIndex
                const value = context.dataset.data[index]

                if (deltaDataList?.includes(index)) {
                  return 'rgb(255,165,0)' // deltaDataList 색상 -- 값 변화 큰 지점
                }

                // turningPointList에 포함된 경우
                if (turningPointList?.includes(index)) {
                  return 'red' // turningPointList 색상 -- 변곡점
                }

                // 둘 다 아닌 경우 기본 색상
                return 'rgb(228,1,119)'
              },
              backgroundColor: 'rgb(228,1,119, 0.2)',
              pointBackgroundColor: function (context: ScriptableContext<'line'>) {
                const index = context.dataIndex
                const value = context.dataset.data[index]

                if (deltaDataList?.includes(index)) {
                  return 'rgb(255,165,0)' // deltaDataList 색상 -- 값 변화 큰 지점
                }

                // turningPointList에 포함된 경우
                if (turningPointList?.includes(index)) {
                  return 'red' // turningPointList 색상 -- 변곡점
                }

                // 둘 다 아닌 경우 기본 색상
                return 'rgb(228,1,119)'
              },
              pointRadius: function (context: ScriptableContext<'line'>) {
                const index = context.dataIndex
                const value = context.dataset.data[index]

                if (deltaDataList?.includes(index)) {
                  return 4 // deltaDataList 색상
                }

                // turningPointList에 포함된 경우
                if (turningPointList?.includes(index)) {
                  return 4 // turningPointList 색상
                }

                return 0
              },
              fill: true,
              spanGaps: true,
              borderWidth: 1.5,
              yAxisID: 'y',
            },
          ]
        : []),
      ...(selectedFeature.name !== ''
        ? [
            {
              label: selectedFeature?.name,
              data: selectedFeature?.data.map((d) => d.value),
              borderColor: 'rgb(140,140,140)',
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
      legend: {
        display: false,
      },
      htmlLegend: {
        containerID: 'hrc-legend-container',
      },
      annotation: {
        annotations: selectedX?.value
          ? {
              horizontalLine1: {
                type: 'line' as const,
                borderColor: 'black', // 선 색상
                borderDash: [5, 5], // 점선 설정
                borderWidth: 1.5, // 선 굵기
                scaleID: 'x',
                value: selectedX?.value, // Only set if verticalLine exists
                label: {
                  display: true, // 라벨 표시 활성화
                  content: '입력 종료', // 라벨 내용
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
                borderColor: 'black', // 선 색상
                borderDash: [5, 5], // 점선 설정
                borderWidth: 1.5, // 선 굵기
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
              selectedPred: {
                type: 'line' as const,
                borderColor: 'rgb(67,55,246)', // 선 색상
                // borderDash: [2, 2], // 점선 설정
                borderWidth: 2, // 선 굵기
                scaleID: 'x',
                value: blinkingIndices[0], // Only set if verticalLine exists
                label: {
                  display: true, // 라벨 표시 활성화
                  content: '', // 라벨 내용
                  position: 'center' as const, // 라벨 위치
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
      tooltip: {
        enabled: true, // 툴팁을 비활성화하여 숫자 표시를 없앰
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'x' as const,
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
    return Object.entries(inputObj)?.map(([key, value]) => ({
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
          innerKeyDate?.map((x) => {
            predData.push({ time: x, value: selectedData[x].value })
          })

          //기존의 x축과 동기화하기 위해 비교 후 null값 주입
          const mergedArr = hrcData.map((item) => {
            const found = predData?.find((i) => i.time === item.time)
            return found ? found : { time: item.time, value: null }
          })

          setPredData(mergedArr)
        }
      }
    }

    return result
  }

  const onChangeFeature = (value: string) => {
    if (inputData) {
      const filteredData = inputData[value as keyof typeof inputData]

      //chartdata로 push하기 위한 formatting
      setSelectedFeature({ name: value, data: formatObjectToArray(filteredData) })
    }
  }

  const onChangeDate = (date: string) => {
    //사용자가 선택한 예측 기간(버튼)의 인덱스 번호 추출해 저장
    setBlinkingIndices(findIndicesByDate(hrcData, [date]))
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽 영역 (차트 영역, 80%) */}
      <div className="w-4/6 bg-white p-4">
        <div className="mt-8">
          <p className="text-lg font-bold m-5">선택된 날짜 : {selectedX?.value}</p>
          <div className="m-6">
            <div id="hrc-legend-container"></div>
            <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[customHoverPlugin]} />
          </div>
        </div>
      </div>

      {/* 오른쪽 영역 (20%) */}
      <div className="w-2/6 bg-gray-100 p-4">
        <Spin spinning={loading} tip="Loading...">
          <XAIPanel xaiData={xaiData} onChangeFeature={onChangeFeature} onChangeDate={onChangeDate} />
        </Spin>
      </div>
    </div>
  )
}

export default HRCView
