import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import axios from 'axios'
import Plot from 'react-plotly.js'
import useInterval from './useInterval'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

const WrapperParent = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'block' : 'none')};
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  Calltype: 'WS' | 'Interval'
  CallData: 'TradePrice' | 'HighPrice' | 'LowPrice' | 'OpeningPrice' | 'candleAccTradePriceVolume'
  Color: string
}

export const D3LineChart: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()
  const svgRef2 = React.useRef()

  const [PrevChartData, setPrevChartData] = React.useState<any>([])
  const [WsData, setWsData] = React.useState<any>([])
  const [TestData, setTestData] = React.useState<any>([])

  const [PrevIntervalData, setPrevIntervalData] = React.useState<any>([])
  const [IntervalData, setIntervalData] = React.useState<any>([])
  const [IntervalTestData, setIntervalTestData] = React.useState<any>([])

  const [chartData, setChartData] = React.useState<any>()
  const [lastDate, setLastDate] = React.useState<any>()

  const [showWS, setShowWS] = React.useState(true)
  const [showInterval, setShowInterval] = React.useState(false)

  const PrevChatDataVal: any = []

  const webSocketUrl = `ws://192.168.1.27:8001/api/ws`
  const ws = React.useRef(null)

  const selectorOptions = {
    buttons: [
      {
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m',
      },
      {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m',
      },
      {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD',
      },
      {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y',
      },
      {
        step: 'all',
      },
    ],
  }

  const layoutOption: any = {
    title: 'Time series with range slider and selectors',
    xaxis: {
      fixedrange: true,
    },
    yaxis: {
      rangeselector: selectorOptions,
      rangeslider: {},
    },
  }

  React.useEffect(() => {
    getChartData()
    getsocketChartData()
    //getPlotData()
  }, [])

  React.useEffect(() => {
    // console.log('changeWsData')
    // console.log(WsData)
    // console.log(PrevChartData)
    // console.log(TestData)

    const test = [...PrevChartData]
    test.unshift(WsData)
    if (props.CallData === 'TradePrice') {
      test.pop()
    } else {
      if (test.length === 401) {
        test.splice(test.length - 301, test.length - 100)
        console.log('[ Splice arr ]')
        console.log(test.length)
        console.log(test)
      } else {
        test.pop()
      }
    }
    setPrevChartData(test)
    setTestData(test)
  }, [WsData])

  React.useEffect(() => {
    if (TestData.length !== 0) {
      // console.log('change test data')
      // console.log(TestData)

      SocketChangeData(TestData)
    }
  }, [TestData])

  // interval
  React.useEffect(() => {
    if (IntervalData.length !== 0) {
      // console.log(PrevIntervalData)
      // console.log(IntervalData)
      changeDate(IntervalData.date)
      const interval_test = [...PrevIntervalData]
      interval_test.unshift(IntervalData)
      interval_test.pop()
      setPrevIntervalData(interval_test)
      setIntervalTestData(interval_test)
    }
  }, [IntervalData])

  // interval
  React.useEffect(() => {
    if (IntervalTestData.length !== 0) {
      IntervalChangeData(IntervalTestData)
    }
  }, [IntervalTestData])

  // interval
  React.useEffect(() => {
    if (lastDate !== undefined) {
      console.log('[ date change use effect ! ]')
      console.log(lastDate)

      // setTimeout(function () {
      //   getIntervalData(lastDate)
      // }, 60000)

      // clearTimeout(time)
    }
  }, [lastDate])

  // interval
  useInterval(() => {
    getIntervalData(lastDate)
  }, 60000)

  const SocketChangeData = (t: any) => {
    if (t[0].date !== undefined && t[0].value !== undefined) {
      // console.log('useEffect get Data')
      // console.log(t)
      // console.log('-------------------')

      DrawD3LineChart(t)
    }
  }

  // interval
  const IntervalChangeData = (t: any) => {
    if (t[0].date !== undefined && t[0].value !== undefined) {
      // console.log('useEffect get Data')
      // console.log(t)
      // console.log('-------------------')

      DrawD3LineChartInterval(t)
    }
  }

  const changeDate = (date_args: any) => {
    console.log(date_args)
    console.log(typeof date_args)
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

      console.log('[ call data type ] : ' + props.CallData)

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

  //Interval Data
  const getIntervalData = (date: string) => {
    axios.get('http://192.168.1.27:8001/api/websocket/interval?from_date=' + date).then((response) => {
      console.log('Interval Chart Data')
      console.log(response.data)

      const ItObj: any = new Object()

      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst

      ItObj.date = new Date(response.data.x)
      ItObj.value = response.data.y

      setIntervalData(ItObj)
    })
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
    const svg2 = d3.select(svgRef2.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    let rtnData = data

    if (props.CallData !== 'TradePrice') {
      rtnData.splice(rtnData.length - 300, rtnData.length - 100)
      console.log('------------------------------')
      console.log(rtnData)
    } else {
      rtnData = data
    }

    if (rtnData[0].x !== undefined && rtnData[0].y !== undefined) {
      console.log('first data !!!')

      rtnData.forEach((d: any) => {
        d.date = parseDate(parseTime(new Date(d.x)))
        d.value = d.y
        delete d.x
        delete d.y
      })
    } else {
      svg2.selectAll('g').remove()
      rtnData.forEach((d: any) => {
        d.date = parseDate(parseTime(d.date))
        d.value = d.value
      })
    }

    // console.log('[ chart draw get Data ]')
    // console.log(data)
    // console.log('[ Chart Draw Data ]')
    // console.log(data)

    const Value = rtnData.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

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
    const y: any = d3.scaleLinear().domain([min, max]).range([height, 0])
    x.domain(
      d3.extent(rtnData, (d: any) => {
        return d.date
      })
    )
    //기본 y축 데이터 넣을 때
    // y.domain([
    //   0,
    //   d3.max(data, (d: any) => {
    //     return d.value
    //   }),
    // ])

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2
      .append('g')
      .attr('transform', `translate(40,3)`)
      .call(d3.axisLeft(y))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      // .style("text-decoration", "underline")
      .text('Trade Price')

    // Y axis label 추가

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
      .data([rtnData])
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

  const DrawD3LineChartInterval = (data: any) => {
    const svg = d3.select(svgRef.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    if (data[0].x !== undefined && data[0].y !== undefined) {
      console.log('first data !!!')

      data.forEach((d: any) => {
        d.date = parseDate(parseTime(new Date(d.x)))
        d.value = d.y
        delete d.x
        delete d.y
      })
    } else {
      svg.selectAll('g').remove()
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

    const margin = { top: 70, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Add X axis and Y axis
    const x: any = d3.scaleTime().range([0, width])
    const y: any = d3.scaleLinear().domain([min, max]).range([height, 0])
    x.domain(
      d3.extent(data, (d: any) => {
        return d.date
      })
    )
    //기본 y축 데이터 넣을 때
    // y.domain([
    //   0,
    //   d3.max(data, (d: any) => {
    //     return d.value
    //   }),
    // ])

    const xAxis = svg.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y))

    // Y axis label 추가
    // svg2
    //   .append('text')
    //   .attr('text-anchor', 'end')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', -margin.left + 40)
    //   .attr('x', -margin.top)
    //   .text('Y axis title')

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
          svg.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        svg
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

    svg
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .data([data])
      .attr('transform', 'translate(50,0)')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)

    //select all path fill 지정
    // svg2.selectAll('path').attr('fill', 'none')
    // svg2.selectAll('line').attr('fill', 'none')

    svg.append('g').attr('class', 'brush').attr('transform', 'translate(50,0)').call(brush)

    // If user double click, reinitialize the chart
    svg.on('dblclick', () => {
      x.domain(
        d3.extent(data, (d: any) => {
          return d.date
        })
      )
      xAxis.transition().call(d3.axisBottom(x))
      svg
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

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      // .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .get('http://192.168.1.27:8001/api/websocket/data')
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        changeDate(response.data[0].x)

        setPrevChartData(response.data)
        setPrevIntervalData(response.data)
        DrawD3LineChart(response.data)
        DrawD3LineChartInterval(response.data)

        // getIntervalData()

        return response.data

        // setData(response.data[0].y)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //csv 파일 d3 테스트
  const getTestChartData2 = async () => {
    const svg = d3.select(svgRef.current)

    const data = await d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
    )

    const parseTime = d3.timeParse('%Y-%m-%d')
    data.forEach((d: any) => {
      d.date = parseTime(d.date)
      d.value = +d.value
    })

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom
    // append the svg object to the body of the page
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Add X axis and Y axis
    const x: any = d3.scaleTime().range([0, width])
    const y: any = d3.scaleLinear().range([height, 0])
    x.domain(
      d3.extent(data, (d: any) => {
        return d.date
      })
    )
    y.domain([
      0,
      d3.max(data, (d: any) => {
        return d.value
      }),
    ])
    svg.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg.append('g').attr('transform', `translate(40, 0)`).call(d3.axisLeft(y))

    // add the Line

    const valueLine: any = d3
      .line()
      .x((d: any) => {
        return x(d.date)
      })
      .y((d: any) => {
        return y(d.value)
      })

    svg
      .append('path')
      .data([data])
      .attr('transform', 'translate(50,0)')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)
  }

  //d3 scatter plot 테스트
  //zoom 진행 중
  const getTestChartData = async () => {
    const data: any = await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .then((response) => {
        // console.log('[ Chart response data ] : ')
        // console.log(response.data)
        return response.data[0]

        // setData(response.data[0].y)
      })
      .catch((error) => {
        console.log(error)
      })

    const parseTime = d3.timeFormat('%Y-%m-%d')
    const parseDate = d3.timeParse('%Y-%m-%d')

    data.forEach((d: any) => {
      // d.date = parseDate(parseTime(new Date(d.x)))
      d.date = new Date(d.x)
      d.value = d.y
      delete d.x
      delete d.y
    })

    console.log(data)

    const Value = data.map((v: any) => {
      return v.value
    })

    const Date2 = data.map((v: any) => {
      return v.date
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    const latestMth = Math.max.apply(null, Date2)
    const latestMin = Math.min.apply(null, Date2)

    const svg = d3.select(svgRef.current)

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x: any = d3.scaleTime().domain([latestMth, latestMin]).range([0, width])
    const y: any = d3.scaleLinear().domain([min, max]).range([height, 0])

    const scaleXaxis = d3.axisBottom(x)
    const scaleYaxis = d3.axisLeft(y)

    // Add X axis
    const xAxis = svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(scaleXaxis)

    // Add Y axis
    const yAxis = svg.append('g').call(scaleYaxis)

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    // const zoom = d3
    //   .zoom()
    //   //.scaleExtent([1, 1]) // This control how much you can unzoom (x0.5) and zoom (x20)
    //   //.translateExtent([[-100, -100], [height + 100, width + 100]])
    //   .on('zoom', function (event, d) {
    //     newX = event.transform.rescaleX(x)
    //     newY = event.transform.rescaleX(y)

    //     xAxis.call(d3.axisBottom(newX))
    //     yAxis.call(d3.axisBottom(newY))

    //     // update circle position
    //     svg
    //       .selectAll('circle')
    //       .attr('cx', function (d: any) {
    //         return newX(d.date)
    //       })
    //       .attr('cy', function (d: any) {
    //         return newY(d.value)
    //       })
    //   })

    // // Add brushing
    // const brush: any = d3
    //   .brushX() // Add the brush feature using the d3.brush function
    //   .extent([
    //     [0, 0],
    //     [width, height],
    //   ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //   .on('end', function (event, d) {
    //     const extent: any = event.selection

    //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
    //     if (!extent) {
    //       if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
    //       x.domain([4, 8])
    //       y.domain([0, 9])
    //       // x.domain(
    //       //   d3.extent(data, (d: any) => {
    //       //     return d.date
    //       //   })
    //       // ).nice()
    //       // y.domain(
    //       //   d3.extent(data, (d: any) => {
    //       //     return d.value
    //       //   })
    //       // ).nice()
    //     } else {
    //       // x.domain([x.invert(extent[0][0]), x.invert(extent[1][0])])
    //       // y.domain([y.invert(extent[1][1]), y.invert(extent[0][1])])
    //       svg.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //     }

    //     // Update axis and dot position
    //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
    //     yAxis.transition().duration(1000).call(d3.axisBottom(y))

    //     svg
    //       .selectAll('circle')
    //       // .call(zoom)
    //       .transition()
    //       .duration(1000)
    //       .attr('cx', (d: any) => {
    //         return x(d.date)
    //       })
    //       .attr('cy', (d: any) => {
    //         return y(d.value)
    //       })
    //   })

    // Add dots
    const g = svg.append('g')

    const points = g
      .selectAll('dot')
      .data(data)
      .attr('class', 'circle')
      .enter()
      .append('circle')
      .attr('cx', (d: any) => {
        return x(d.date)
      })
      .attr('cy', (d: any) => {
        return y(d.value)
      })
      .attr('r', 1.5)
      .style('fill', '#69b3a294')

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 32])
      // .translateExtent([
      //   [0, 0],
      //   [width, height],
      // ])
      .on('zoom', (e) => {
        const zx = e.transform.rescaleX(x).interpolate(d3.interpolateRound)
        const zy = e.transform.rescaleY(y).interpolate(d3.interpolateRound)
        g.attr('transform', e.transform).attr('stroke-width', 5 / e.transform.k)

        xAxis.call(scaleXaxis.scale(zx))
        yAxis.call(scaleYaxis.scale(zy))

        points
          .data(data)
          .attr('cx', (d: any) => {
            return x(d.date)
          })
          .attr('cy', (d: any) => {
            return y(d.value)
          })
        // g.style('stroke-width', 3 / Math.sqrt(transform.k))
        // points.attr('r', 3 / Math.sqrt(transform.k))
      })

    svg.call(zoom)

    // svg.append('g').attr('class', 'brush').call(brush)

    // If user double click, reinitialize the chart
    svg.on('dblclick', () => {
      x.domain([latestMth, latestMin])
      xAxis.transition().call(d3.axisBottom(x))
      svg
        .selectAll('dot')
        .transition()
        .attr('cx', (d: any) => {
          return x(d.date)
        })
        .attr('cy', (d: any) => {
          return y(d.value)
        })
    })

    // A function that set idleTimeOut to null
    // let idleTimeout: any
    // function idled() {
    //   idleTimeout = null
    // }
  }

  return (
    <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/*d3 line chart*/}
      <WrapperParent show={showWS}>
        {/* <div>Websocket</div> */}
        <Wrapper ref={svgRef2} />
      </WrapperParent>

      <WrapperParent show={showInterval}>
        {/* <div style={{ marginBottom: '1vw' }}>SetInterval</div> */}
        {/*d3 scatter plot chart */}
        <Wrapper ref={svgRef} />
      </WrapperParent>

      {/* <Plot data={chartData} layout={layoutOption} /> */}
    </Chakra.Box>
  )
}

export default D3LineChart
