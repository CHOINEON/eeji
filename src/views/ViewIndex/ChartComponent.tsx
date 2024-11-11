import { ApexOptions } from 'apexcharts'
import IndexApi from 'apis/IndexApi'
import { IPredictionConfidenceInterval, IRawData, Prediction } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { colorChips } from './Colors'
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
    ...(bounds?.lowerBounds && bounds?.upperBounds
      ? [
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
        ]
      : []),
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
    if (graphData && bounds) {
      setSeries([
        {
          name: 'Prediction',
          data: ReformatData(graphData, 'pred'),
          yaxisIndex: 0,
          type: 'line',
        },
        {
          name: 'Ground Truth',
          data: ReformatData(graphData, 'ground_truth'),
          yaxisIndex: 0,
          type: 'line',
        },
        {
          name: 'Upper Bound',
          data: bounds.upperBounds,
          yaxisIndex: 0,
          type: 'area',
        },
        {
          name: 'Lower Bound',
          data: bounds.lowerBounds,
          yaxisIndex: 0,
          type: 'area',
        },
      ])
    }
  }, [graphData, bounds])

  useEffect(() => {
    if (graphData && confidenceIntervalData) {
      const dateArr = graphData?.map((item) => item.date_pred)
      const bounds = getBounds(dateArr, confidenceIntervalData?.confidence_interval)

      setBounds(bounds)
    }
  }, [graphData, confidenceIntervalData])

  function getBounds(arr: string[], data: IPredictionConfidenceInterval[]): any {
    const dataDict: { [key: string]: IPredictionConfidenceInterval } = {}
    data.forEach((entry) => (dataDict[entry.date_pred] = entry))

    // Iterate over arr and retrieve lower_bound if the date exists in dataDict
    const lowerBounds = arr.map((date) => dataDict[date]?.lower_bound ?? null)
    const upperBounds = arr.map((date) => dataDict[date]?.upper_bound ?? null)

    return { lowerBounds, upperBounds }
  }

  useEffect(() => {
    if (selectedFilter.selectedFeatures) {
      setSeries(generateFeatureSeries() as TSeries[])
    }
  }, [symbol.selectedHorizon, selectedFilter])

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
          color: colorChips[(defaultSeries.length + idx) % colorChips.length],
        }
      })
      return [...defaultSeries, ...newSeries]
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
      id: 'areachart-2',
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

            // setOptions((prevOptions) => ({
            //   ...prevOptions,
            //   annotations: {
            //     ...prevOptions.annotations,
            //     xaxis: [
            //       {
            //         x: xValue,
            //         borderColor: '#FF4560',
            //         strokeDashArray: 4,
            //         label: {
            //           borderColor: '#FF4560',
            //           style: {
            //             color: '#fff',
            //             background: '#FF4560',
            //           },
            //           text: `${new Date(xValue).toLocaleDateString()}`,
            //         },
            //       },
            //     ],
            //   },
            // }))
          }
        },
      },
    },
    fill: {
      colors: ['#008FFB', '#00E396', '#008FFB', '#FFFFFF'],
      opacity: [1, 1, 0.1, 1],
      type: 'solid',
    },
    stroke: {
      curve: 'straight',
      width: 1,
      dashArray: [0, 0, 4, 4],
      colors: colorChips.slice(0, series.length),
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
      categories: [],
    },
    legend: {
      show: true,
    },
  })

  useEffect(() => {
    if (graphData?.length) {
      setSeries(generateFeatureSeries() as TSeries[])
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: ReformatData(graphData, 'date_pred'),
        },
      }))
    }
  }, [graphData])

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options as ApexOptions} series={series as ApexAxisChartSeries} height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  )
}

export default PredictionChart
