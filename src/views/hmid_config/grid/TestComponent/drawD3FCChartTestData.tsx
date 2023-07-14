import React from 'react'
import * as fc from 'd3fc'
import * as d3 from 'd3'

export const DrawD3FCChartTestData: React.FC = () => {
  const stream = fc.randomFinancial().stream()
  const data = stream.take(110)

  React.useEffect(() => {
    // getsocketChartData()
    renderChart(data)
    const IntervalId = setInterval(getNextData, 200)
    // console.log(IntervalId)
    // if (IntervalId) {
    //   window.clearInterval(IntervalId)
    // }
  }, [])

  const getNextData = () => {
    const test_data: any = stream.next()
    const RtnData = data
    RtnData.push(test_data)
    RtnData.shift()
    renderChart(RtnData)
  }

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
