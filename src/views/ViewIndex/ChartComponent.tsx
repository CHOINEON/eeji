import { Switch } from 'antd'
import { ApexOptions } from 'apexcharts'
import IndexApi from 'apis/IndexApi'
import { IPredictionConfidenceInterval, IRawData, Prediction } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { colorChipsForFill, colorChipsForStroke } from './Colors'
import { graphDataState, selectedFilterState, SymbolState } from './stores/atom'

type TSeries = {
  name: string
  data: Array<string | number>
  yaxisIndex: number
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
      yaxisIndex: 0,
    },
    {
      name: 'Ground Truth',
      data: ReformatData(graphData, 'ground_truth'),
      type: 'line' as const,
      yaxisIndex: 0,
    },
  ]
  const [series, setSeries] = useState<TSeries[]>(defaultSeries)

  const { data: confidenceIntervalData } = useQuery(
    ['confidenceIntervalData', symbol.symbol_id, symbol.selectedHorizon],
    () => IndexApi.getPredictionConfidenceInterval(symbol.symbol_id, symbol.selectedHorizon.toString()),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
    }
  )

  useEffect(() => {
    if (graphData?.length) {
      initializeSeries()

      ApexCharts.exec('chart-main', 'updateOptions', {
        xaxis: {
          categories: ReformatData(graphData, 'date_pred'),
        },
      })
    }
  }, [graphData, bounds])

  //horizon, selected date (필터 값) 업데이트 될 때마다 초기화
  useEffect(() => {
    if (selectedFilter.selectedFeatures) {
      initializeSeries()
    }
  }, [symbol.selectedHorizon, selectedFilter])

  useEffect(() => {
    if (graphData && confidenceIntervalData) {
      const dateArr = graphData?.map((item) => item.date_pred)

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
    setSeries([
      ...defaultSeries,
      {
        name: 'Upper Bound',
        data: bounds?.upperBounds,
        type: 'area' as const,
        yaxisIndex: 0,
      },
      {
        name: 'Lower Bound',
        data: bounds?.lowerBounds,
        type: 'area' as const,
        yaxisIndex: 0,
      },
    ])
  }

  //TODO: 다시 연결 작업중
  function generateFeatureSeries() {
    if (selectedFilter.selectedFeatures) {
      const newSeries = selectedFilter.selectedFeatures.map((feature, idx: number) => {
        const chartData: IRawData[] = symbol.features[feature]
        return {
          key: idx,
          name: feature,
          data: ReformatData(chartData, 'value'),
          yaxisIndex: 1,
          type: 'line',
        }
      })
      return [...series, ...newSeries]
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
    return (
      data?.map((item) => {
        // Type assertion to ensure item is of the correct type
        const typedItem = item as Prediction | IRawData | IPredictionConfidenceInterval
        return typedItem[key as keyof typeof typedItem] || null // Return null if the key doesn't exist
      }) || []
    )
  }

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      stacked: false,
      height: 350,
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
      colors: colorChipsForStroke.slice(0, series.length + 1),
    },
    fill: {
      colors: colorChipsForFill.slice(0, series.length),
      opacity: [1, 1, 0.2, 1],
      type: 'solid',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 0,
      position: 'front',
      padding: {
        right: 30,
        left: 20,
        bottom: 30,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    legend: {
      show: true,
      customLegendItems: ['Prediction', 'Ground Truth'],
    },
  })

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

  return (
    <div>
      <div className="flex flex-row justify-end">
        <span className="mr-2">Confidence Interval</span>
        <Switch onChange={onSwitchChange} checkedChildren="on" unCheckedChildren="off" value={viewInterval} />
      </div>
      <div id="chart">
        <ReactApexChart options={options as ApexOptions} series={series as ApexAxisChartSeries} height={350} />
      </div>
    </div>
  )
}

export default PredictionChart
