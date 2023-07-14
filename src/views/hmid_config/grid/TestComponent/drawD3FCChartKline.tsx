import React from 'react'
import * as fc from 'd3fc'
import * as d3 from 'd3'

export const DrawD3FCChartKline: React.FC = () => {
  const [wsData, setWSData] = React.useState<any>()
  const [prevWSData, setPrevWSData] = React.useState<any>([])

  //@kline_time 업데이트 속도 : 1000ms
  const webSocketUrl = `wss://stream.binance.com:9443/ws/btcusdt@kline_1s`
  const ws = React.useRef(null)

  const stream = fc.randomFinancial().stream()
  //const data = stream.take(110)

  React.useEffect(() => {
    getsocketChartData()
    //renderChart(data)
    window.localStorage.setItem('flag', '1')
  }, [])

  React.useEffect(() => {
    if (wsData !== undefined) {
      const data: any = prevWSData

      for (const j in wsData) {
        data.unshift(wsData[j])
      }
      // 데이터 최대 개수 정해서 넘으면 shift() 시켜
      // 데이터 흐르게 보이기
      if (data.length === 100) {
        data.shift()
      }
      setPrevWSData(data)
      renderChart(data)
    }
  }, [wsData])

  //웹소켓
  const getsocketChartData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection success')
    }
    ws.current.onmessage = function (event: any) {
      const data = JSON.parse(event.data)

      let wsObj: any = new Object()
      const wsArr: any = []

      wsObj.date = new Date(data.E * 1000)
      wsObj.low = data.k.l
      wsObj.high = data.k.h

      wsArr.push(wsObj)
      wsObj = new Object()

      if (window.localStorage.getItem('flag') === '0') {
        setPrevWSData(wsArr)
        window.localStorage.setItem('flag', '1')
      }

      //console.log('[ WS Arr ] : ', wsArr)
      setWSData(wsArr)

      // p : price
      // t : trade completed time
      // E : event time
      // s : option trading symbol
      // h : high
      // l : low
    }
    ws.current.onclose = function () {
      console.log('ws close')

      const timeout = setTimeout(function () {
        getsocketChartData()
      }, 1000)

      clearTimeout(timeout)
    }
  }

  const renderChart = (data: any) => {
    const yExtent = fc.extentLinear().accessors([(d: any) => d.high, (d: any) => d.low])

    const xExtent = fc.extentTime().accessors([(d: any) => d.date])

    const gridlines = fc.annotationSvgGridline()
    const candlestick = fc.seriesSvgCandlestick()
    const multi = fc.seriesSvgMulti().series([gridlines, candlestick])

    const chart = fc
      .chartCartesian(d3.scaleTime(), d3.scaleLinear())
      .yDomain(yExtent(data))
      .xDomain(xExtent(data))
      .svgPlotArea(multi)

    data.push(stream.next())
    data.shift()

    chart.yDomain(yExtent(data)).xDomain(xExtent(data))

    d3.select('#chart').datum(data).call(chart)
  }
  return (
    <>
      <div id="chart" style={{ width: '100%', height: '100%' }}></div>
    </>
  )
}

export default DrawD3FCChartKline
