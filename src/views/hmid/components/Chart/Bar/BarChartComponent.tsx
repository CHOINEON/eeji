/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - BarChart Option
 * 시작 날짜 : 2023-03-24
 * 최종 수정 날짜 : 2023-03-24
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import ChartOption from './option/option'
import type { BarChartProps } from './interface/interface'
// import reducer from './reducer/reducer'
// import initialState from './reducer/initialState'

export const BarChartComponent: React.FC<BarChartProps> = (props: any) => {
  const [chartType, setChartType] = React.useState()
  const [ShowDrawer, setShowDrawer] = React.useState(false)
  const [BarChartData, setBarChartData] = React.useState<any>()
  const [BarChartLayout, setBarChartLayout] = React.useState<any>()

  React.useEffect(() => {
    setShowDrawer(props.ShowDrawer)
  }, [props.ShowDrawer])

  // React.useEffect(() => {
  //   console.log(props.ChartType)
  //   if (props.ChartType === 'Line') {
  //     setChartType(props.ChartType)
  //     // props.ChartData(LineChartData)
  //     // props.ChartLayout(LineChartLayout)
  //   }
  // }, [props.ChartType])

  React.useEffect(() => {
    if (props.ChartType === 'Bar') {
      props.ChartData(BarChartData)
      props.ChartLayout(BarChartLayout)
    }
  }, [props.ChartType, BarChartData, BarChartLayout])

  const getChartLayout = (chartLayout: any) => {
    props.ChartLayout(BarChartLayout)
    setBarChartLayout(chartLayout)
  }

  const getChartData = (chartData: any) => {
    props.ChartData(BarChartData)
    setBarChartData(chartData)
  }

  const getShowDrawer = (ShowDrawer: boolean) => {
    props.setShowDrawer(ShowDrawer)
  }

  return (
    <>
      <ChartOption
        ChartType={chartType}
        ChartLayout={getChartLayout}
        ChartData={getChartData}
        ShowBarDrawer={ShowDrawer}
        setShowDrawer={getShowDrawer}
      />
    </>
  )
}

export default BarChartComponent
