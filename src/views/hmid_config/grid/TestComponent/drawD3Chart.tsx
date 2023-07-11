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
  CallData: 'TradePrice' | 'HighPrice' | 'LowPrice' | 'OpeningPrice' | 'DataTable' | 'Opening & High & Low'
  Color: string
  ChartShow: boolean
  TableShow: boolean
  Multiple: boolean
}

export const D3LineChart: React.FC<LineChartPorps> = (props) => {
  const svgRef2 = React.useRef()
  const svgContainer = React.useRef(null)

  const [WsData, setWsData] = React.useState<any>([])
  const [reWsData, setReWsData] = React.useState<any>([])

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

  //multiple series
  const [MultiplePrevData, setMultiplePrevData] = React.useState<any>([])
  const [MultipleTestData, setMultipleTestData] = React.useState<any>([])

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

  const [widthState, setWidth] = React.useState<any>(props.widthSize)
  const [heightState, setHeight] = React.useState<any>(props.heightSize)

  //websocket 주소
  // const webSocketUrl = `ws://demo.ineeji.com/ws`
  const webSocketUrl = `ws://192.168.1.27:8000/api/ws`
  const ws = React.useRef(null)

  React.useEffect(() => {
    getChartData()
    getsocketChartData()
  }, [])

  React.useEffect(() => {
    //console.log('[ Props Width, Height ] : ', props.widthSize + ' , ' + props.heightSize)
    setWidth(props.widthSize)
    setHeight(props.heightSize)
    if (WsData.length === 0) {
      if (props.CallData === 'TradePrice') {
        getChartData()
      } else {
        DrawD3LineChartPrev()
      }
    } else {
      DataFactory(WsData)
    }
  }, [props.widthSize, props.heightSize])

  const DataFactory = (WsData: any) => {
    if (WsData.length !== 0) {
      if (props.CallData === 'TradePrice') {
        const test = [...PrevChartData]
        test.unshift(WsData)
        test.pop()
        setPrevChartData(test)
        setTestData(test)
      } else if (props.CallData === 'OpeningPrice') {
        let openingTest: any = []
        if (OpeningPricePrevData !== undefined) {
          if (OpeningPricePrevData.length !== 0) {
            openingTest = [...OpeningPricePrevData]
          }
        }
        if (openingTest.length < 10) {
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
        if (LowPricePrevData !== undefined) {
          if (LowPricePrevData.length !== 0) {
            lowTest = [...LowPricePrevData]
          }
        }
        if (lowTest.length < 10) {
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
        if (HighPricePrevData !== undefined) {
          if (HighPricePrevData.length !== 0) {
            highTest = [...HighPricePrevData]
          }
        }
        if (highTest.length < 10) {
          highTest.unshift(WsData)
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        } else {
          highTest.unshift(WsData)
          highTest.pop()
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        }
      } else if (props.CallData === 'DataTable') {
        let TableRowTest: any = []
        if (WSTableRowDataPrev !== undefined) {
          if (WSTableRowDataPrev.length !== 0) {
            TableRowTest = [...WSTableRowDataPrev]
          }
        }
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
      } else {
        let multipleTest: any = []
        if (MultiplePrevData !== undefined) {
          if (MultiplePrevData.length !== 0) {
            multipleTest = [...MultiplePrevData]
          }
        }
        if (multipleTest.length === 0) {
          for (const i in WsData) {
            multipleTest.unshift(WsData[i])
          }

          setMultiplePrevData(multipleTest)
          setMultipleTestData(multipleTest)
        } else {
          for (const j in WsData) {
            if (multipleTest.length < 30) {
              multipleTest.unshift(WsData[j])
              setMultiplePrevData(multipleTest)
              setMultipleTestData(multipleTest)
            } else {
              multipleTest.unshift(WsData[j])
              multipleTest.pop()
              multipleTest.pop()
              multipleTest.pop()

              console.log(multipleTest)
              setMultiplePrevData(multipleTest)
              setMultipleTestData(multipleTest)
            }
          }
        }
      }
    }
  }

  React.useEffect(() => {
    DataFactory(WsData)
  }, [WsData, reWsData])

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
    if (MultipleTestData.length !== 0) {
      SocketChangeData(MultipleTestData)
    }
  }, [MultipleTestData])

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

  const SocketChangeData = (chgData: any) => {
    if (props.CallData !== 'Opening & High & Low') {
      if (chgData[0].date !== undefined && chgData[0].value !== undefined) {
        DrawD3LineChart(chgData)
      }
    } else {
      if (chgData[0].name !== undefined) {
        DrawD3MultipleSeriesLineChart(chgData)
      }
    }
  }

  //웹소켓
  const getsocketChartData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection !!!! ')
    }
    ws.current.onmessage = function (event: any) {
      // console.log('[ ws Return Data ]')
      // console.log(JSON.parse(event.data))

      const parseData = JSON.parse(event.data)[0]
      let wsObj: any = new Object()
      const wsArr: any = []
      const multipleKey = ['openingPrice', 'highPrice', 'lowPrice']

      if (props.CallData === 'TradePrice') {
        wsObj.date = new Date(parseData.candleDateTimeKst)
        wsObj.value = parseData.tradePrice
      } else if (props.CallData === 'HighPrice') {
        wsObj.date = new Date(parseData.candleDateTimeKst)
        wsObj.value = parseData.highPrice
      } else if (props.CallData === 'LowPrice') {
        wsObj.date = new Date(parseData.candleDateTimeKst)
        wsObj.value = parseData.lowPrice
      } else if (props.CallData === 'OpeningPrice') {
        wsObj.date = new Date(parseData.candleDateTimeKst)
        wsObj.value = parseData.openingPrice
      } else if (props.CallData === 'DataTable') {
        wsObj.date = parseData.candleDateTimeKst.split('-')[2].substr(3, 8)
        wsObj.tradeprice = parseData.tradePrice
        wsObj.lowprice = parseData.lowPrice
        wsObj.highprice = parseData.highPrice
        wsObj.openingprice = parseData.openingPrice
      } else {
        for (const j in multipleKey) {
          wsObj.name = multipleKey[j]
          wsObj.date = new Date(parseData['candleDateTimeKst'])
          wsObj.value = parseData[multipleKey[j]]
          wsArr.push(wsObj)
          wsObj = new Object()
        }
      }

      if (props.CallData !== 'Opening & High & Low') {
        setWsData(wsObj)
      } else {
        console.log(wsArr)
        setWsData(wsArr)
      }
    }
    ws.current.onclose = function () {
      console.log('ws close... ')

      const timeout = setTimeout(function () {
        getsocketChartData()
      }, 1000)

      clearTimeout(timeout)
    }
  }

  //data 그리기 이전에 grid draw
  const DrawD3LineChartPrev = () => {
    const svg2 = d3.select(svgRef2.current)

    const margin = { top: 25, right: 50, bottom: 50, left: 70 }
    // width = props.widthSize - margin.left - margin.right,
    // height = props.heightSize - margin.top - margin.bottom
    let width: any = 0,
      height: any = 0
    if (widthState !== undefined && heightState !== undefined) {
      width = widthState - margin.left - margin.right
      height = heightState - margin.top - margin.bottom
    }

    svg2.selectAll('g').remove()

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

    const y: any = d3.scaleLinear().range([height, 0])

    svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
  }

  //기본 d3LineChart
  const DrawD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef2.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    let rtnData = data

    if (props.CallData !== 'TradePrice') {
      rtnData = data
      rtnData.splice(rtnData.length - 300, rtnData.length - 100)
    } else if (props.CallData !== 'TradePrice' && props.CallData !== 'Opening & High & Low') {
      rtnData = data
    }

    if (rtnData[0].x !== undefined && rtnData[0].y !== undefined) {
      svg2.selectAll('g').remove()
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

    const Value = rtnData.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    const margin = { top: 20, right: 50, bottom: 50, left: 70 }
    let width: any = 0,
      height: any = 0
    if (widthState !== undefined && heightState !== undefined) {
      width = widthState - margin.left - margin.right
      height = heightState - margin.top - margin.bottom
    }

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
    } else {
      y = d3.scaleLinear().domain([min, max]).range([height, 0])
    }
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

      xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).tickValues(arr))
    } else {
      xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    }
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
  }

  //multiseries chart
  const DrawD3MultipleSeriesLineChart = (data: any) => {
    if (props.CallData === 'Opening & High & Low') {
      const svg2 = d3.select(svgRef2.current)

      const parseTime = d3.timeFormat('%H:%M:%S')
      const parseDate = d3.timeParse('%H:%M:%S')

      //redraw
      svg2.selectAll('g').remove()
      data.forEach((d: any) => {
        d.date = parseDate(parseTime(d.date))
        d.value = d.value
      })

      const Value = data.map((v: any) => {
        return v.value
      })

      const max = Math.max.apply(null, Value)
      const min = Math.min.apply(null, Value)

      /** resize Chart Size */
      const margin = { top: 20, right: 50, bottom: 50, left: 70 }
      let width: any = 0,
        height: any = 0
      if (widthState !== undefined && heightState !== undefined) {
        width = widthState - margin.left - margin.right
        height = heightState - margin.top - margin.bottom
      }

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

      // data group화
      const sumstat = Array.from(
        d3.group(data, (d: any) => d.name),
        ([key, values]) => ({ key, values })
      )

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
        .domain([min - 20, max + 20])
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

      svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).tickValues(arr))
      svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

      //grid 그리기
      svg2.append('g').call(xGrid)
      svg2.append('g').call(yGrid)
      svg2
        .append('g')
        .append('rect')
        .attr('x', width / 4)
        .attr('y', height + 40)
        .attr('width', 4)
        .attr('height', 2)
        .style('fill', 'orange')
      svg2
        .append('g')
        .append('text')
        .attr('x', width / 4 + 8)
        .attr('y', height + 40)
        .text('low')
        .style('font-size', '14px')
        .attr('alignment-baseline', 'middle')
      svg2
        .append('g')
        .append('rect')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('width', 4)
        .attr('height', 2)
        .style('fill', 'purple')
      svg2
        .append('g')
        .append('text')
        .attr('x', width / 2 + 8)
        .attr('y', height + 40)
        .text('high')
        .style('font-size', '14px')
        .attr('alignment-baseline', 'middle')
      svg2
        .append('g')
        .append('rect')
        .attr('x', width / 1.5 + 15)
        .attr('y', height + 40)
        .attr('width', 4)
        .attr('height', 2)
        .style('fill', 'green')
      svg2
        .append('g')
        .append('text')
        .attr('x', width / 1.5 + 23)
        .attr('y', height + 40)
        .text('opening')
        .style('font-size', '14px')
        .attr('alignment-baseline', 'middle')

      // color palette
      const res: any = sumstat.map(function (d: any) {
        return d.key
      }) // list of group names

      const color: any = d3.scaleOrdinal().domain(res).range(['orange', 'purple', 'green'])
      // Draw the line
      svg2
        .append('g')
        .attr('clip-path', 'url(#clip)')
        // .append('path')
        .selectAll('.line')
        .data(sumstat)
        .enter()
        .append('path')
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
    }
  }

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      // .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/websocket/data')
      .then((response) => {
        if (props.CallData === 'TradePrice') {
          setPrevChartData(response.data)
          DrawD3LineChart(response.data)
        } else if (props.CallData === 'OpeningPrice') {
          setOpeningPricePrevData([])
          DrawD3LineChartPrev()
        } else if (props.CallData === 'LowPrice') {
          setLowPricePrevData([])
          DrawD3LineChartPrev()
        } else if (props.CallData === 'HighPrice') {
          setHighPricePrevData([])
          DrawD3LineChartPrev()
        } else if (props.CallData === 'Opening & High & Low') {
          setMultiplePrevData([])
          DrawD3LineChartPrev()
        }

        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <div ref={svgContainer}>
          <Wrapper ref={svgRef2} ChartShow={props.ChartShow} />
          <div id="tooltip" className="tooltip">
            <div className="tooltip-date">
              <span id="date"></span>
            </div>
          </div>
        </div>
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

export default D3LineChart
