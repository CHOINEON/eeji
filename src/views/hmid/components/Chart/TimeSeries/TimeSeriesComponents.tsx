/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - LineChart Option
 * 시작 날짜 : 2023-03-16
 * 최종 수정 날짜 : 2023-03-17
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import TimeSeriesOption from './option/option'
import type { TimeSeriesProps } from './interface/interface'
// import reducer from './reducer/reducer'
// import initialState from './reducer/initialState'

export const TimeSeriesComponents: React.FC<TimeSeriesProps> = (props: any) => {
  const [chartType, setChartType] = React.useState()
  const [ShowDrawer, setShowDrawer] = React.useState(false)
  const [TimeSeriesChartData, setTimeSeriesData] = React.useState<any>()
  const [TimeSeriesLayout, setTimeSeriesLayout] = React.useState<any>()

  // React.useEffect(() => {
  //   console.log(props.ChartType)
  //   if (props.ChartType === 'Line') {
  //     setChartType(props.ChartType)
  //     // props.ChartData(LineChartData)
  //     // props.ChartLayout(LineChartLayout)
  //   }
  // }, [props.ChartType])

  React.useEffect(() => {
    if (props.ChartType === 'Time Series') {
      console.log('[ 하위 TimeSeries 에서 받은 props ] : ')
      console.log(TimeSeriesChartData)
      console.log(TimeSeriesLayout)

      props.ChartData(TimeSeriesChartData)
      props.ChartLayout(TimeSeriesLayout)
    }
  }, [props.ChartType, TimeSeriesChartData, TimeSeriesLayout])

  React.useEffect(() => {
    if (props.ChartType === 'Time Series') {
      setShowDrawer(props.ShowTimeSeriesDrawer)
    }
  }, [props.ChartType, props.ShowTimeSeriesDrawer])

  const getChartLayout = (chartLayout: any) => {
    props.ChartLayout(chartLayout)
    setTimeSeriesLayout(chartLayout)
  }

  const getChartData = (chartData: any) => {
    props.ChartData(chartData)
    setTimeSeriesData(chartData)
  }

  const getShowDrawer = (ShowDrawer: boolean) => {
    props.setShowDrawer(ShowDrawer)
  }

  return (
    <>
      <TimeSeriesOption
        ChartType={chartType}
        ChartLayout={getChartLayout}
        ChartData={getChartData}
        ShowTimeSeriesDrawer={ShowDrawer}
        setShowDrawer={getShowDrawer}
      />
    </>
  )
}

export default TimeSeriesComponents
