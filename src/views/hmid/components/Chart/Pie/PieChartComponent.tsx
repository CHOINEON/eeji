/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - PieChart Option
 * 시작 날짜 : 2023-03-22
 * 최종 수정 날짜 : 2023-03-22
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import ChartOption from './option/option'
import type { PieChartProps } from './interface/interface'
// import reducer from './reducer/reducer'
// import initialState from './reducer/initialState'

export const PieChartComponent: React.FC<PieChartProps> = (props: any) => {
  const [chartType, setChartType] = React.useState()
  const [ShowDrawer, setShowDrawer] = React.useState(false)
  const [PieChartLayout, setPieChartLayout] = React.useState<any>()
  const [PieChartData, setPieChartData] = React.useState<any>()

  React.useEffect(() => {
    setShowDrawer(props.ShowPieDrawer)
  }, [props.ShowPieDrawer])

  React.useEffect(() => {
    if (props.ChartType === 'Pie') {
      setChartType(props.ChartType)
      props.PieChartLayout(PieChartLayout)
      props.PieChartData(PieChartData)
    }
  }, [props.ChartType])

  const getPieChartLayout = (chartLayout: any) => {
    props.PieChartLayout(chartLayout)
    setPieChartLayout(chartLayout)
  }

  const getPieChartData = (chartData: any) => {
    props.PieChartData(chartData)
    setPieChartData(chartData)
  }

  const getShowDrawer = (ShowDrawer: boolean) => {
    props.setShowDrawer(ShowDrawer)
  }

  return (
    <>
      <ChartOption
        ChartType={chartType}
        PieChartLayout={getPieChartLayout}
        PieChartData={getPieChartData}
        setShowDrawer={getShowDrawer}
        ShowPieDrawer={ShowDrawer}
      />
    </>
  )
}

export default PieChartComponent
