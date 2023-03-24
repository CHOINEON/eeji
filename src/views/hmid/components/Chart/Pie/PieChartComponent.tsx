/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - PieChart Option
 * 시작 날짜 : 2023-03-22
 * 최종 수정 날짜 : 2023-03-22
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import ChartOption from './option/option'
import reducer from './reducer/reducer'
import initialState from './reducer/initialState'
import type { PieChartProps } from './interface/interface'

export const PieChartComponent: React.FC<PieChartProps> = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [chartType, setChartType] = React.useState()
  const [ShowDrawer, setShowDrawer] = React.useState(false)

  React.useEffect(() => {
    setShowDrawer(props.ShowPieDrawer)
  }, [props.ShowPieDrawer])

  React.useEffect(() => {
    setChartType(props.ChartType)
    props.ChartLayout(PieChartLayout)
    props.ChartData(PieChartData)
  }, [props.ChartType])

  React.useEffect(() => {
    setPieChartData({
      textinfo: state.ENABLE_MARKER_LABEL,
      textposition: state.TEXT_POSITION,
      hole: state.HOLE,
      type: 'pie',
    })
  }, [state.ENABLE_MARKER_LABEL, state.TEXT_POSITION, state.HOLE])

  React.useEffect(() => {
    setPieChartLayout({
      title: state.TITLE,
      margin: {
        l: state.MARGIN_LEFT,
        r: state.MARGIN_RIGHT,
        b: state.MARGIN_BOTTOM,
        t: state.MARGIN_TOP,
      },
      showlegend: state.ENABLE_LEGEND,
      xaxis: {
        title: state.AXIS_X_TITLE,
      },
      yaxis: {
        title: state.AXIS_Y_TITLE,
      },
    })
  }, [
    state.TITLE,
    state.MARGIN_LEFT,
    state.MARGIN_RIGHT,
    state.LINE_SHAPE,
    state.MARGIN_BOTTOM,
    state.MARGIN_TOP,
    state.ENABLE_LEGEND,
    state.AXIS_X_TITLE,
    state.AXIS_Y_TITLE,
  ])

  const [PieChartData, setPieChartData] = React.useState<any>({
    textinfo: state.ENABLE_MARKER_LABEL,
    textposition: state.TEXT_POSITION,
    hole: state.HOLE,
    type: 'pie',
    //autosize: true,
    // font: {
    //   family: state.FONT_FAMILY,
    //   size: state.FONT_SIZE,
    //   color: state.FONT_COLOR_TEXT,
    // },
  })
  const [PieChartLayout, setPieChartLayout] = React.useState<any>({
    title: state.TITLE,
    margin: {
      l: state.MARGIN_LEFT,
      r: state.MARGIN_RIGHT,
      b: state.MARGIN_BOTTOM,
      t: state.MARGIN_TOP,
    },
    showlegend: state.ENABLE_LEGEND,
    xaxis: {
      title: state.AXIS_X_TITLE,
    },
    yaxis: {
      title: state.AXIS_Y_TITLE,
    },
  })

  const getChartLayout = (chartLayout: any) => {
    console.log(chartLayout)
  }

  const getChartData = (chartData: any) => {
    console.log(chartData)
  }

  const getShowDrawer = (ShowDrawer: boolean) => {
    console.log('[ 하위 PieChart option에서 받은 props ] : ' + ShowDrawer)
    setShowDrawer(ShowDrawer)
    props.setShowDrawer(ShowDrawer)
  }

  return (
    <>
      <ChartOption
        ChartType={chartType}
        ChartLayout={getChartLayout}
        ChartData={getChartData}
        setShowDrawer={getShowDrawer}
        ShowPieDrawer={ShowDrawer}
      />
    </>
  )
}

export default PieChartComponent
