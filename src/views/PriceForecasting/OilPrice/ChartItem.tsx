'use client'
import { ApexOptions } from 'apexcharts'
import axios from 'axios'
// import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

// const ChartItem = (props: String) => {
const ChartItem = () => {
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

  useEffect(() => {
    axios
      // .get(`https://ineeji-solution-tf.du.r.appspot.com/api/index_predict/get_symbol_predict/admin?is_daily=1&symbol=${symbol}`)
      .get(`/api/index_predict/get_symbol_predict/admin?is_daily=1&symbol=${symbol}`)
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
    setSymbol((prev) => e.target.value)
  }

  const data = {
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
      chart: {
        type: chartType === 'area',
        height: '100%',
        zoom: {
          autoScaleYaxis: true,
        },
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
      selection: 'one_month',
    },
  }

  return (
    // <div className="bg-white border border-[#D5DCEF] rounded-xl p-3 h-[calc(100%-20px)]">
    <div className="bg-white border border-[#D5DCEF] rounded-xl pt-12 pb-5 px-3 h-full relative">
      <select
        className="absolute top-3 z-[1000] bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 mr-3"
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
      <Chart
        key={chartType}
        type={'area'}
        height={data.options.chart.height}
        width={'100%'}
        options={data.options as unknown as ApexOptions}
        series={data.series as ApexAxisChartSeries | ApexNonAxisChartSeries}
      />
    </div>
  )
}

export default ChartItem
