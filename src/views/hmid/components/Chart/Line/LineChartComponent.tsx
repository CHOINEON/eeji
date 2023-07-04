/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - LineChart Option
 * 시작 날짜 : 2023-03-16
 * 최종 수정 날짜 : 2023-05-22
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import ChartOption from './option/option'

import { useRecoilState } from 'recoil'
import * as LineAtom from 'views/hmid_config/recoil/line_사용보류/atoms'

export const LineChartComponent: React.FC = () => {
  // const [chartType, setChartType] = React.useState()
  // const [ShowDrawer, setShowDrawer] = React.useState(false)
  // const [LineChartData, setLineChartData] = React.useState<any>()
  // const [LineChartLayout, setLineChartLayout] = React.useState<any>()

  // React.useEffect(() => {
  //   setShowDrawer(props.ShowDrawer)
  // }, [props.ShowDrawer])

  // React.useEffect(() => {
  //   console.log(props.ChartType)
  //   if (props.ChartType === 'Line') {
  //     setChartType(props.ChartType)
  //     // props.ChartData(LineChartData)
  //     // props.ChartLayout(LineChartLayout)
  //   }
  // }, [props.ChartType])

  // React.useEffect(() => {
  //   if (props.ChartType === 'Line') {
  //     props.ChartData(LineChartData)
  //     props.ChartLayout(LineChartLayout)
  //   }
  // }, [props.ChartType, LineChartData, LineChartLayout])

  // const getChartLayout = (chartLayout: any) => {
  //   props.ChartLayout(chartLayout)
  //   setLineChartLayout(chartLayout)
  // }

  // const getChartData = (chartData: any) => {
  //   props.ChartData(chartData)
  //   setLineChartData(chartData)
  // }

  // const getShowDrawer = (ShowDrawer: boolean) => {
  //   props.setShowDrawer(ShowDrawer)
  // }

  return (
    <>
      <ChartOption />
    </>
  )
}

export default LineChartComponent
