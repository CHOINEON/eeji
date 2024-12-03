import { Switch } from 'antd'
import ApexCharts, { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formatTimestampToYYYYMMDD } from 'utils/DateFunction'
import { colorChipsForStroke } from './Colors'
import { FeatureImpactDataState, graphDataState, RawDataState, selectedFilterState } from './stores/atom'

type TSeries = {
  name: string
  data: Array<string | number> | Array<{ x: string | number; y: string | number }>
  // yaxisIndex?: number  //안먹음...
  type?: 'line' | 'area'
}

const defaultSeries: TSeries[] = [{ name: '', data: [] }]

const PredictionChart = () => {
  const graphData = useRecoilValue(graphDataState)
  const rawData = useRecoilValue(RawDataState)
  const featureImpactData = useRecoilValue(FeatureImpactDataState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [viewInterval, setViewInterval] = useState(false)
  const [disableCI, setDisableCI] = useState(false)
  const [zoomRange, setZoomRange] = useState<{ min: number | undefined; max: number | undefined }>({
    min: undefined,
    max: undefined,
  })

  //공통적으로 사용된 옵션
  const defaultOptions: ApexOptions = {
    chart: {
      type: 'line' as const,
      group: 'group',
      stacked: false,
      redrawOnParentResize: false,
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
  }

  const [series1, setSeries1] = useState<TSeries[]>(defaultSeries)
  const [series2, setSeries2] = useState<TSeries[]>(defaultSeries)

  useEffect(() => {
    if (graphData) {
      const temp: { prediction: number[]; groundTruth: number[]; upperBound: number[]; lowerBound: number[] } = {
        prediction: [],
        groundTruth: [],
        upperBound: [],
        lowerBound: [],
      }

      graphData.map((item) => {
        temp.prediction.push(item.pred)
        temp.groundTruth.push(item.ground_truth)
        temp.upperBound.push(item.upper_bound)
        temp.lowerBound.push(item.lower_bound)
      })

      const initialSeries = [
        {
          name: 'Prediction',
          data: temp?.prediction,
          type: 'line' as const,
        },
        {
          name: 'Ground Truth',
          data: temp?.groundTruth,
          type: 'line' as const,
        },
        {
          name: 'Upper Bound',
          data: temp?.upperBound,
          type: 'area' as const,
        },
        {
          name: 'Lower Bound',
          data: temp?.lowerBound,
          type: 'area' as const,
        },
      ]
      if (JSON.stringify(initialSeries) !== JSON.stringify(series1)) {
        setSeries1(initialSeries)
      }
    }

    //zoom 초기화
    resetZoom()

    setViewInterval(selectedFilter.has_ci)
    setDisableCI(!selectedFilter.has_ci)
  }, [graphData])

  const resetZoom = () => {
    ApexCharts.exec('chart-main', 'updateOptions', {
      xaxis: {
        min: undefined,
        max: undefined,
      },
      yaxis: {
        min: undefined, // 전체 데이터의 최소값으로 갱신
        max: undefined, // 전체 데이터의 최대값으로 갱신
      },
    })

    ApexCharts.exec('chart-sub', 'updateOptions', {
      xaxis: {
        min: undefined,
        max: undefined,
      },
      yaxis: {
        min: undefined, // 전체 데이터의 최소값으로 갱신
        max: undefined, // 전체 데이터의 최대값으로 갱신
      },
    })
    setZoomRange({ min: undefined, max: undefined })
  }

  //24-11-20 series append/remove를 내장 메서드로 처리하려고 했으나 삭제메서드가 존재하지 않아 re-rendering를 감안하고 updateSeries()로 구현함
  useEffect(() => {
    if (Object.keys(rawData).length > 0) {
      const newSeries = selectedFilter.selectedFeatures?.map((feature) => ({
        name: feature,
        data: rawData?.features[feature]?.map((item) => item.value),
        type: 'line' as const,
      }))
      // updateSeries()를 호출하니까 차트 전체가 re-render되면서 defaultSeries가 다시 할당됨
      // 문제는 updateSeries()를 통해서 series가 override하는데, 이전 상태 값과 동일해서 이 부분 리렌더가 제대로 이루어지지 않음(나중에 버그리포팅...?)
      // 따라서 차트 내부 데이터만 업데이트하는 방법으로 구현함
      setSeries2(newSeries)
    }
  }, [selectedFilter.selectedFeatures])

  const options1: ApexOptions = useMemo(
    () => ({
      ...defaultOptions,
      chart: {
        type: 'line' as const,
        id: 'chart-main',
        zoom: {
          enabled: true,
          type: 'xy',
          autoScaleYaxis: true,
        },
        toolbar: {
          show: true,
          tools: {
            reset: true,
          },
        },
        events: {
          zoomed: (chartContext, { xaxis }) => {
            setZoomRange({ min: xaxis.min, max: xaxis.max })
            // 서브 차트의 xaxis 업데이트
            ApexCharts.exec('chart-sub', 'updateOptions', {
              xaxis: {
                min: xaxis?.min || undefined,
                max: xaxis?.max || undefined,
              },
            })
          },
          click(event, chartContext, config) {
            const xValue = config.globals?.seriesX[0][config.dataPointIndex]
            setSelectedFilter({
              selectedFeatures: selectedFilter.selectedFeatures,
              selectedDate: xValue ? formatTimestampToYYYYMMDD(xValue) : '',
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
        curve: 'straight' as const,
        width: [1.5, 1.5, 0, 0, 0],
        colors: colorChipsForStroke?.slice(0, series1?.length + 1),
      },
      fill: {
        colors: [
          '#FF7F00', //prediction(blue)
          '#FFFFFF', //ground truth(white)
          '#FF7F00', //upper bounds (prediction과 색상 맞춤)
          '#FFFFFF', //lower bounds (white)
          '#FFFFFF', //왜 다섯개여야 하는지 모르겠음...이해 안됨..
        ],
        opacity: [1, 1, 0.2, 1, 1],
        type: 'solid',
      },
      legend: {
        show: true,
        position: 'top' as const,
        offsetY: 10,
        customLegendItems: ['Prediction', 'Ground Truth'],
        markers: {
          fillColors: ['#FF7F00', '#008FFB'],
        },
        onItemClick: {
          toggleDataSeries: false, // Enable toggling of the series
        },
      },
      xaxis: {
        type: 'datetime' as const,
        // title: {
        //   text: '날짜', // X축 레이블
        // },
        min: zoomRange?.min || undefined,
        max: zoomRange?.max || undefined,
        categories: graphData?.map((item) => item.date_pred),
      },
      // yaxis: {
      //   title: {
      //     rotate: 0, // 회전 각도 (0으로 설정하면 가로로 표시됨)
      //     offsetX: 40, // 타이틀을 X축 기준으로 이동 (필요시 조정)
      //     offsetY: -160, // 타이틀을 위로 이동 (양수: 아래로 이동, 수: 위로 이동)
      //     text: `(${symbol.unit})`,
      //   },
      // },
    }),
    [graphData, series1]
  )

  const options2: ApexOptions = useMemo(
    () => ({
      ...defaultOptions,
      chart: {
        id: 'chart-sub',
        zoom: {
          enabled: true, // 줌 활성화
          type: 'xy', // x축, y축 모두 줌 가능
          autoScaleYaxis: true, // 줌에 따라 Y축 스케일 자동 조정
        },
        toolbar: {
          show: false, // 툴바 표시
          tools: {
            reset: true, // 초기화 버튼 활성화
          },
        },
        events: {
          zoomed: (chartContext, { xaxis }) => {
            setZoomRange({ min: xaxis?.min || undefined, max: xaxis?.max || undefined })
            // 서브 차트의 xaxis 업데이트
            ApexCharts.exec('chart-main', 'updateOptions', {
              xaxis: {
                min: xaxis?.min || undefined,
                max: xaxis?.max || undefined,
              },
            })
          },
        },
      },
      legend: {
        offsetY: 5,
      },
      zoom: {
        enabled: false, // 줌 비활성화
        autoScaleYaxis: true, // 줌에 따라 Y축 스케일 자동 조정
      },
      xaxis: {
        type: 'datetime' as const,
        // title: {
        //   text: '날짜', // X축 레이블
        // },
        categories: graphData?.map((item) => item.date_pred),
        min: zoomRange?.min || undefined,
        max: zoomRange?.max || undefined,
      },

      annotations: {
        xaxis: [
          {
            x: new Date(featureImpactData?.date_input).getTime(),
            x2: new Date(featureImpactData?.date).getTime(),
            fillColor: '#FF3200',
            label: {
              text: featureImpactData?.date ? '입력 구간' : '',
              orientation: 'horizontal',
              style: {
                color: 'black',
                borderColor: '#FFF',
              },
            },
          },
        ],
      },
    }),
    [graphData, featureImpactData]
  )

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
          if (w.globals.seriesNames[i] === 'Prediction' || w.globals.seriesNames[i] === 'Ground Truth') {
            if (w.globals.seriesNames[i] && s[dataPointIndex]) {
              return `<div className="text-[10px]"><strong>${w.globals.seriesNames[i]}:</strong> ${s[dataPointIndex]}</div>`
            } else {
              null
            }
          }
          return `<div className="text-[10px]"><strong>${w.globals.seriesNames[i]}:</strong> ${s[dataPointIndex]}</div>`
        })
        .join('')

      return filteredGraphData[0]?.date
        ? `
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
        : null
    },
    [graphData]
  )

  useEffect(() => {
    ApexCharts.exec('chart-main', 'updateOptions', {
      tooltip: {
        custom: customTooltip,
      },
    })
  }, [customTooltip, options1])

  return (
    <div>
      <div className="flex flex-row justify-end mb-2">
        <span className="mr-2">Confidence Interval</span>
        <Switch
          onChange={onSwitchChange}
          checkedChildren="on"
          unCheckedChildren="off"
          value={viewInterval}
          disabled={disableCI}
        />
      </div>
      <div id="chart">
        <ReactApexChart
          options={options1 as ApexOptions}
          series={series1 as ApexAxisChartSeries}
          height={350}
          type="line"
        />

        {selectedFilter?.selectedFeatures?.length > 0 && (
          <ReactApexChart
            options={options2 as ApexOptions}
            series={series2 as ApexAxisChartSeries}
            height={250}
            type="line"
          />
        )}
      </div>
    </div>
  )
}

export default PredictionChart
