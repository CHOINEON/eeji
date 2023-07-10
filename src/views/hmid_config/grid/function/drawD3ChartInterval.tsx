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

export const D3LineChartInterval: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()
  const svgContainer = React.useRef(null)

  const [IntervalData, setIntervalData] = React.useState<any>([])
  const [lastDate, setLastDate] = React.useState<any>()

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

  React.useEffect(() => {
    getChartData()
  }, [])

  React.useEffect(() => {
    console.log('[ Props Width, Height ] : ', props.widthSize + ' , ' + props.heightSize)
    setWidth(props.widthSize)
    setHeight(props.heightSize)
    if (IntervalData.length === 0) {
      if (props.CallData === 'TradePrice') {
        getChartData()
      } else {
        DrawD3LineChartPrev()
      }
    } else {
      DataFactory(IntervalData)
    }
  }, [props.widthSize, props.heightSize])

  const DataFactory = (IntervalData: any) => {
    if (IntervalData.length !== 0) {
      if (props.CallData === 'TradePrice') {
        changeDate(IntervalData.date)
        const test = [...PrevChartData]
        test.unshift(IntervalData)
        test.pop()
        setPrevChartData(test)
        setTestData(test)
      } else if (props.CallData === 'OpeningPrice') {
        changeDate(IntervalData.date)
        let openingTest: any = []
        if (OpeningPricePrevData !== undefined) {
          if (OpeningPricePrevData.length !== 0) {
            openingTest = [...OpeningPricePrevData]
          }
        }
        if (openingTest.length < 10) {
          openingTest.unshift(IntervalData)
          setOpeningPricePrevData(openingTest)
          setOpeningTestData(openingTest)
        } else {
          openingTest.unshift(IntervalData)
          openingTest.pop()
          setOpeningPricePrevData(openingTest)
          setOpeningTestData(openingTest)
        }
      } else if (props.CallData === 'LowPrice') {
        changeDate(IntervalData.date)
        let lowTest: any = []
        if (LowPricePrevData !== undefined) {
          if (LowPricePrevData.length !== 0) {
            lowTest = [...LowPricePrevData]
          }
        }
        if (lowTest.length < 10) {
          lowTest.unshift(IntervalData)
          setLowPricePrevData(lowTest)
          setLowTestData(lowTest)
        } else {
          lowTest.unshift(IntervalData)
          lowTest.pop()
          setLowPricePrevData(lowTest)
          setLowTestData(lowTest)
        }
      } else if (props.CallData === 'HighPrice') {
        changeDate(IntervalData.date)
        let highTest: any = []
        if (HighPricePrevData !== undefined) {
          if (HighPricePrevData.length !== 0) {
            highTest = [...HighPricePrevData]
          }
        }
        if (highTest.length < 10) {
          highTest.unshift(IntervalData)
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        } else {
          highTest.unshift(IntervalData)
          highTest.pop()
          setHighPricePrevData(highTest)
          setHighTestData(highTest)
        }
      } else if (props.CallData === 'DataTable') {
        let TableRowTest: any = []
        if (WSTableRowDataPrev !== undefined) {
          changeDate(IntervalData.date)
          if (WSTableRowDataPrev.length !== 0) {
            TableRowTest = [...WSTableRowDataPrev]
          }
        }
        if (TableRowTest.length < 10) {
          changeDate(IntervalData.date)
          TableRowTest.push(IntervalData)
          setWSTableRowDataPrev(TableRowTest)
          setWSTableRowData(TableRowTest)
        } else {
          changeDate(IntervalData.date)
          TableRowTest.splice(0, 1)
          TableRowTest.push(IntervalData)
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
          for (const i in IntervalData) {
            multipleTest.unshift(IntervalData[i])
          }
          changeDate(multipleTest[0].date)

          setMultiplePrevData(multipleTest)
          setMultipleTestData(multipleTest)
        } else {
          changeDate(multipleTest[0].date)
          for (const j in IntervalData) {
            if (multipleTest.length < 30) {
              multipleTest.unshift(IntervalData[j])
              setMultiplePrevData(multipleTest)
              setMultipleTestData(multipleTest)
            } else {
              multipleTest.unshift(IntervalData[j])
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

  // interval
  React.useEffect(() => {
    DataFactory(IntervalData)
  }, [IntervalData])

  // interval
  React.useEffect(() => {
    if (TestData.length !== 0) {
      IntervalChangeData(TestData)
    }
  }, [TestData])

  React.useEffect(() => {
    if (OpeningTestData.length !== 0) {
      IntervalChangeData(OpeningTestData)
    }
  }, [OpeningTestData])

  React.useEffect(() => {
    if (LowTestData.length !== 0) {
      IntervalChangeData(LowTestData)
    }
  }, [LowTestData])

  React.useEffect(() => {
    if (HighTestData.length !== 0) {
      IntervalChangeData(HighTestData)
    }
  }, [HighTestData])

  React.useEffect(() => {
    if (MultipleTestData.length !== 0) {
      IntervalChangeData(MultipleTestData)
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

  // interval
  React.useEffect(() => {
    if (lastDate !== undefined) {
      console.log('[ date change use effect ! ]')
      console.log(lastDate)

      const timeout = setTimeout(function () {
        getIntervalData(lastDate)
      }, 60000)

      clearTimeout(timeout)
    }
  }, [lastDate])

  const IntervalChangeData = (t: any) => {
    if (props.CallData !== 'Opening & High & Low') {
      if (t[0].date !== undefined && t[0].value !== undefined) {
        DrawD3LineChartInterval(t)
      }
    } else {
      if (t[0].name !== undefined) {
        console.log('draw chart data')
        console.log(t)
        DrawD3MultipleSeriesLineChart(t)
      }
    }
  }

  const changeDate = (date_args: any) => {
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

  //Interval Data
  const getIntervalData = (date: string) => {
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/websocket/interval?from_date=' + date).then((response) => {
      console.log('Interval Chart Data')
      console.log(response.data[0])

      const ItObj: any = new Object()
      const parseData = response.data[0]
      let wsObj: any = new Object()
      const wsArr: any = []
      const multipleKey = ['openingPrice', 'highPrice', 'lowPrice']
      console.log(props.CallData)

      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst

      // ItObj.date = new Date(response.data.x)
      // ItObj.value = response.data.y

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
        wsObj.date = new Date(parseData.candleDateTimeKst)
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
        setIntervalData(wsObj)
      } else {
        console.log(wsArr)
        setIntervalData(wsArr)
      }

      return ItObj
    })
  }

  const DrawD3LineChartPrev = () => {
    const svg2 = d3.select(svgRef.current)

    const margin = { top: 25, right: 50, bottom: 50, left: 70 }
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

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
  }

  const DrawD3MultipleSeriesLineChart = (data: any) => {
    if (props.CallData === 'Opening & High & Low') {
      const svg2 = d3.select(svgRef.current)

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

      const sumstat = Array.from(
        d3.group(data, (d: any) => d.name),
        ([key, values]) => ({ key, values })
      )
      console.log('ArrayData :', sumstat)

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
        // .domain([
        //   0,
        //   d3.max(data, function (d: any) {
        //     return +d
        //   }),
        // ])
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
      // console.log(sumstat)
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

  const DrawD3LineChartInterval = (data: any) => {
    const svg2 = d3.select(svgRef.current)
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

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      // .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/websocket/data')
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        const date = changeDate(response.data[0].x)
        if (props.CallData === 'TradePrice') {
          setPrevChartData(response.data)
          DrawD3LineChartInterval(response.data)
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
          <Wrapper ref={svgRef} ChartShow={props.ChartShow} />
          <div id="tooltip" className="tooltip">
            <div className="tooltip-date">
              <span id="date"></span>
            </div>
            <div className="tooltip-Value">
              Value : <span id="value"></span>
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

export default D3LineChartInterval
