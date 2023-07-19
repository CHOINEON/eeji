import React from 'react'
import * as d3 from 'd3'
// import { QueryClient, useQuery, QueryClientProvider } from '@tanstack/react-query'

export interface D3Binance1s {
  widthSize: any
  heightSize: any
}

/**
 * biance data ws 테스트
 * 1초마다 불러오는 데이터
 */
export const IntervalTestBiance: React.FC<D3Binance1s> = (props) => {
  // const queryclient = new QueryClient()
  const svgRef2 = React.useRef()
  const [wsData, setWSData] = React.useState<any>()
  const [prevWSData, setPrevWSData] = React.useState<any>([])

  //@kline_time 업데이트 속도 : 1000ms
  const webSocketUrl = `wss://stream.binance.com:9443/ws/btcusdt@kline_1s`
  const ws = React.useRef(null)

  React.useEffect(() => {
    getsocketChartData()
    window.localStorage.setItem('flag', '1')
  }, [])

  React.useEffect(() => {
    if (wsData !== undefined) {
      const data: any = prevWSData

      for (const j in wsData) {
        data.unshift(wsData[j])
      }
      // 데이터 최대 개수 정해서 넘으면 pop 시켜
      // 데이터 흐르게 보이기
      if (data.length === 700) {
        data.pop()
        data.pop()
      }

      // 새로 가공한 데이터를 다른 state에 담아서 최신으로 유지
      setPrevWSData(data)
      DrawMultipleSeriesD3LineChart(data)
    }
  }, [wsData])

  //웹소켓
  const getsocketChartData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection success')
    }
    ws.current.onmessage = function (event: any) {
      // console.log('[ ws Return Data ]')
      // console.log(JSON.parse(event.data))
      // console.log(JSON.stringify(event.data))

      const multipleKey = ['Low', 'High']

      const data = JSON.parse(event.data)

      let wsObj: any = new Object()
      const wsArr: any = []

      for (const j in multipleKey) {
        wsObj.name = multipleKey[j]
        wsObj.date = new Date(data.E * 1000)
        if (multipleKey[j] === 'Low') {
          wsObj.value = data.k.l
        } else {
          wsObj.value = data.k.h
        }
        wsArr.push(wsObj)
        wsObj = new Object()
      }

      if (window.localStorage.getItem('flag') === '0') {
        setPrevWSData(wsArr)
        window.localStorage.setItem('flag', '1')
      }

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

  const DrawMultipleSeriesD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef2.current)

    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    //redraw
    svg2.selectAll('g').remove()

    // d3 group 화
    const sumstat: any = Array.from(
      d3.group(data, (d: any) => d.name),
      ([key, values]) => ({ key, values })
    )

    /** resize Chart Size */
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

    // Add X axis --> it is a date format
    const x: any = d3.scaleTime().range([0, width])
    x.domain(
      d3.extent(data, (d: any) => {
        return d.date
      })
    )

    // Add Y axis
    const y: any = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d: any) => {
          return +d.value
        }) - 0.001,
        d3.max(data, (d: any) => {
          return +d.value
        }) + 0.001,
      ])
      .range([height, 0])

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

    // svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).tickValues(arr))
    svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

    //grid 그리기
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)

    const colorArr: any = ['#ec0000', '#005f00']
    //random color
    // for (let i = 0, len = sumstat.length; i < len; i++) {
    //   const colorCode = '#' + Math.round(Math.random() * 0xffffff).toString(16)
    //   //console.log('[ Color Code ] : ', colorCode)
    //   colorArr.push(colorCode)
    // }

    const res: any = sumstat.map(function (d: any) {
      return d.key
    }) // list of group names

    const color: any = d3.scaleOrdinal().domain(res).range(colorArr)

    svg2.append('rect').attr('width', width).attr('height', height).style('opacity', 0)
    // .on('touchmouse mousemove', function (event) {
    //   const mousePos = d3.pointer(event, this)
    //   // x coordinate stored in mousePos index 0
    //   const date = x.invert(mousePos[0])

    //   const xAccessor = (d: any) => d.date
    //   const yAccessor = (d: any) => d.value

    //   // Custom Bisector - left, center, right <= bisector options
    //   const dateBisector = d3.bisector(xAccessor).center
    //   const bisectionIndex = dateBisector(data, date)
    //   const hoveredIndexData = data[bisectionIndex - 1]

    //   // console.log(hoveredIndexData)
    //   // console.log(yAccessor(hoveredIndexData))
    //   // console.log(hoveredIndexData)
    //   // console.log(xAccessor(hoveredIndexData))
    //   tooltipDot
    //     .style('opacity', 1)
    //     // .attr('cx', x(xAccessor(hoveredIndexData)))
    //     .attr('cx', x(xAccessor(hoveredIndexData)))
    //     .attr('cy', y(yAccessor(hoveredIndexData)))

    //   // console.log(hoveredIndexData)

    //   tooltip
    //     .style('display', 'block')
    //     .style('top', `${y(yAccessor(hoveredIndexData)) - 50}px`)
    //     .style('left', `${x(xAccessor(hoveredIndexData))}px`)

    //   tooltip.select('.price').text(`${yAccessor(hoveredIndexData)}`)

    //   const dateFormatter = d3.timeFormat('%B %-d, %Y')

    //   tooltip.select('.date').text(`${dateFormatter(xAccessor(hoveredIndexData))}`)
    // })

    // .on('mouseleave', function (event) {
    //   const mousePos = d3.pointer(event, this)
    // })

    svg2
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .selectAll('.line')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('class', function (d: any) {
        return d.key
      })
      .attr('transform', 'translate(50,0)')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', function (d: any) {
        return color(d.key)
      })
      .attr('stroke-width', 1.5)
      .attr('d', function (d: any) {
        return d3
          .line()
          .x(function (d: any) {
            return x(d.date)
          })
          .y(function (d: any) {
            return y(d.value)
          })(d.values)
      })
    // .on('mouseover', mouseover)
    // .on('mousemove', mousemove)
    // .on('mouseleave', mouseleave)

    svg2
      .selectAll('myLegend')
      .data(sumstat)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .style('z-index', '999')
      .attr('transform', 'translate(50,0)')
      .append('text')
      .attr('x', function (d: any, i: any) {
        return 260 + i * 200
      })
      .attr('y', height + margin.top + margin.bottom / 2)
      .text(function (d: any) {
        return d.key
      })
      .style('fill', function (d: any) {
        return color(d.key)
      })
      .style('font-size', 13)
      .on('click', (d: any) => {
        // is the element currently visible ?
        const currentOpacity: any = d3.selectAll('.' + d.target.innerHTML).style('opacity')
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.selectAll('.' + d.target.innerHTML)
          .transition()
          .style('opacity', currentOpacity == 1 ? 0 : 1)
      })
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
      <svg ref={svgRef2} style={{ margin: '0.3vw 1vw' }} />
    </div>
  )
}

export default IntervalTestBiance
