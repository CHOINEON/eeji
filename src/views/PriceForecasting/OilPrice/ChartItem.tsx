import axios from 'axios'
import { ApexOptions } from 'apexcharts'
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'
import { keyColors } from 'views/AIModelGenerator/components/Chart/colors'
import { ConsoleSqlOutlined } from '@ant-design/icons'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
// // import ApexCharts from 'apexcharts'
// // Removed the unnecessary import statement for ApexCharts
// // import { ApexCharts } from 'apexcharts'

const ChartItem = (props: any) => {
  // console.log('id', props)
  // TODO 2024-03-06 심볼명, 심볼설명 배열 생성
  const [chartType, setChartType] = useState('candle')

  // https://ineeji-solution-tf.du.r.appspot.com/api/index_predict/get_symbol_predict/admin?is_daily=1&symbol=BCOMAL.INDX

  const [truthData, setTruthData] = useState<(number | null)[][]>([])
  const [predictData, setPredictData] = useState<(number | null)[][]>([])
  const [selection, setSelection] = useState('all')
  const [isFeature, setIsFeature] = useState(false)
  const [isReload, setIsReload] = useState(false)

  const [symbolList, setSymbolList] = useState([])
  const [frequency, setFrequency] = useState('daily')
  const [symbol, setSymbol] = useState('')

  const [featuredData, setFeaturedData] = useState([])

  useEffect(() => {
    if (props.is_reset) {
      setIsFeature((prev) => false)
    }
  }, [props.is_reset])

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_NEW_API_SERVER_URL}/api/index_predict/get_symbol_predict/admin?is_daily=${
          frequency === 'daily' ? 1 : 0
        }&symbol=${symbol}`
      )
      .then(({ data }) => {
        // console.log(data['xai']['xai_global'][0])
        // TODO 2024-03-07 '2024-02-06' 형식을 unix timestamp로 변환
        // console.log('data', data)
        setTruthData([])
        setPredictData([])
        setFeaturedData([])

        let tmpCnt = 0
        data.map((item: any, index: number) => {
          const date = new Date(item.date).getTime()
          // TODO truth Data 초기화
          setTruthData((prev) => [...prev, [date, item.ground_truth]])
          if (tmpCnt > 0) {
            // 2024-03-25 전달 데이터의 pred_1값을 넣는다.
            setPredictData((prev) => [...prev, [date, data[index - 1].pred_1]])
          } else {
            // TODO 첫 번째 배열에는 동일한 값을 넣는다.
            setPredictData((prev) => [...prev, [date, item.ground_truth]])
          }
          // TODO predict Data 초기화
          tmpCnt++
        }, [])

        // TODO 2024-03-25 Featured Data 처리
        // TODO 2024-03-25 xai는 데이터의 마지막 값을 참고한다.
        if (data[data.length - 1]['xai']['xai_global'][0]) {
          setFeaturedData((prev) => [...prev, data[data.length - 1]['xai']['xai_global'][0]])
        }

        if (frequency === 'daily') {
          // TODO 마지막 배열에 pred_1~pred_5까지의 값을 넣는다.
          for (let i = 1; i < 6; i++) {
            const date = new Date(data[data.length - 1].date).getTime() + 86400000 * i
            setPredictData((prev) => [...prev, [date, data[data.length - 1][`pred_${i}`]]])

            // TODO truth
            setTruthData((prev) => [...prev, [date, null]])
          }
        } else {
          for (let i = 1; i < 4; i++) {
            const date = new Date(data[data.length - 1].date).getTime() + 86400000 * i

            // TODO 2024-03-25 해당 date의 다음달 마지막 날짜를 구한다.
            const lastDate = new Date(date)
            const nextMonth = lastDate.getMonth() + 1 + i
            lastDate.setMonth(nextMonth)
            lastDate.setDate(0)
            // console.log(lastDate)
            // console.log('lastDate', lastDate.toISOString().split('T')[0])

            // TODO 2024-03-25 lastDate를 unix timestamp로 변환
            setPredictData((prev) => [...prev, [new Date(lastDate).getTime(), data[data.length - 1][`pred_${i}`]]])
            console.log(data[data.length - 1][`pred_${i}`])
            // TODO truth
            setTruthData((prev) => [...prev, [date, null]])
          }
        }

        setIsReload((prev) => !isReload)
      })
      .catch((error) => console.error(error))
      .then(() => {
        //
      })
  }, [symbol])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(e.target)
    setSelection((prev) => 'all')
    setSymbol((prev) => e.target.value)
    setIsFeature((prev) => false)
  }

  useEffect(() => {
    // daily (1:일일, 0:월간)
    axios
      .get(
        `${process.env.REACT_APP_NEW_API_SERVER_URL}/api/index_predict/get_symbol_list/admin?is_daily=${
          frequency === 'daily' ? 1 : 0
        }`
      )
      .then(({ data }) => {
        setSymbolList([])
        // TODO 2024-03-25 daylySymbolList에 데이터가 있으면 비운다.
        data.map((item: any, index: number) => {
          // TODO 2024-04-04 props.chart_id에서 숫자만 추출
          const tmp_index = parseInt(props.chart_id.replace('chart-', ''))
          // 2024-04-04 해당 index와 일치하는 항목 출력
          if (index === tmp_index - 1) {
            setSymbol((prev) => item['symbol'])
            // TODO 2024-04-04 해당 index와 일치하는 option 선택
          }
          setSymbolList((prev: any) => [...prev, [item['symbol'], item['full_name']]])
        })
        // setTimeout(() => {
        //   console.log(symbolList)
        // }, 300)
      })
      .catch((error) => console.error(error))
      .then(() => {
        //
      })
  }, [frequency])

  const symbolOption = useMemo(() => {
    if (symbolList.length > 0) {
      return symbolList.map((item: any, index: number) => {
        // console.log('item', item)
        // TODO 2024-04-04 props.chart_id에서 숫자만 추출
        const tmp_index = parseInt(props.chart_id.replace('chart-', ''))
        return (
          <option key={index} value={item[0]} selected={index === tmp_index - 1}>
            {item[1]}
          </option>
        )
      })
    }
  }, [symbolList])

  const data = useMemo(() => {
    return {
      series: [
        {
          name: 'Truth',
          data: truthData,
        },
        {
          name: 'Predict',
          data: predictData,
        },
      ],

      options: {
        colors: ['#64d33f', '#372dd5'],
        chart: {
          id: props.chart_id,
          type: chartType === 'area',
          height: '100%',
          zoom: {
            autoScaleYaxis: true,
          },
          toolbar: {
            show: false,
            tools: {
              download: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: false,
            },
          },
        },

        annotations: {
          xaxis: [
            {
              x: predictData?.length > 0 ? predictData[predictData?.length - (frequency === 'daily' ? 6 : 4)][0] : 0, // 세로 Border 출력
              borderColor: '#1A73FF',
              bordwrWidth: 1,
              strokeDashArray: 10,
              label: {
                show: true,
                text: '',
                style: {
                  color: '#fff',
                  background: '#1A73FF',
                },
              },
            },
          ],
        },

        title: {
          text: '',
          align: 'left',
        },
        xaxis: {
          type: 'datetime',
        },
        stroke: {
          width: 1,
          curve: 'straight',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        // fill: {
        //   type: 'gradient',
        //   gradient: {
        //     shadeIntensity: 1,
        //     opacityFrom: 0.7,
        //     opacityTo: 0.9,
        //     stops: [0, 100],
        //   },
        // },
      },
    }
  }, [chartType, props.chart_id, isReload])

  const updateChart = (selection: string) => {
    setSelection((prev) => selection)

    setTimeout(() => {
      if (truthData.length > 0) {
        // let lastDate = truthData[truthData.length - 6][0]
        const lastDate = truthData[truthData.length - 1][0]
        // TODO 기준 일주일 전 날짜 계산
        const oneWeekAgo = lastDate ? lastDate - 86400000 * (7 + 5) : null
        const oneMonthAgo = lastDate ? lastDate - 86400000 * (30 + 5) : null

        if (selection === 'one_week') {
          ApexCharts.exec(`${props.chart_id}`, 'zoomX', oneWeekAgo, lastDate)
        } else if (selection === 'one_month') {
          ApexCharts.exec(`${props.chart_id}`, 'zoomX', oneMonthAgo, lastDate)
        } else if (selection === 'all') {
          ApexCharts.exec(`${props.chart_id}`, 'zoomX', truthData[0][0], truthData[truthData.length - 1][0])
        }
      }
    }, 100)
  }

  return (
    // <div className="bg-white border border-[#D5DCEF] rounded-xl p-3 h-[calc(100%-20px)]">
    <div className="bg-white border border-[#D5DCEF] rounded-xl pt-16 pb-5 px-3 h-full relative">
      <div className="absolute top-3 z-[1000]">
        <div className="flex">
          <select
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 mr-3"
            onChange={handleSelect}
          >
            {/* {symbolList.map((item, index) => {
              return (
                <option key={index} value={item.symbol}>
                  {ttt}
                </option>
              )
            })} */}
            {symbolOption}
          </select>
          <div className="flex items-center space-x-2">
            <div
              className={`item ${frequency === 'daily' ? 'item-active' : ''}`}
              onClick={() => {
                setFrequency((prev) => 'daily')
                setIsFeature((prev) => false)
              }}
            >
              1일
            </div>
            <div
              className={`item ${frequency === 'monthly' ? 'item-active' : ''} whitespace-nowrap`}
              onClick={() => {
                setFrequency((prev) => 'monthly')
                setIsFeature((prev) => false)
              }}
            >
              1달
            </div>

            <div className={`item-disabled`}>
              <img src="/img/icon/candle.svg" alt="" />
            </div>

            <div className={`item item-active`}>
              <img src="/img/icon/line.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-2">
          <div
            className={`${
              frequency === 'daily' ? '' : 'hidden'
            } rounded-sm cursor-pointer text-[11px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'one_week' ? 'bg-[#D5DCEF]' : 'bg-white hover:bg-[#D5DCEF]'
            }`}
            onClick={() => {
              updateChart('one_week')
            }}
          >
            1W
          </div>
          <div
            className={`${
              frequency === 'daily' ? '' : 'hidden'
            } rounded-sm cursor-pointer text-[11px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'one_month' ? 'bg-[#D5DCEF]' : 'bg-white hover:bg-[#D5DCEF]'
            }`}
            onClick={() => {
              updateChart('one_month')
            }}
          >
            1M
          </div>
          <div
            className={`rounded-sm cursor-pointer text-[11px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'all' ? 'bg-[#D5DCEF]' : 'bg-white hover:bg-[#D5DCEF]'
            }`}
            onClick={() => {
              updateChart('all')
            }}
          >
            ALL
          </div>
        </div>
      </div>
      <div
        className={`text-[13px] absolute top-[55px] z-[1000] right-3 bg-white border-solid border border-[#D5DCEF] border-primary text-primary font-bold py-2 px-4 cursor-pointer rounded-xl text-sm transition-all hover:bg-[#E5EBFF] hover:text-[#372dd5] hover:border-[#372dd5] select-none`}
        onClick={() => {
          setIsFeature((prev) => !isFeature)
        }}
      >
        Feature Importance
      </div>

      {isFeature && (
        <div className="absolute right-3 top-[55px] px-4 py-2 rounded-xl z-[1000] bg-white border-[#372dd5] border w-[calc(100%-25px)] max-w-[930px] shadow-md slideInUp">
          <div className="flex justify-between">
            <div className="font-bold">Feature Importance</div>
            <button
              className=""
              onClick={() => {
                if (isFeature) {
                  setIsFeature((prev) => false)
                }
              }}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Feature Importance 본문 */}
          <FeatureImportance data={featuredData[0]} colors={keyColors} />
        </div>
      )}
      <Chart
        key={chartType}
        type={'line'}
        height={data.options.chart.height}
        width={'100%'}
        options={data.options as unknown as ApexOptions}
        series={data.series as ApexAxisChartSeries | ApexNonAxisChartSeries}
      />
    </div>
  )
}

export default ChartItem
