import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import axios from 'axios'
import useInterval from './useInterval'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  CallData: 'TradePrice' | 'HighPrice' | 'LowPrice' | 'OpeningPrice' | 'candleAccTradePriceVolume'
  Color: string
}

export const D3LineChartSmall: React.FC<LineChartPorps> = (props) => {
  const svgRef4 = React.useRef()

  const [PrevChartData, setPrevChartData] = React.useState<any>([])
  const [WsData, setWsData] = React.useState<any>([])
  const [TestData, setTestData] = React.useState<any>([])

  const [chartData, setChartData] = React.useState<any>()
  const [lastDate, setLastDate] = React.useState<any>()

  const PrevChatDataVal: any = []

  const webSocketUrl = `ws://192.168.1.27:8001/api/ws`
  const ws = React.useRef(null)

  React.useEffect(() => {
    //getChartData()
    //getsocketChartData()
  }, [])

  React.useEffect(() => {
    if (WsData.length !== 0) {
      // console.log('changeWsData--------------')
      // console.log(WsData)
      // console.log(PrevChartData)
      // console.log([...PrevChartData])
      // console.log(TestData)
      const test = [...PrevChartData]
      test.unshift(WsData)
      if (test.length === 100) {
        test.pop
      }
      // if (props.CallData === 'TradePrice') {
      //   test.pop()
      // } else {
      //   if (test.length === 401) {
      //     test.splice(test.length - 301, test.length - 100)
      //     console.log('[ Splice arr ]')
      //     console.log(test.length)
      //     console.log(test)
      //   } else {
      //     test.pop()
      //   }
      // }
      setPrevChartData(test)
      setTestData(test)
    }
  }, [WsData])

  React.useEffect(() => {
    if (TestData.length !== 0) {
      // console.log('change test data')
      // console.log(TestData)

      SocketChangeData(TestData)
    }
  }, [TestData])

  const SocketChangeData = (arr: any) => {
    if (arr[0].date !== undefined && arr[0].value !== undefined) {
      console.log('useEffect get Data')
      console.log(arr)

      const newArray = arr.filter((item: any, i: any) => {
        return (
          arr.findIndex((item2: any, j: any) => {
            console.log(item.date.toString())
            console.log(item2.date.toString())
            return item.date.toString() === item2.date.toString()
          }) === i
        )
      })
      console.log(newArray)
      console.log('-------------------')

      DrawD3LineChart(newArray)
    }
  }

  //웹소켓
  const getsocketChartData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection !!!! ')
    }
    ws.current.onmessage = function (event: any) {
      console.log('[ ws Return Data ]')
      console.log(JSON.parse(event.data))

      const parseData = JSON.parse(event.data)
      const wsObj: any = new Object()
      // console.log('[ call data type ] : ' + props.CallData)

      if (props.CallData === 'TradePrice') {
        wsObj.date = new Date(parseData[0].candleDateTimeKst)
        wsObj.value = parseData[0].tradePrice
      } else if (props.CallData === 'HighPrice') {
        wsObj.date = new Date(parseData[0].candleDateTimeKst)
        wsObj.value = parseData[0].highPrice
      } else if (props.CallData === 'LowPrice') {
        wsObj.date = new Date(parseData[0].candleDateTimeKst)
        wsObj.value = parseData[0].lowPrice
      } else if (props.CallData === 'OpeningPrice') {
        wsObj.date = new Date(parseData[0].candleDateTimeKst)
        wsObj.value = parseData[0].openingPrice
      } else {
        wsObj.date = new Date(parseData[0].candleDateTimeKst)
        wsObj.value = parseData[0].candleAccTradePrice
      }

      setWsData(wsObj)
      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst
    }
    ws.current.onclose = function () {
      console.log('ws close... ')

      setTimeout(function () {
        getsocketChartData()
      }, 1000)
    }
  }

  //plotly chart test
  const getPlotData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData1?', ['Tag-34'])
      .then((response) => {
        // console.log('[ Chart response data ] : ')
        // console.log(response.data)
        setChartData(response.data)

        // setData(response.data[0].y)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const DrawD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef4.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M')
    const parseDate = d3.timeParse('%H:%M')

    let rtnData = data

    if (props.CallData !== 'TradePrice') {
      rtnData.splice(rtnData.length - 300, rtnData.length - 100)
      // console.log('------------------------------')
      // console.log(rtnData)
    } else {
      rtnData = data
    }

    if (rtnData[0].x !== undefined && rtnData[0].y !== undefined) {
      console.log('first data !!!')

      data.forEach((d: any) => {
        d.date = parseDate(parseTime(new Date(d.x)))
        d.value = d.y
        delete d.x
        delete d.y
      })
    } else {
      svg2.selectAll('g').remove()
      data.forEach((d: any) => {
        d.date = parseDate(parseTime(d.date))
        d.value = d.value
      })
    }

    // console.log('[ chart draw get Data ]')
    // console.log(data)
    // console.log('[ Chart Draw Data ]')
    // console.log(data)

    const Value = data.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    console.log(data)

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
    const y: any = d3
      .scaleLinear()
      .domain([max - 20, max + 20])
      .range([height, 0])
    x.domain(
      d3.extent(data, (d: any) => {
        return d.date
      })
    )

    // x.ticks(d3.timeMinute.range(data[0].date, data[data.length - 1].date))
    x.ticks(data.length)

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
    //기본 y축 데이터 넣을 때
    // y.domain([
    //   0,
    //   d3.max(data, (d: any) => {
    //     return d.value
    //   }),
    // ])

    const xAxis = svg2
      .append('g')
      .attr('transform', `translate(50, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')))
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
      .style('fill', props.Color)
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 2 + 20)
      .attr('y', height + 40)
      .text(props.CallData)
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // Add brushing
    const brush: any = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', function (event, d) {
        const extent: any = event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
          x.domain([4, 8])
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])])
          svg2.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        svg2
          .select('.line')
          .transition()
          .duration(1000)
          .attr(
            'd',
            d3
              .line()
              .x((d: any) => {
                return x(d.date)
              })
              .y((d: any) => {
                return y(d.value)
              })
          )
      })

    // add the Line
    const valueLine: any = d3
      .line()
      .x((d: any) => {
        return x(d.date)
      })
      .y((d: any) => {
        return y(d.value)
      })

    svg2
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .data([data])
      .attr('transform', 'translate(50,0)')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', props.Color)
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)

    //select all path fill 지정
    // svg2.selectAll('path').attr('fill', 'none')
    // svg2.selectAll('line').attr('fill', 'none')

    svg2.append('g').attr('class', 'brush').attr('transform', 'translate(50,0)').call(brush)

    // If user double click, reinitialize the chart
    svg2.on('dblclick', () => {
      x.domain(
        d3.extent(rtnData, (d: any) => {
          return d.date
        })
      )
      xAxis.transition().call(d3.axisBottom(x))
      svg2
        .select('.line')
        .transition()
        .attr(
          'd',
          d3
            .line()
            .x((d: any) => {
              return x(d.date)
            })
            .y((d: any) => {
              return y(d.value)
            })
        )
    })

    // A function that set idleTimeOut to null
    let idleTimeout: any
    function idled() {
      idleTimeout = null
    }
  }

  const changeDate = (date_args: any) => {
    // console.log(date_args)
    // console.log(typeof date_args)
    if (typeof date_args === 'string') {
      console.log('this!!!')
      const trn_date = new Date(date_args)
      const year = trn_date.getFullYear()
      let month: any = trn_date.getMonth() + 1
      if (month < 10) month = '0' + month
      let date: any = trn_date.getDate()
      if (date < 10) date = '0' + date
      let hour: any = trn_date.getHours()
      if (hour < 10) hour = '0' + hour
      let minute: any = trn_date.getMinutes()
      if (minute < 10) minute = '0' + minute
      let second: any = trn_date.getSeconds()
      if (second < 10) second = '0' + second

      setLastDate(year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second)
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    } else {
      const trn_date = date_args
      const year = trn_date.getFullYear()
      let month: any = trn_date.getMonth() + 1
      if (month < 10) month = '0' + month
      let date: any = trn_date.getDate()
      if (date < 10) date = '0' + date
      let hour: any = trn_date.getHours()
      if (hour < 10) hour = '0' + hour
      let minute: any = trn_date.getMinutes()
      if (minute < 10) minute = '0' + minute
      let second: any = trn_date.getSeconds()
      if (second < 10) second = '0' + second

      setLastDate(year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second)
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    }
  }

  const getIntervalData = (date: string) => {
    axios.get('http://192.168.1.27:8001/api/websocket/interval?from_date=' + date).then((response) => {
      console.log('Interval Chart Data')
      console.log(response.data)

      const ItObj: any = new Object()

      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst

      ItObj.date = new Date(response.data.x)
      ItObj.value = response.data.y

      setWsData(ItObj)

      return ItObj
    })
  }

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      // .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .get('http://192.168.1.27:8001/api/websocket/data')
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        const date = changeDate(response.data[0].x)
        getIntervalData(date)

        // DrawD3LineChart(response.data)

        // getIntervalData()

        return response.data

        // setData(response.data[0].y)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //csv 파일 d3 테스트
  // const getTestChartData2 = async () => {
  //   const svg = d3.select(svgRef.current)

  //   const data = await d3.csv(
  //     'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
  //   )

  //   const parseTime = d3.timeParse('%Y-%m-%d')
  //   data.forEach((d: any) => {
  //     d.date = parseTime(d.date)
  //     d.value = +d.value
  //   })

  //   // set the dimensions and margins of the graph
  //   const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  //     width = 960 - margin.left - margin.right,
  //     height = 500 - margin.top - margin.bottom
  //   // append the svg object to the body of the page
  //   svg
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', `translate(${margin.left}, ${margin.top})`)

  //   // Add X axis and Y axis
  //   const x: any = d3.scaleTime().range([0, width])
  //   const y: any = d3.scaleLinear().range([height, 0])
  //   x.domain(
  //     d3.extent(data, (d: any) => {
  //       return d.date
  //     })
  //   )
  //   y.domain([
  //     0,
  //     d3.max(data, (d: any) => {
  //       return d.value
  //     }),
  //   ])
  //   svg.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
  //   svg.append('g').attr('transform', `translate(40, 0)`).call(d3.axisLeft(y))

  //   // add the Line

  //   const valueLine: any = d3
  //     .line()
  //     .x((d: any) => {
  //       return x(d.date)
  //     })
  //     .y((d: any) => {
  //       return y(d.value)
  //     })

  //   svg
  //     .append('path')
  //     .data([data])
  //     .attr('transform', 'translate(50,0)')
  //     .attr('class', 'line')
  //     .attr('fill', 'none')
  //     .attr('stroke', 'steelblue')
  //     .attr('stroke-width', 1.5)
  //     .attr('d', valueLine)
  // }

  //d3 scatter plot 테스트
  //zoom 진행 중
  // const getTestChartData = async () => {
  //   const data: any = await axios
  //     .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
  //     .then((response) => {
  //       // console.log('[ Chart response data ] : ')
  //       // console.log(response.data)
  //       return response.data[0]

  //       // setData(response.data[0].y)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })

  //   const parseTime = d3.timeFormat('%Y-%m-%d')
  //   const parseDate = d3.timeParse('%Y-%m-%d')

  //   data.forEach((d: any) => {
  //     // d.date = parseDate(parseTime(new Date(d.x)))
  //     d.date = new Date(d.x)
  //     d.value = d.y
  //     delete d.x
  //     delete d.y
  //   })

  //   console.log(data)

  //   const Value = data.map((v: any) => {
  //     return v.value
  //   })

  //   const Date2 = data.map((v: any) => {
  //     return v.date
  //   })

  //   const max = Math.max.apply(null, Value)
  //   const min = Math.min.apply(null, Value)

  //   const latestMth = Math.max.apply(null, Date2)
  //   const latestMin = Math.min.apply(null, Date2)

  //   const svg = d3.select(svgRef.current)

  //   // set the dimensions and margins of the graph
  //   const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  //     width = 960 - margin.left - margin.right,
  //     height = 500 - margin.top - margin.bottom

  //   svg
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  //   const x: any = d3.scaleTime().domain([latestMth, latestMin]).range([0, width])
  //   const y: any = d3.scaleLinear().domain([min, max]).range([height, 0])

  //   const scaleXaxis = d3.axisBottom(x)
  //   const scaleYaxis = d3.axisLeft(y)

  //   // Add X axis
  //   const xAxis = svg
  //     .append('g')
  //     .attr('transform', 'translate(0,' + height + ')')
  //     .call(scaleXaxis)

  //   // Add Y axis
  //   const yAxis = svg.append('g').call(scaleYaxis)

  //   // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  //   // const zoom = d3
  //   //   .zoom()
  //   //   //.scaleExtent([1, 1]) // This control how much you can unzoom (x0.5) and zoom (x20)
  //   //   //.translateExtent([[-100, -100], [height + 100, width + 100]])
  //   //   .on('zoom', function (event, d) {
  //   //     newX = event.transform.rescaleX(x)
  //   //     newY = event.transform.rescaleX(y)

  //   //     xAxis.call(d3.axisBottom(newX))
  //   //     yAxis.call(d3.axisBottom(newY))

  //   //     // update circle position
  //   //     svg
  //   //       .selectAll('circle')
  //   //       .attr('cx', function (d: any) {
  //   //         return newX(d.date)
  //   //       })
  //   //       .attr('cy', function (d: any) {
  //   //         return newY(d.value)
  //   //       })
  //   //   })

  //   // // Add brushing
  //   // const brush: any = d3
  //   //   .brushX() // Add the brush feature using the d3.brush function
  //   //   .extent([
  //   //     [0, 0],
  //   //     [width, height],
  //   //   ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //   //   .on('end', function (event, d) {
  //   //     const extent: any = event.selection

  //   //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
  //   //     if (!extent) {
  //   //       if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
  //   //       x.domain([4, 8])
  //   //       y.domain([0, 9])
  //   //       // x.domain(
  //   //       //   d3.extent(data, (d: any) => {
  //   //       //     return d.date
  //   //       //   })
  //   //       // ).nice()
  //   //       // y.domain(
  //   //       //   d3.extent(data, (d: any) => {
  //   //       //     return d.value
  //   //       //   })
  //   //       // ).nice()
  //   //     } else {
  //   //       // x.domain([x.invert(extent[0][0]), x.invert(extent[1][0])])
  //   //       // y.domain([y.invert(extent[1][1]), y.invert(extent[0][1])])
  //   //       svg.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  //   //     }

  //   //     // Update axis and dot position
  //   //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
  //   //     yAxis.transition().duration(1000).call(d3.axisBottom(y))

  //   //     svg
  //   //       .selectAll('circle')
  //   //       // .call(zoom)
  //   //       .transition()
  //   //       .duration(1000)
  //   //       .attr('cx', (d: any) => {
  //   //         return x(d.date)
  //   //       })
  //   //       .attr('cy', (d: any) => {
  //   //         return y(d.value)
  //   //       })
  //   //   })

  //   // Add dots
  //   const g = svg.append('g')

  //   const points = g
  //     .selectAll('dot')
  //     .data(data)
  //     .attr('class', 'circle')
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (d: any) => {
  //       return x(d.date)
  //     })
  //     .attr('cy', (d: any) => {
  //       return y(d.value)
  //     })
  //     .attr('r', 1.5)
  //     .style('fill', '#69b3a294')

  //   const zoom = d3
  //     .zoom()
  //     .scaleExtent([0.5, 32])
  //     // .translateExtent([
  //     //   [0, 0],
  //     //   [width, height],
  //     // ])
  //     .on('zoom', (e) => {
  //       const zx = e.transform.rescaleX(x).interpolate(d3.interpolateRound)
  //       const zy = e.transform.rescaleY(y).interpolate(d3.interpolateRound)
  //       g.attr('transform', e.transform).attr('stroke-width', 5 / e.transform.k)

  //       xAxis.call(scaleXaxis.scale(zx))
  //       yAxis.call(scaleYaxis.scale(zy))

  //       points
  //         .data(data)
  //         .attr('cx', (d: any) => {
  //           return x(d.date)
  //         })
  //         .attr('cy', (d: any) => {
  //           return y(d.value)
  //         })
  //       // g.style('stroke-width', 3 / Math.sqrt(transform.k))
  //       // points.attr('r', 3 / Math.sqrt(transform.k))
  //     })

  //   svg.call(zoom)

  //   // svg.append('g').attr('class', 'brush').call(brush)

  //   // If user double click, reinitialize the chart
  //   svg.on('dblclick', () => {
  //     x.domain([latestMth, latestMin])
  //     xAxis.transition().call(d3.axisBottom(x))
  //     svg
  //       .selectAll('dot')
  //       .transition()
  //       .attr('cx', (d: any) => {
  //         return x(d.date)
  //       })
  //       .attr('cy', (d: any) => {
  //         return y(d.value)
  //       })
  //   })

  //   // A function that set idleTimeOut to null
  //   // let idleTimeout: any
  //   // function idled() {
  //   //   idleTimeout = null
  //   // }
  // }

  return (
    <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/*d3 line chart*/}
      {/* <div>Websocket</div> */}
      <Wrapper ref={svgRef4} />

      {/* <Plot data={chartData} layout={layoutOption} /> */}
    </Chakra.Box>
  )
}

export default D3LineChartSmall
