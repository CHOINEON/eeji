import React, { useRef } from 'react'
import * as fc from 'd3fc'
import * as d3 from 'd3'

// https://sangcho.tistory.com/entry/ReactHooks%EC%9D%98%EB%B9%99%EC%82%B0

export const DrawD3FCChartTestData: React.FC = () => {
  const stream = fc.randomFinancial().stream()
  const data = stream.take(110)
  const intervalRef = useRef(null)

  React.useEffect(() => {
    // getsocketChartData()
    renderChart(data)

    // fix : 이전에 생성된 interval clear 안되는 버그 수정
    console.log(intervalRef.current)
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(getNextData, 200)

    // console.log(IntervalId)
    // if (IntervalId) {
    //   window.clearInterval(IntervalId)
    // }

    // return () => {
    //   if (intervalRef.current) clearInterval(intervalRef.current)
    // }
  }, [])

  const getNextData = () => {
    //stream data의 다음 데이터를 가져온다
    const test_data: any = stream.next()
    const RtnData = data
    // data에 push 하고 shift
    RtnData.push(test_data)
    RtnData.shift()
    renderChart(RtnData)
  }

  //d3fc chart rendering
  const renderChart = (data: any) => {
    const xScale = d3.scaleTime().domain(fc.extentTime().accessors([(d: any) => d.date])(data))

    const yScale = d3.scaleLinear().domain(fc.extentLinear().accessors([(d: any) => d.high, (d: any) => d.low])(data))

    const candlestick = fc.seriesWebglCandlestick()

    const gridline = fc.annotationCanvasGridline()

    const lowLine = fc
      .seriesSvgLine()
      .crossValue((d: any) => d.date)
      .mainValue((d: any) => d.low)

    const chart = fc
      .chartCartesian(xScale, yScale)
      .webglPlotArea(candlestick)
      .canvasPlotArea(gridline)
      .svgPlotArea(lowLine)

    d3.select('#chart2').datum(data).call(chart)
  }
  return (
    <>
      <div id="chart2" style={{ width: '100%', height: '100%' }}></div>
    </>
  )
}

export default DrawD3FCChartTestData
