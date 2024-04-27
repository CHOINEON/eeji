import * as d3 from 'd3'
import * as fc from 'd3fc'
import React from 'react'

const ForecastVisualization = () => {
  const svgRef2 = React.useRef()

  const [wsData, setWsData] = React.useState<any>([])
  const [prevWsData, setPrevWsData] = React.useState<any>([])

  const webSocketUrl = `ws://222.121.66.49:8000/ws/web`
  const ws = React.useRef(null)

  const stream = fc.randomFinancial().stream()

  React.useEffect(() => {
    getSocketData()
  }, [])

  React.useEffect(() => {
    console.log('wsData:', wsData)
    if (wsData) {
      const data: any = prevWsData
      for (const j in wsData) {
        data.unshift(wsData[j]) //새로운 요소를 배열의 맨 앞에 추가
      }

      if (data.length === 100) {
        data.shift() //배열 첫번째 요소 제거
      }
      setPrevWsData(data)
      renderChart()
    }
  }, [wsData])

  const getSocketData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = () => {
      console.log('ForecastVisualization ws connection !!!! ')
    }
    ws.current.onmessage = (event: any) => {
      //   console.log('[ ws Return Data ]')
      //   console.log(JSON.parse(event.data))

      const parsedData = JSON.parse(event.data)
      const wsObj: any = new Object()
      const wsArr: any = []

      wsObj.index = parsedData.index
      wsObj.data = parsedData.data
      wsObj.is_anormaly = parsedData.is_anormaly

      wsArr.push(wsObj)
      setWsData(wsArr)
    }
    ws.current.onclose = () => {
      console.log('forcasting visualization ws closed!')

      const timeoutId = setTimeout(() => {
        getSocketData()
      }, 1000)

      clearTimeout(timeoutId)
    }
  }

  const renderChart = () => {
    console.log('rendering chart:', data)

    // const yExtent = fc.extentLinear().accessors([(d: any) => d.high, (d: any) => d.low])
    // const xExtent = fc.extentTime().accessors([(d: any) => d.date])

    // const gridlines = fc.annotationSvgGridline()
    // const candlestick = fc.seriesSvgCandlestick()
    // const multi = fc.seriesSvgMulti().series([gridlines, candlestick])

    // const chart = fc
    //   .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    //   .yDomain(yExtent(data))
    //   .xDomain(xExtent(data))
    //   .svgPlotArea(multi)

    // data.push(stream.next())
    // data.shift()

    // chart.yDomain(yExtent(data)).xDomain(xExtent(data))

    const data = fc.randomFinancial()(50)
    console.log('data:', data)
    const yExtent = fc.extentLinear().accessors([(d: any) => d.high, (d: any) => d.low])
    const xExtent = fc.extentTime().accessors([(d: any) => d.date])

    const gridlines = fc.annotationSvgGridline()
    const candlestick = fc.seriesSvgCandlestick()
    const multi = fc.seriesSvgMulti().series([gridlines, candlestick])

    const chart = fc.chartCartesian(d3.scaleTime(), d3.scaleLinear()).svgPlotArea(multi)

    chart.xDomain(xExtent(data))
    chart.yDomain(yExtent(data))

    d3.select('#chart').datum(data).call(chart)
  }

  return (
    <>
      <div id="chart" style={{ width: '100%', height: '300px' }}></div>
    </>
  )
}

export default ForecastVisualization
