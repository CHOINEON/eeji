import { Switch } from 'antd'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { colorChipsForStroke } from './Colors'
import { FeatureImpactDataState, graphDataState, RawDataState, selectedFilterState, SymbolState } from './stores/atom'

type TSeries = {
  name: string
  data: Array<string | number> | Array<{ x: string | number; y: string | number }>
  // yaxisIndex?: number  //안먹음...
  type?: 'line' | 'area'
}

const defaultSeries: TSeries[] = [{ name: '', data: [] }]
//공통적으로 사용된 옵션
const defaultOptions: ApexOptions = {
  chart: {
    stacked: false,
    group: 'group',
    zoom: {
      enabled: true,
      type: 'xy',
      autoScaleYaxis: true,
    },
    type: 'line',
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    position: 'front' as const,
  },
  stroke: {
    curve: 'straight' as const,
    width: 1.5,
  },
  yaxis: {
    labels: {
      minWidth: 40,
    },
  },
}

const PredictionChart = () => {
  const symbol = useRecoilValue(SymbolState)
  const graphData = useRecoilValue(graphDataState)
  const rawData = useRecoilValue(RawDataState)
  const featureImpactData = useRecoilValue(FeatureImpactDataState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  // const [bounds, setBounds] = useState<{ lowerBounds: Array<number>; upperBounds: Array<number> }>()
  const [viewInterval, setViewInterval] = useState(true)

  useEffect(() => {
    if (graphData) {
      const initialSeries = [
        {
          name: 'Prediction',
          data: graphData.map((item) => item.pred),
          type: 'line' as const,
        },
        {
          name: 'Ground Truth',
          data: graphData.map((item) => item.ground_truth),
          type: 'line' as const,
        },
        {
          name: 'Upper Bound',
          data: graphData.map((item) => item.upper_bound),
          type: 'area' as const,
        },
        {
          name: 'Lower Bound',
          data: graphData.map((item) => item.lower_bound),
          type: 'area' as const,
        },
      ]
      setSeries1(initialSeries)
    }
  }, [graphData])

  const [series1, setSeries1] = useState<TSeries[]>(defaultSeries)
  const [series2, setSeries2] = useState<TSeries[]>(defaultSeries)

  //   //annotation initialize
  //   ApexCharts.exec('chart-main', 'clearAnnotations')
  //   ApexCharts.exec('chart-sub', 'clearAnnotations')

  //24-11-20 series append/remove를 내장 메서드로 처리하려고 했으나 삭제메서드가 존재하지 않아 re-rendering를 감안하고 updateSeries()로 구현함
  useEffect(() => {
    const newSeries = selectedFilter.selectedFeatures?.map((feature) => ({
      name: feature,
      data: rawData.features[feature]?.map((item) => item.value),
      type: 'line' as const,
    }))
    ApexCharts.exec('chart-sub', 'updateSeries', newSeries)
  }, [selectedFilter.selectedFeatures, symbol.horizons])

  const options1: ApexOptions = {
    ...defaultOptions,
    chart: {
      type: 'line',
      id: 'chart-main',
      events: {
        click(event: MouseEvent, chartContext: any, config: { dataPointIndex: number; globals: any }) {
          const xValue = config.globals?.seriesX[0][config.dataPointIndex]

          //차트 데이터 필터링에 사용하는 상태 변수 업데이트
          setSelectedFilter({
            selectedFeatures: [], //클릭하면 해당 날짜의 local attribution이 렌더링되므로 초기화시킴
            selectedDate: formatTimestampToYYYYMMDD(xValue), //사용자가 선택한 날짜
          })

          //clear annotation before adding new one
          chartContext.removeAnnotation('date-annotation')

          //main chart에 선택된 날짜 annotation 추가
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
        // zoomed: ({ xaxis }: any) => {
        //   console.log('zoomed:', xaxis)
        //   // 'chart-sub'의 xaxis를 업데이트
        //   ApexCharts.exec('chart-main', 'updateOptions', {
        //     xaxis: {
        //       min: xaxis?.min,
        //       max: xaxis?.max,
        //     },
        //   })
        // },
      },
    },
    stroke: {
      curve: 'straight' as const,
      width: [1.5, 1.5, 0, 0, 0],
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
      opacity: [1, 1, 0.2, 1, 1],
      type: 'solid',
    },
    xaxis: {
      type: 'datetime' as const,
      categories: graphData?.map((item) => item.date_pred),
    },
    legend: {
      show: true,
      position: 'top' as const,
      customLegendItems: ['Prediction', 'Ground Truth'],
      onItemClick: {
        toggleDataSeries: true, // Enable toggling of the series
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date(featureImpactData?.date_input).getTime(),
          x2: new Date(featureImpactData?.date).getTime(),
          fillColor: '#FF3200',
        },
      ],
    },
  }

  const options2: ApexOptions = {
    ...defaultOptions,
    chart: {
      id: 'chart-sub',
      // group: 'group',
      // events: {
      //   zoomed: ({ xaxis }: any) => {
      //     // 'chart-main'의 xaxis를 업데이트
      //     ApexCharts.exec('chart-main', 'updateOptions', {
      //       xaxis: {
      //         min: xaxis.min,
      //         max: xaxis.max,
      //       },
      //     })
      //   },
      // },
    },
    xaxis: {
      type: 'datetime' as const,
      categories: graphData?.map((item) => item.date_pred),
    },
    annotations: {
      xaxis: [
        {
          x: new Date(featureImpactData?.date_input).getTime(),
          x2: new Date(featureImpactData?.date).getTime(),
          fillColor: '#FF3200',
        },
      ],
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
        <ReactApexChart options={options1 as ApexOptions} series={series1 as ApexAxisChartSeries} height={350} />

        {/* {selectedFilter?.selectedFeatures?.length > 0 && ( */}
        <ReactApexChart options={options2 as ApexOptions} series={series2 as ApexAxisChartSeries} height={200} />
        {/* )} */}
      </div>
    </div>
  )
}

export default PredictionChart
