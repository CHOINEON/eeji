import React from 'react'
import * as d3 from 'd3'
//import { QueryClient, useQuery, QueryClientProvider } from '@tanstack/react-query'

export interface D3Binance1s {
  widthSize: any
  heightSize: any
}

export const IntervalTestBianceTrade: React.FC<D3Binance1s> = (props) => {
  //const queryclient = new QueryClient()
  const svgRef2 = React.useRef()
  const [wsData, setWSData] = React.useState<any>()
  const [prevWSData, setPrevWSData] = React.useState<any>([])

  //@trade 업데이트 속도: 50ms
  const webSocketUrl = `wss://stream.binance.com:9443/ws/btcusdt@trade`
  const ws = React.useRef(null)

  React.useEffect(() => {
    getsocketChartData()
    window.localStorage.setItem('flag', '1')
  }, [])

  React.useEffect(() => {
    if (wsData !== undefined) {
      const data: any = prevWSData

      data.unshift(wsData[0])

      // 데이터 최대 개수 정해서 넘으면 pop 시켜
      // 데이터 흐르게 보이기
      if (data.length === 200) {
        data.pop()
      }
      setPrevWSData(data)
      DrawD3LineChart(data)
    }
  }, [wsData])

  //웹소켓
  const getsocketChartData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection success')
    }
    ws.current.onmessage = function (event: any) {
      //console.log('[ ws Return Data ]')
      //console.log(JSON.parse(event.data))
      //console.log(JSON.stringify(event.data))

      const multipleKey = ['Low', 'High']

      const data = JSON.parse(event.data)

      let wsObj: any = new Object()
      const wsArr: any = []

      wsObj.name = data.e
      wsObj.date = new Date(data.E * 1000)
      //price
      wsObj.value = data.p

      wsArr.push(wsObj)
      wsObj = new Object()

      if (window.localStorage.getItem('flag') === '0') {
        setPrevWSData(wsArr)
        window.localStorage.setItem('flag', '1')
      }

      //console.log('[ WS Arr ] : ', wsArr)
      setWSData(wsArr)
    }
    ws.current.onclose = function () {
      console.log('ws close')

      const timeout = setTimeout(function () {
        getsocketChartData()
      }, 1000)

      clearTimeout(timeout)
    }
  }

  const DrawD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef2.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    const rtnData = data
    //console.log('rtnData : ', rtnData)

    svg2.selectAll('g').remove()
    rtnData.forEach((d: any) => {
      d.date = d.date
      d.value = d.value
    })

    const Value = rtnData.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    // console.log('[ max ] ', max, ' ,  [ min ] ', min)

    const margin = { top: 20, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg2
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('g')
      .attr('stroke', '#ffc709')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')

    // Add X axis and Y axis
    const x: any = d3.scaleTime().range([0, width])

    const y = d3
      .scaleLinear()
      .domain([min, max + 0.01])
      .range([height, 0])

    x.domain(
      d3.extent(rtnData, (d: any) => {
        return d.date
      })
    )

    //grid line 속성 style은 css
    const xGrid = (g: any) =>
      g
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(x.ticks())
        .join('line')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('x1', (d: any) => x(d) + 50)
        .attr('x2', (d: any) => x(d) + 50)

    const yGrid = (g: any) =>
      g
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(y.ticks())
        .join('line')
        .attr('x1', margin.top + 20)
        .attr('x2', width + margin.left - 20)
        .attr('y1', (d: any) => y(d - 0.1))
        .attr('y2', (d: any) => y(d - 0.1))

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))

    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))
    //grid 그리기
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
    svg2
      .append('g')
      .append('rect')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('width', 10)
      .attr('height', 2)
      .style('fill', 'red')
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 2 + 20)
      .attr('y', height + 40)
      .text('Trade Price')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // add the Line
    const valueLine: any = d3
      .area()
      .x((d: any) => {
        return x(d.date)
      })
      .y0(y(min))
      .y1((d: any) => {
        return y(d.value)
      })

    svg2
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .data([rtnData])
      .attr('fill', 'rgba(255,0,0,0.3)')
      //.attr("stroke", "#69b3a2")
      .attr('transform', 'translate(50,0)')
      //.attr('class', 'line')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)
  }

  //react-query
  //   const BianceData = () => {
  //     const { isLoading, isError, data } = useQuery(['biance'], () =>
  //       fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then((res: any) => res.json())
  //     )

  //     if (isLoading) return <div>is Loading ...</div>
  //     if (isError) return <div>Faild to Load</div>

  //     return (
  //       <div>
  //         <div>{data.price}</div>
  //       </div>
  //     )
  //   }

  return (
    <div>
      {/* react-query 
      <QueryClientProvider client={queryclient}>
        <BianceData />
      </QueryClientProvider> */}
      <svg ref={svgRef2} style={{ margin: '0 1vw' }} />
    </div>
  )
}

export default IntervalTestBianceTrade
