import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'
import './style.css'

const Wrapper = styled.svg<{ ChartShow: boolean }>`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
  display: ${(props) => (props.ChartShow ? 'block' : 'none')};
`

const DataGridWrap = styled.div<{ TableShow: boolean }>`
  width: 100%;
  height: calc(100% - 1.1vw);
  display: ${(props) => (props.TableShow ? 'block' : 'none')};
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  CallData: 'TradePrice' | 'HighPrice' | 'LowPrice' | 'OpeningPrice' | 'DataTable'
  Color: string
  ChartShow: boolean
  TableShow: boolean
}

export const D3LineChartTooltip: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()
  const svgRef2 = React.useRef()

  const [WsData, setWsData] = React.useState<any>([])

  //trade
  const [PrevChartData, setPrevChartData] = React.useState<any>([])
  const [TestData, setTestData] = React.useState<any>([])

  //opening
  const [OpeningPricePrevData, setOpeningPricePrevData] = React.useState<any>([])
  const [OpeningTestData, setOpeningTestData] = React.useState<any>([])

  //lowprice
  const [LowPricePrevData, setLowPricePrevData] = React.useState<any>([])
  const [LowTestData, setLowTestData] = React.useState<any>([])

  //highprice
  const [HighPricePrevData, setHighPricePrevData] = React.useState<any>([])
  const [HighTestData, setHighTestData] = React.useState<any>([])

  //datatable
  const [WSTableRowData, setWSTableRowData] = React.useState<any>([])
  const [WSTableRowDataClean, setWSTableRowDataClean] = React.useState<any>([])
  const [WSTableRowDataPrev, setWSTableRowDataPrev] = React.useState<any>([])
  const [WSTableColumnData, setWSTableColumnData] = React.useState<any>([
    { field: 'date', headerName: 'Time', editable: false },
    { field: 'tradeprice', headerName: 'TradePrice', editable: false },
    { field: 'lowprice', headerName: 'LowPrice', editable: false },
    { field: 'highprice', headerName: 'HighPrice', editable: false },
    { field: 'openingprice', headerName: 'OpeningPrice', editable: false },
  ])

  const webSocketUrl = `ws://192.168.1.27:8000/api/ws`
  const ws = React.useRef(null)

  React.useEffect(() => {
    getChartData()
    getsocketChartData()
  }, [])

  React.useEffect(() => {
    console.log(props.ChartShow)
    console.log(props.TableShow)
  }, [props])

  React.useEffect(() => {
    // console.log('changeWsData')
    // console.log(WsData)
    // console.log(PrevChartData)
    // console.log(TestData)
    if (WsData.length !== 0) {
      if (props.CallData === 'TradePrice') {
        const test = [...PrevChartData]
        test.unshift(WsData)
        test.pop()
        setPrevChartData(test)
        setTestData(test)
      } else if (props.CallData === 'OpeningPrice') {
        let openingTest: any = []
        //console.log(OpeningPricePrevData)
        if (OpeningPricePrevData !== undefined) {
          if (OpeningPricePrevData.length !== 0) {
            openingTest = [...OpeningPricePrevData]
          }
        }
        // console.log('[ Opening Price Prev ---->>>>>> ]')
        // console.log(openingTest)
        // console.log(WsData)
        if (openingTest.length < 100) {
          openingTest.unshift(WsData)
          setOpeningPricePrevData(openingTest)
          setOpeningTestData(openingTest)
        } else {
          openingTest.unshift(WsData)
          openingTest.pop()
          setOpeningPricePrevData(openingTest)
          setOpeningTestData(openingTest)
        }
      } else if (props.CallData === 'LowPrice') {
        let lowTest: any = []
        //console.log(LowPricePrevData)
        if (LowPricePrevData !== undefined) {
          if (LowPricePrevData.length !== 0) {
            lowTest = [...LowPricePrevData]
          }
        }
        // console.log('[ Low Price Prev ---->>>>>> ]')
        // console.log(lowTest)
        // console.log(WsData)
        if (lowTest.length < 100) {
          lowTest.unshift(WsData)
          setLowPricePrevData(lowTest)
          setLowTestData(lowTest)
        } else {
          lowTest.unshift(WsData)
          lowTest.pop()
          setLowPricePrevData(lowTest)
          setLowTestData(lowTest)
        }
      } else if (props.CallData === 'HighPrice') {
        let highTest: any = []
        // console.log(HighPricePrevData)
        if (HighPricePrevData !== undefined) {
          if (HighPricePrevData.length !== 0) {
            highTest = [...HighPricePrevData]
          }
        }
        // console.log('[ High Price Prev ---->>>>>> ]')
        // console.log(highTest)
        // console.log(WsData)
        if (highTest.length < 100) {
          highTest.unshift(WsData)
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        } else {
          highTest.unshift(WsData)
          highTest.pop()
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        }
      } else {
        let TableRowTest: any = []
        //console.log(WSTableRowDataPrev)
        if (WSTableRowDataPrev !== undefined) {
          if (WSTableRowDataPrev.length !== 0) {
            TableRowTest = [...WSTableRowDataPrev]
          }
        }
        // console.log('[ Table Row Price Prev ---->>>>>> ]')
        // console.log(TableRowTest)
        // console.log(WsData)
        if (TableRowTest.length < 10) {
          TableRowTest.push(WsData)
          setWSTableRowDataPrev(TableRowTest)
          setWSTableRowData(TableRowTest)
        } else {
          TableRowTest.splice(0, 1)
          TableRowTest.push(WsData)
          setWSTableRowDataPrev(TableRowTest)
          setWSTableRowData(TableRowTest)
        }
      }
    }
  }, [WsData])

  React.useEffect(() => {
    if (TestData.length !== 0) {
      SocketChangeData(TestData)
    }
  }, [TestData])

  React.useEffect(() => {
    if (OpeningTestData.length !== 0) {
      SocketChangeData(OpeningTestData)
    }
  }, [OpeningTestData])

  React.useEffect(() => {
    if (LowTestData.length !== 0) {
      SocketChangeData(LowTestData)
    }
  }, [LowTestData])

  React.useEffect(() => {
    if (HighTestData.length !== 0) {
      SocketChangeData(HighTestData)
    }
  }, [HighTestData])

  React.useEffect(() => {
    const newArray = WSTableRowData.filter((item: any, i: any) => {
      return (
        WSTableRowData.findIndex((item2: any, j: any) => {
          return item.date.toString() === item2.date.toString()
        }) === i
      )
    })
    setWSTableRowDataClean(newArray)
  }, [WSTableRowData])

  const SocketChangeData = (t: any) => {
    if (t[0].date !== undefined && t[0].value !== undefined) {
      DrawD3LineChart(t)
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
        wsObj.date = parseData[0].candleDateTimeKst.split('-')[2].substr(3, 8)
        wsObj.tradeprice = parseData[0].tradePrice
        wsObj.lowprice = parseData[0].lowPrice
        wsObj.highprice = parseData[0].highPrice
        wsObj.openingprice = parseData[0].openingPrice
      }

      setWsData(wsObj)
    }
    ws.current.onclose = function () {
      console.log('ws close... ')

      setTimeout(function () {
        getsocketChartData()
      }, 1000)
    }
  }

  const DrawD3LineChartPrev = () => {
    const svg2 = d3.select(svgRef2.current)

    const margin = { top: 25, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

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
        .attr('x1', margin.top)
        .attr('x2', width + margin.left)
        .attr('y1', (d: any) => y(d))
        .attr('y2', (d: any) => y(d))

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

    const y: any = d3.scaleLinear().range([height, 0]).nice()

    const Yposition = d3.axisLeft(y)
    const Xposition = d3.axisBottom(x)

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(Xposition)
    svg2.append('g').attr('transform', `translate(40,3)`).call(Yposition)
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
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
      // console.log('------------------------------')
      // console.log(rtnData)
    } else {
      rtnData = data
    }

    if (rtnData[0].x !== undefined && rtnData[0].y !== undefined) {
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
    let y: any
    if (props.CallData === 'OpeningPrice' || props.CallData === 'HighPrice' || props.CallData === 'LowPrice') {
      y = d3
        .scaleLinear()
        .domain([max - 20, max + 20])
        .range([height, 0])
        .nice()
    } else {
      y = d3.scaleLinear().domain([min, max]).range([height, 0]).nice()
    }
    x.domain(
      d3.extent(rtnData, (d: any) => {
        return d.date
      })
    )

    // Accessors
    const parseDate2 = d3.timeParse('%Y-%m-%d')
    const xAccessor = (d: any) => parseDate2(d.date)
    const yAccessor = (d: any) => parseInt(d.close)

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

    const Yposition = d3.axisLeft(y)
    const Xposition = d3.axisBottom(x)

    let xAxis: any

    if (props.CallData === 'OpeningPrice' || props.CallData === 'HighPrice' || props.CallData === 'LowPrice') {
      const newArray = data.filter((item: any, i: any) => {
        return (
          data.findIndex((item2: any, j: any) => {
            return item.date.toString() === item2.date.toString()
          }) === i
        )
      })

      const arr: any = []
      for (let i = 0, len = newArray.length; i < len; i++) {
        arr.push(newArray[i].date)
      }

      xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(Xposition.tickValues(arr))
    } else {
      xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(Xposition)
    }
    svg2.append('g').attr('transform', `translate(40,3)`).call(Yposition)
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
    // .append('text')
    // .attr('x', width / 2)
    // .attr('y', 0 - margin.top / 2)
    // .attr('text-anchor', 'middle')
    // .style('font-size', '16px')
    // // .style("text-decoration", "underline")
    // .text('Trade Price')

    // Y axis label 추가
    // Add brushing
    /**
     * 2023.06.08 주석 처리
     */
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
    //     } else {
    //       x.domain([x.invert(extent[0]), x.invert(extent[1])])
    //       svg2.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //     }

    //     // Update axis and line position
    //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
    //     svg2
    //       .select('.line')
    //       .transition()
    //       .duration(1000)
    //       .attr(
    //         'd',
    //         d3
    //           .line()
    //           .x((d: any) => {
    //             return x(d.date)
    //           })
    //           .y((d: any) => {
    //             return y(d.value)
    //           })
    //       )
    //   })

    const tooltip = d3.select('#tooltip')
    const tooltipDot = svg2
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#fc8781')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .style('pointer-events', 'none')

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
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .data([rtnData])
      .attr('transform', 'translate(50,0)')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', props.Color)
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)
      .on('touchmouse mousemove', function (event) {
        const mousePos = d3.pointer(event, this)

        // x coordinate stored in mousePos index 0
        const date = x.invert(mousePos[0])
        console.log(date)
      })
      .on('mouseleave', function (event) {
        const a = event
      })

    //tooltip
    svg2
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0)
      .on('touchmouse mousemove', function (event) {
        const mousePos = d3.pointer(event, this)
        // x coordinate stored in mousePos index 0
        const date = x.invert(mousePos[0])

        // Custom Bisector - left, center, right
        const dateBisector = d3.bisector(xAccessor).left
        const bisectionIndex = dateBisector(data, date)
        const hoveredIndexData = data[bisectionIndex - 1]

        // Update Image
        tooltipDot
          .style('opacity', 1)
          .attr('cx', x(xAccessor(hoveredIndexData)))
          .attr('cy', y(yAccessor(hoveredIndexData)))
      })
      .on('mouseleave', function (event) {
        const a = event
      })

    // svg2.append('rect').attr('width', width).attr('height', height).style('opacity', 0)
    // .on('touchmouse mousemove', function (event) {
    //   const mousePos = d3.pointer(event, this)
    //   // x coordinate stored in mousePos index 0
    //   const date = x.invert(mousePos[0])

    //   const xAccessor = (d: any) => parseDate(parseTime(d.date))
    //   const yAccessor = (d: any) => parseInt(d.value)

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

    // .on('mouseleave', function (event) {[-[]]
    //   const mousePos = d3.pointer(event, this)
    // })

    //select all path fill 지정
    // svg2.selectAll('path').attr('fill', 'none')
    // svg2.selectAll('line').attr('fill', 'none')

    /**
     * 2023.06.08 주석 처리
     */
    //svg2.append('g').attr('class', 'brush').attr('transform', 'translate(50,0)').call(brush)
    //
    // If user double click, reinitialize the chart
    // svg2.on('dblclick', () => {
    //   x.domain(
    //     d3.extent(rtnData, (d: any) => {
    //       return d.date
    //     })
    //   )
    //   xAxis.transition().call(d3.axisBottom(x))
    //   svg2
    //     .select('.line')
    //     .transition()
    //     .attr(
    //       'd',
    //       d3
    //         .line()
    //         .x((d: any) => {
    //           return x(d.date)
    //         })
    //         .y((d: any) => {
    //           return y(d.value)
    //         })
    //     )
    // })

    // // A function that set idleTimeOut to null
    // let idleTimeout: any
    // function idled() {
    //   idleTimeout = null
    // }
  }

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      // .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .get('http://192.168.1.27:8000/api/websocket/data')
      .then((response) => {
        // console.log('[ Chart response data ] : ')
        // console.log(response.data)

        if (props.CallData === 'TradePrice') {
          setPrevChartData(response.data)
          DrawD3LineChart(response.data)
        } else if (props.CallData === 'OpeningPrice') {
          setOpeningPricePrevData([])
          DrawD3LineChartPrev()
        } else if (props.CallData === 'LowPrice') {
          setLowPricePrevData([])
          DrawD3LineChartPrev()
        } else {
          setHighPricePrevData([])
          DrawD3LineChartPrev()
        }

        return response.data
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

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

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

    const x: any = d3.scaleTime().range([0, width])
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
      // x.domain([latestMth, latestMin])
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
    <>
      <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {/*d3 line chart*/}
        {/* <div>Websocket</div> */}
        <Wrapper ref={svgRef2} ChartShow={props.ChartShow} />
        <div id="tooltip" className="tooltip">
          <div className="tooltip-date">
            <span id="date"></span>
          </div>
          <div className="tooltip-Value">
            Value : <span id="value"></span>
          </div>
        </div>
        {/* <Plot data={chartData} layout={layoutOption} /> */}
      </Chakra.Box>

      <DataGridWrap className={'ag-theme-alpine'} TableShow={props.TableShow}>
        <AgGridReact
          rowData={WSTableRowDataClean}
          columnDefs={WSTableColumnData}
          defaultColDef={{
            flex: 1,
            editable: true,
          }}
          enableCellChangeFlash={false}
          editType={'fullRow'}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </DataGridWrap>
    </>
  )
}

export default D3LineChartTooltip
