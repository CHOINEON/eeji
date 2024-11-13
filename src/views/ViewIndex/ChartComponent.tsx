import { Switch } from 'antd'
import { ApexOptions } from 'apexcharts'
import IndexApi from 'apis/IndexApi'
import { IPredictionConfidenceInterval, IRawData, Prediction } from 'apis/type/IndexResponse'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { colorChipsForStroke } from './Colors'
import { graphDataState, selectedFilterState, SymbolState } from './stores/atom'

type TSeries = {
  name: string
  data: Array<string | number> | Array<{ x: string | number; y: string | number }>
  // yaxisIndex?: number  //안먹음...
  type?: 'line' | 'area'
}

const PredictionChart = () => {
  const symbol = useRecoilValue(SymbolState)
  const graphData = useRecoilValue(graphDataState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [bounds, setBounds] = useState<{ lowerBounds: Array<number>; upperBounds: Array<number> }>()
  const [viewInterval, setViewInterval] = useState(true)

  const defaultSeries = [
    {
      name: 'Prediction',
      data: ReformatData(graphData, 'pred'),
      type: 'line' as const,
    },
    {
      name: 'Ground Truth',
      data: ReformatData(graphData, 'ground_truth'),
      type: 'line' as const,
    },
  ]

  const [series1, setSeries1] = useState<TSeries[]>(defaultSeries)
  const [series2, setSeries2] = useState<TSeries[]>([])

  const { data: confidenceIntervalData } = useQuery(
    ['confidenceIntervalData', symbol.symbol_id, symbol.selectedHorizon],
    () => IndexApi.getPredictionConfidenceInterval(symbol.symbol_id, symbol.selectedHorizon.toString()),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
    }
  )

  useEffect(() => {
    if (symbol.dates?.length > 0) {
      initializeSeries()

      ApexCharts.exec('chart-main', 'updateOptions', {
        xaxis: {
          categories: symbol?.dates,
        },
      })
    }
  }, [symbol.dates, graphData])

  //horizon, selected date (필터 값) 업데이트 될 때마다 초기화
  useEffect(() => {
    if (selectedFilter.selectedFeatures) {
      // generateFeatureSeries()
    }
    initializeSeries()
  }, [graphData, bounds, symbol.selectedHorizon, selectedFilter])

  useEffect(() => {
    if (symbol.dates?.length > 0 && graphData && confidenceIntervalData) {
      // const dateArr = graphData?.map((item) => item.date_pred)
      const dateArr = symbol.dates

      const lowerBounds = dateArr.map((date) => {
        return (
          confidenceIntervalData?.confidence_interval.filter((item) => item.date_pred === date)[0]?.lower_bound ?? null
        )
      })
      const upperBounds = dateArr.map((date) => {
        return (
          confidenceIntervalData?.confidence_interval.filter((item) => item.date_pred === date)[0]?.upper_bound ?? null
        )
      })

      setBounds({ lowerBounds, upperBounds })
    }
  }, [graphData, confidenceIntervalData])

  const initializeSeries = () => {
    setSeries1([
      ...defaultSeries,
      {
        name: 'Upper Bound',
        data: bounds?.upperBounds,
        type: 'area' as const,
      },
      {
        name: 'Lower Bound',
        data: bounds?.lowerBounds,
        type: 'area' as const,
      },
    ])
  }

  useEffect(() => {
    if (selectedFilter?.selectedFeatures) {
      updateFeatureSeries()
    }
  }, [selectedFilter])

  // useEffect(() => {
  //   ApexCharts.exec('chart-main', 'updateOptions', {
  //     xaxis: {
  //       categories: symbol.dates,
  //     },
  //   })
  // }, [symbol.dates])

  // useEffect(() => {
  //   console.log(series2)
  // }, [series2])

  //TODO: 다시 연결 작업중
  function updateFeatureSeries() {
    if (selectedFilter.selectedFeatures?.length > 0) {
      const newSeries = selectedFilter.selectedFeatures.map((feature, idx: number) => {
        //rawData의 x값 범위에 맞추기로 협의함(24.11.13)
        const chartData: IRawData[] = symbol.features[feature]

        return {
          name: feature,
          data: ReformatData(chartData, 'value'),
          type: 'line' as const,
          // color: colorChipsForStroke[idx],
        }
      })
      setSeries2(newSeries)
    }
  }

  function ReformatData(
    data: Prediction[] | IRawData[] | IPredictionConfidenceInterval[],
    key: keyof Prediction | keyof IRawData | keyof IPredictionConfidenceInterval
  ): (
    | Prediction[keyof Prediction]
    | IRawData[keyof IRawData]
    | IPredictionConfidenceInterval[keyof IPredictionConfidenceInterval]
    | null
  )[] {
    const result = symbol.dates
      ?.map((d) =>
        (data as (Prediction | IRawData | IPredictionConfidenceInterval)[]).find(
          (item) => 'date_pred' in item && item.date_pred === d // Type guard to check for date_pred
        )
      )
      ?.map((item) => item?.[key as keyof typeof item] || null)

    return result
  }

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      stacked: false,
      group: 'group',
      height: 250,
      zoom: {
        enabled: true, // 확대/축소 기능 활성화
        type: 'x', // x축 기준 확대/축소 ('x', 'y', 'xy' 중 선택 가능)
        autoScaleYaxis: true, // 확대/축소 시 y축 자동 스케일링
      },
      type: 'line',
      id: 'chart-main',
      events: {
        click(event, chartContext, config) {
          const xValue = config.globals?.seriesX[0][config.dataPointIndex]
          setSelectedFilter({
            selectedFeatures: selectedFilter.selectedFeatures,
            selectedDate: formatTimestampToYYYYMMDD(xValue),
          })

          //clear annotation before adding new one
          chartContext.removeAnnotation('date-annotation')

          if (xValue) {
            chartContext.addXaxisAnnotation({
              id: 'date-annotation',
              x: xValue,
              borderColor: '#FF4560',
              strokeDashArray: 4,
              label: {
                borderColor: '#FF4560',
                style: {
                  color: '#fff',
                  background: '#FF4560',
                },
                text: `${new Date(xValue).toLocaleDateString()}`,
              },
            })
          }
        },
      },
    },
    stroke: {
      curve: 'straight',
      width: [1.5, 1.5, 0, 0],
      colors: colorChipsForStroke?.slice(0, series1?.length + 1),
    },
    fill: {
      colors: [
        '#008FFB', //prediction(blue)
        '#FFFFFF', //ground truth(white)
        '#008FFB', //upper bounds (prediction과 색상 맞춤)
        '#FFFFFF', //lower bounds (white)
        '#FFFFFF', //왜 다섯개여야 하는지 모르겠음...이해 안됨..
      ],
      opacity: [1, 1, 0.2, 1],
      type: 'solid',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 0,
      position: 'front',
      // padding: {
      //   right: 30,
      //   left: 20,
      //   bottom: 30,
      // },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: [
      {
        title: {
          text: 'Prediction / Ground Truth',
        },
      },
    ],
    legend: {
      show: true,
      customLegendItems: ['Prediction', 'Ground Truth'],
    },
  })

  // Define independent options for `chart-sub`
  const options2: ApexOptions = {
    chart: {
      id: 'chart-sub',
      group: 'group',
      type: 'line',
      height: 100,
      zoom: {
        enabled: true, // 확대/축소 기능 활성화
        type: 'x', // x축 기준 확대/축소 ('x', 'y', 'xy' 중 선택 가능)
        autoScaleYaxis: true, // 확대/축소 시 y축 자동 스케일링
      },
    },
    // colors: colorChipsForStroke.slice(0, series2.length),
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Features',
      },
      // Ensure the y-axis is set to allow for the data range
    },
    grid: {
      strokeDashArray: 0,
      position: 'front',
      // padding: {
      //   right: 30,
      //   left: 20,
      //   bottom: 30,
      // },
    },
  }

  const onSwitchChange = (value: boolean) => {
    setViewInterval(value)

    if (value) {
      ApexCharts.exec('chart-main', 'showSeries', 'Upper Bound')
      ApexCharts.exec('chart-main', 'showSeries', 'Lower Bound')
    } else {
      ApexCharts.exec('chart-main', 'hideSeries', 'Upper Bound')
      ApexCharts.exec('chart-main', 'hideSeries', 'Lower Bound')
    }
  }

  //전체 날짜에서 값이 빠진 부분 null로 채워 반환
  const fillNullData = (data: IRawData[]) => {
    const dates = ReformatData(graphData, 'date_pred')

    const result = dates.map((date) => {
      const found = data.find((item) => item.date === date)
      return found ? found.value : null
    })
  }

  // 최신 graphData를 참조하는 tooltip.custom 함수 생성
  const customTooltip = useCallback(
    ({ series, dataPointIndex, w }: { series: ApexAxisChartSeries; dataPointIndex: number; w: any }) => {
      // graphData에서 해당 날짜에 맞는 데이터 찾기
      const xValue = dayjs(w.globals.seriesX[0][dataPointIndex]).format('YYYY-MM-DD')
      const filteredGraphData = graphData?.filter((item) => item?.date_pred === xValue)

      //Prediction, Ground Truth, Upper Bound, Lower Bound 순서로 series 데이터 들어있음
      const seriesData = w.globals.series
        ?.map((s: number[], i: number) => {
          if (w.globals.seriesNames[i] === 'Prediction' || w.globals.seriesNames[i] === 'Ground Truth')
            return `<div className="text-[10px]"><strong>${w.globals.seriesNames[i]}:</strong> ${s[dataPointIndex]}</div>`
        })
        .join('')

      return `
      <div style="
        background: white; 
        padding: 10px; 
        border-radius: 5px; 
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
        color: black;
      ">
        ${seriesData}
        <div className="text-[8px]">(Forecast at ${filteredGraphData[0]?.date})</div>
      </div>
    `
    },
    [graphData]
  )

  useEffect(() => {
    ApexCharts.exec('chart-main', 'updateOptions', {
      tooltip: {
        custom: customTooltip,
      },
    })
  }, [customTooltip])

  return (
    <div>
      <div className="flex flex-row justify-end">
        <span className="mr-2">Confidence Interval</span>
        <Switch onChange={onSwitchChange} checkedChildren="on" unCheckedChildren="off" value={viewInterval} />
      </div>
      <div id="chart">
        <ReactApexChart options={options as ApexOptions} series={series1 as ApexAxisChartSeries} />
        {/* <ReactApexChart options={options2 as ApexOptions} series={series2 as ApexAxisChartSeries} /> */}
      </div>
    </div>
  )
}

export default PredictionChart
