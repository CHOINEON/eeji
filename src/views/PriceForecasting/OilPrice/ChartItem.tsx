import axios from 'axios'
import { ApexOptions } from 'apexcharts'
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
// // import ApexCharts from 'apexcharts'
// // Removed the unnecessary import statement for ApexCharts
// // import { ApexCharts } from 'apexcharts'

const ChartItem = (props: any) => {
  // console.log('id', props)
  // TODO 2024-03-06 심볼명, 심볼설명 배열 생성
  const [chartType, setChartType] = useState('candle')
  const symbolList = [
    {
      symbol: 'BCOMZS.INDX',
      description: 'Bloomberg Zinc Subindex',
    },
    {
      symbol: 'BCOMNI.INDX',
      description: 'Bloomberg Nickel Subindex',
    },
    {
      symbol: 'BCOMNG.INDX',
      description: 'Bloomberg Natural Gas Subindex',
    },
    {
      symbol: 'BCOMHG.INDX',
      description: 'Bloomberg Copper Subindex',
    },
    {
      symbol: 'BCOMGC.INDX',
      description: 'Bloomberg Gold Subindex',
    },
    {
      symbol: 'BCOMCO.INDX',
      description: 'Bloomberg Brent Crude Subindex',
    },
    {
      symbol: 'BCOMCL.INDX',
      description: 'Bloomberg WTI Crude Oil Subindex',
    },
    {
      symbol: 'BCOMAL.INDX',
      description: 'Bloomberg Aluminum Subindex',
    },
  ]

  // https://ineeji-solution-tf.du.r.appspot.com/api/index_predict/get_symbol_predict/admin?is_daily=1&symbol=BCOMAL.INDX

  const [symbol, setSymbol] = useState('BCOMZS.INDX')
  const [truthData, setTruthData] = useState<(number | null)[][]>([])
  const [predictData, setPredictData] = useState<(number | null)[][]>([])
  const [selection, setSelection] = useState('all')
  const [isFeature, setIsFeature] = useState(false)
  useEffect(() => {
    if (props.is_reset) {
      setIsFeature((prev) => false)
    }
  }, [props.is_reset])
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_NEW_API_SERVER_URL}/api/index_predict/get_symbol_predict/admin?is_daily=1&symbol=${symbol}`
      )
      .then(({ data }) => {
        console.log(data)
        // TODO 2024-03-07 '2024-02-06' 형식을 unix timestamp로 변환

        setTruthData([])
        setPredictData([])

        let tmpCnt = 0

        data.map((item: any) => {
          const date = new Date(item.date).getTime()
          // TODO truth Data 초기화
          setTruthData((prev) => [...prev, [date, item.ground_truth]])
          if (tmpCnt > 0) {
            setPredictData((prev) => [...prev, [date, item.pred_1]])
          } else {
            // TODO 첫 번째 배열에는 동일한 값을 넣는다.
            setPredictData((prev) => [...prev, [date, item.ground_truth]])
          }
          const value2 = item.pred_1
          // TODO predict Data 초기화
          tmpCnt++
        }, [])
        // TODO 마지막 배열에 pred_1~pred_5까지의 값을 넣는다.
        for (let i = 1; i < 6; i++) {
          const date = new Date(data[data.length - 1].date).getTime() + 86400000 * i
          setPredictData((prev) => [...prev, [date, data[data.length - 1][`pred_${i}`]]])

          // TODO truth
          setTruthData((prev) => [...prev, [date, null]])
        }
      })
      .catch((error) => console.error(error))
      .then(() => {
        //
      })
  }, [symbol])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target)
    setSelection((prev) => 'all')
    setSymbol((prev) => e.target.value)
  }

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
        // markers: {
        //   size: [selection === 'all' ? 0 : 4],
        // },
        colors: ['#64d33f', '#372dd5'], // line color
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
              x: predictData?.length > 0 ? predictData[predictData?.length - 6][0] : 0, // 세로 Border 출력
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
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
    }
  }, [chartType, props.chart_id, predictData, truthData])

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
        <select
          className=" bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 mr-3"
          onChange={handleSelect}
        >
          {symbolList.map((item, index) => {
            return (
              <option key={index} value={item.symbol}>
                {item.description}
              </option>
            )
          })}
        </select>
        <div className="flex space-x-3 mt-2">
          <div
            className={`cursor-pointer text-[12px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'one_week' ? 'bg-[#D5DCEF]' : 'bg-white'
            }`}
            onClick={() => {
              updateChart('one_week')
            }}
          >
            1W
          </div>
          <div
            className={`cursor-pointer text-[12px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'one_month' ? 'bg-[#D5DCEF]' : 'bg-white'
            }`}
            onClick={() => {
              updateChart('one_month')
            }}
          >
            1M
          </div>
          <div
            className={`cursor-pointer text-[12px] border border-[#D5DCEF] px-2 py-1 ${
              selection === 'all' ? 'bg-[#D5DCEF]' : 'bg-white'
            }`}
            onClick={() => {
              updateChart('all')
            }}
          >
            ALL
          </div>
        </div>
      </div>
      {isFeature ? (
        <div
          className={`absolute top-3 z-[1000] right-3 bg-white border-solid border border-primary font-bold py-2 px-4 cursor-pointer rounded-xl text-sm transition-all bg-[#E5EBFF] text-[#372dd5] border-[#372dd5] select-none`}
          onClick={() => {
            setIsFeature((prev) => !isFeature)
          }}
        >
          Feature Importance
        </div>
      ) : (
        <div
          className={`absolute top-3 z-[1000] right-3 bg-white border-solid border border-[#D5DCEF] border-primary text-primary font-bold py-2 px-4 cursor-pointer rounded-xl text-sm transition-all hover:bg-[#E5EBFF] hover:text-[#372dd5] hover:border-[#372dd5] select-none`}
          onClick={() => {
            setIsFeature((prev) => !isFeature)
          }}
        >
          Feature Importance
        </div>
      )}

      {isFeature && (
        <div className="absolute right-3 top-[90px] px-4 py-2 rounded-xl z-[1000] bg-white border-[#372dd5] border w-[calc(100%-25px)] max-w-[500px] shadow-md">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Feature Importance 본문 */}
          <div></div>
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
