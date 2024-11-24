import { Switch } from 'antd'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

const PredictionChart = () => {
  const symbol = useRecoilValue(SymbolState)
  const graphData = useRecoilValue(graphDataState)
  const rawData = useRecoilValue(RawDataState)
  const featureImpactData = useRecoilValue(FeatureImpactDataState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [viewInterval, setViewInterval] = useState(false)
  const [disableCI, setDisableCI] = useState(false)
  const [zoomRange, setZoomRange] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  })

  //공통적으로 사용된 옵션
  const defaultOptions: ApexOptions = {
    chart: {
      type: 'line',
      group: 'group',
      stacked: false,
      toolbar: {
        show: true, // 툴바 표시
        tools: {
          reset: true, // 초기화 버튼 활성화
        },
      },
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

    setViewInterval(selectedFilter.has_ci)
    setDisableCI(!selectedFilter.has_ci)
  }, [graphData])

  useEffect(() => {
    //initialize zooming and selected dates
    setZoomRange({ min: null, max: null })
  }, [symbol.selectedHorizon])

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

      //기존에 있던 chart-main의 줌 범위 적용
      ApexCharts.exec('chart-sub', 'updateOptions', {
        xaxis: {
          min: zoomRange.min,
          max: zoomRange.max,
        },
      })
    }
  }, [selectedFilter.selectedFeatures])

  const options1: ApexOptions = useMemo(
    () => ({
      ...defaultOptions,
      chart: {
        type: 'line',
        id: 'chart-main',
        zoom: {
          enabled: true, // 줌 활성화
          type: 'xy', // x축, y축 모두 줌 가능
          autoScaleYaxis: true, // 줌에 따라 Y축 스케일 자동 조정
        },
        events: {
          zoomed: (chartContext, { xaxis }) => {
            setZoomRange({ min: xaxis.min, max: xaxis.max })
            // 서브 차트의 xaxis 업데이트
            ApexCharts.exec('chart-sub', 'updateOptions', {
              xaxis: {
                min: xaxis.min,
                max: xaxis.max,
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
          '#008FFB', //prediction(blue)
          '#FFFFFF', //ground truth(white)
          '#008FFB', //upper bounds (prediction과 색상 맞춤)
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
          fillColors: ['#008FFB', '#FF7F00'],
        },
        onItemClick: {
          toggleDataSeries: false, // Enable toggling of the series
        },
      },
      xaxis: {
        type: 'datetime' as const,
        title: {
          text: '날짜', // X축 레이블
        },
        categories: graphData?.map((item) => item.date_pred),
      },
      // yaxis: {
      //   title: {
      //     rotate: 0, // 회전 각도 (0으로 설정하면 가로로 표시됨)
      //     offsetX: 40, // 타이틀을 X축 기준으로 이동 (필요시 조정)
      //     offsetY: -160, // 타이틀을 위로 이동 (양수: 아래로 이동, 음수: 위로 이동)
      //     text: `(${symbol.unit})`,
      //   },
      // },
    }),
    [graphData, featureImpactData, series1]
  )

  const options2: ApexOptions = useMemo(
    () => ({
      ...defaultOptions,
      chart: {
        id: 'chart-sub',
      },
      legend: {
        offsetY: 10,
      },
      xaxis: {
        type: 'datetime' as const,
        title: {
          text: '날짜', // X축 레이블
        },
        categories: graphData?.map((item) => item.date_pred),
      },
      annotations: {
        xaxis: [
          {
            x: new Date(featureImpactData?.date_input).getTime(),
            x2: new Date(featureImpactData?.date).getTime(),
            fillColor: '#FF3200',
            label: {
              text: '입력 구간',
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
      <div className="flex flex-row justify-end">
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
        <ReactApexChart options={options1 as ApexOptions} series={series1 as ApexAxisChartSeries} height={350} />

        {/* {selectedFilter?.selectedFeatures?.length > 0 && ( */}
        <ReactApexChart options={options2 as ApexOptions} series={series2 as ApexAxisChartSeries} height={250} />
        {/* )} */}
      </div>
    </div>
  )
}

export default PredictionChart
