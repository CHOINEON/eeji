import { ApexOptions } from 'apexcharts'
import { IRawData, Prediction } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { graphDataState, selectedFilterState, SymbolState } from './stores/atom'

type TSeries = {
  name: string
  data: Array<string | number>
}

const PredictionChart = () => {
  const symbol = useRecoilValue(SymbolState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const graphData = useRecoilValue(graphDataState)
  const defaultSeries = [
    {
      name: 'Prediction',
      data: ReformatData(graphData, 'pred'),
    },
    {
      name: 'Ground Truth',
      data: ReformatData(graphData, 'ground_truth'),
    },
  ]
  const [series, setSeries] = useState<TSeries[]>(defaultSeries)

  useEffect(() => {
    if (selectedFilter.selectedFeatures) {
      setSeries(generateSeries())
    }
  }, [symbol.selectedHorizon, selectedFilter])

  function generateSeries() {
    if (selectedFilter.selectedFeatures) {
      const newSeries = selectedFilter.selectedFeatures.map((feature) => {
        const chartData: IRawData[] = symbol.features[feature]
        return { name: feature, data: ReformatData(chartData, 'value') }
      })
      return [...defaultSeries, ...newSeries]
    }
  }

  function ReformatData(
    data: Prediction[] | IRawData[],
    key: keyof Prediction | keyof IRawData
  ): (Prediction[keyof Prediction] | IRawData[keyof IRawData] | null)[] {
    return (
      data?.map((item) => {
        // Type assertion to ensure item is of the correct type
        const typedItem = item as Prediction | IRawData
        return typedItem[key as keyof typeof typedItem] || null // Return null if the key doesn't exist
      }) || []
    )
  }

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: 'line',
      id: 'areachart-2',
      events: {
        click(event, chartContext, config) {
          const xValue = config.globals?.seriesX[0][config.dataPointIndex]
          console.log('selectedFilter:', selectedFilter)
          setSelectedFilter({
            selectedFeatures: selectedFilter.selectedFeatures,
            selectedDate: formatTimestampToYYYYMMDD(xValue),
          })

          if (xValue) {
            setOptions((prevOptions) => ({
              ...prevOptions,
              annotations: {
                ...prevOptions.annotations,
                xaxis: [
                  {
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
                  },
                ],
              },
            }))
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: 1.5,
    },
    grid: {
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
  })

  useEffect(() => {
    if (graphData?.length) {
      setSeries(generateSeries())
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: ReformatData(graphData, 'date_pred'),
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#FF1654',
            },
            labels: {
              style: {
                // colors: '#FF1654',
              },
            },
            title: {
              // text: 'Pred',
              style: {
                // color: '#FF1654',
              },
            },
          },
          {
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: '#247BA0',
            },
            labels: {
              style: {
                colors: '#247BA0',
              },
            },
            title: {
              style: {
                color: '#247BA0',
              },
            },
          },
        ],
      }))
    }
  }, [graphData])

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options as ApexOptions}
          series={series as ApexAxisChartSeries}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  )
}

export default PredictionChart
