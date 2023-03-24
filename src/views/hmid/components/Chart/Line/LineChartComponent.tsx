/**
 * INFINITE OPTIMAL
 * 메뉴 : HMI Designer - LineChart Option
 * 시작 날짜 : 2023-03-16
 * 최종 수정 날짜 : 2023-03-17
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import ChartOption from './option/option'
import reducer from './reducer/reducer'
import initialState from './reducer/initialState'
import type { LineChartProps } from './interface/interface'

export const LineChartComponent: React.FC<LineChartProps> = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [chartType, setChartType] = React.useState()
  const [ShowDrawer, setShowDrawer] = React.useState(false)

  React.useEffect(() => {
    console.log('[상위에서 받은 props ] : ' + props.ShowDrawer)
    setShowDrawer(props.ShowDrawer)
  }, [props.ShowDrawer])

  React.useEffect(() => {
    console.log(props.ChartType)
    if (props.ChartType === 'Line') {
      setChartType(props.ChartType)
      props.ChartData(LineChartData)
      props.ChartLayout(LineChartLayout)
    }
  }, [props.ChartType])

  React.useEffect(() => {
    console.log(' Change LineChart Layout Option >>> ')
    console.log(state.LINE_MODE)
    console.log(state.LINE_WIDTH)

    setLineChartData({
      mode: state.LINE_MODE,
      //추후 속성 추가 예정
      //name: 'vh',
      text: state.ENABLE_MARKER_LABEL,
      textposition: state.MARKER_LABEL_POSITION,
      line: {
        shape: state.LINE_SHAPE,
        width: state.LINE_WIDTH,
        dash: state.LINE_DASH,
      },
      type: 'scatter',
    })
  }, [
    state.LINE_MODE,
    state.ENABLE_MARKER_LABEL,
    state.MARKER_LABEL_POSITION,
    state.LINE_SHAPE,
    state.LINE_WIDTH,
    state.LINE_DASH,
  ])

  React.useEffect(() => {
    console.log(' Change LineChart Data >>>>>>>>>>>>>>>>')
    console.log(state.TITLE)

    setLineChartLayout({
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

  const [LineChartData, setLineChartData] = React.useState<any>({
    mode: state.LINE_MODE,
    //추후 속성 추가 예정
    //name: 'vh',
    text: state.ENABLE_MARKER_LABEL,
    textposition: state.MARKER_LABEL_POSITION,
    line: {
      shape: state.LINE_SHAPE,
      width: state.LINE_WIDTH,
      dash: state.LINE_DASH,
    },
    type: 'scatter',
    //autosize: true,
    // font: {
    //   family: state.FONT_FAMILY,
    //   size: state.FONT_SIZE,
    //   color: state.FONT_COLOR_TEXT,
    // },
  })
  const [LineChartLayout, setLineChartLayout] = React.useState<any>({
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
    console.log('[ 하위 option에서 받은 props ] : ' + ShowDrawer)
    setShowDrawer(ShowDrawer)
    props.setShowDrawer(ShowDrawer)
  }

  return (
    <>
      <ChartOption
        ChartType={chartType}
        ChartLayout={getChartLayout}
        ChartData={getChartData}
        ShowDrawer={ShowDrawer}
        setShowDrawer={getShowDrawer}
      />
    </>
  )
}

export default LineChartComponent
