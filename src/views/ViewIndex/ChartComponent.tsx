import { ApexOptions } from 'apexcharts'
import { Prediction } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { graphDataState, selectedIndexState } from './stores/atom'

const PredictionChart = () => {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState)
  const graphData = useRecoilValue(graphDataState)

  function ReformatData(data: Prediction[], key: keyof Prediction) {
    return data?.map((item) => item[key]) || []
  }

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: 'line',
      id: 'areachart-2',
      events: {
        click(event, chartContext, config) {
          const xValue = config.globals?.seriesX[0][config.dataPointIndex]
          setSelectedIndex({ ...selectedIndex, selectedDate: xValue })

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

  const [series, setSeries] = useState([
    {
      name: 'Prediction',
      data: ReformatData(graphData, 'pred'),
    },
    {
      name: 'Ground Truth',
      data: ReformatData(graphData, 'ground_truth'),
    },
  ])

  useEffect(() => {
    if (graphData?.length) {
      const newSeries = [
        {
          name: 'Prediction',
          data: ReformatData(graphData, 'pred'),
        },
        {
          name: 'Ground Truth',
          data: ReformatData(graphData, 'ground_truth'),
        },
      ]
      setSeries(newSeries)
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
