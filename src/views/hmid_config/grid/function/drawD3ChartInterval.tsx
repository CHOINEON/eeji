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
  CallData: 'TradePrice' | 'HighPrice' | 'LowPrice' | 'OpeningPrice' | 'DataTable'
  Color: string
  ChartShow: boolean
  TableShow: boolean
}

export const D3LineChartInterval: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()

  const [IntervalData, setIntervalData] = React.useState<any>([])

  const [PrevIntervalData, setPrevIntervalData] = React.useState<any>([])
  const [IntervalTestData, setIntervalTestData] = React.useState<any>([])
  const [lastDate, setLastDate] = React.useState<any>()

  React.useEffect(() => {
    getChartData()
  }, [])

  // interval
  React.useEffect(() => {
    if (IntervalData.length !== 0) {
      if (PrevIntervalData !== undefined) {
        // console.log(PrevIntervalData)
        console.log('Effect Interval!!!!!!!!!!')
        console.log(IntervalData)
        changeDate(IntervalData.date)
        const interval_test = [...PrevIntervalData]
        interval_test.unshift(IntervalData)
        interval_test.pop()
        setPrevIntervalData(interval_test)
        setIntervalTestData(interval_test)
      }
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

      setTimeout(function () {
        getIntervalData(lastDate)
      }, 60000)

      // clearTimeout(time)
    }
  }, [lastDate])

  // interval
  const IntervalChangeData = (t: any) => {
    if (t[0].date !== undefined && t[0].value !== undefined) {
      console.log('useEffect get Data')
      console.log(t)
      console.log('-------------------')

      DrawD3LineChartInterval(t)
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

  //Interval Data
  const getIntervalData = (date: string) => {
    axios.get(process.env.REACT_APP_API_SERVER_URL + '/api/websocket/interval?from_date=' + date).then((response) => {
      console.log('Interval Chart Data')
      console.log(response.data)

      const ItObj: any = new Object()

      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst

      ItObj.date = new Date(response.data.x)
      ItObj.value = response.data.y

      setIntervalData(ItObj)

      return ItObj
    })
  }

  const DrawD3LineChartInterval = (data: any) => {
    if (props.CallData != 'TradePrice') {
      console.log(data)
    }
    const svg = d3.select(svgRef.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    if (data[0].x !== undefined && data[0].y !== undefined) {
      // console.log('first data !!!')

      data.forEach((d: any) => {
        d.date = parseDate(parseTime(new Date(d.x)))
        d.value = d.y
        delete d.x
        delete d.y
      })
    } else {
      // console.log(' redraw Interval !!! ')
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

    const margin = { top: 20, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg
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
      d3.extent(data, (d: any) => {
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
    //기본 y축 데이터 넣을 때
    // y.domain([
    //   0,
    //   d3.max(data, (d: any) => {
    //     return d.value
    //   }),
    // ])

    const xAxis = svg.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

    //grid 그리기
    svg.append('g').call(xGrid)
    svg.append('g').call(yGrid)
    svg
      .append('g')
      .append('rect')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('width', 10)
      .attr('height', 2)
      .style('fill', props.Color)
    svg
      .append('g')
      .append('text')
      .attr('x', width / 2 + 20)
      .attr('y', height + 40)
      .text(props.CallData)
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // Y axis label 추가
    // svg2
    //   .append('text')
    //   .attr('text-anchor', 'end')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', -margin.left + 40)
    //   .attr('x', -margin.top)
    //   .text('Y axis title')

    // Add brushing
    /**
     * 2023.06.08 Brush 주석 처리
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
    //       svg.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //     }

    //     // Update axis and line position
    //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
    //     svg
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
      .attr('stroke', props.Color)
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)

    // //select all path fill 지정
    // // svg2.selectAll('path').attr('fill', 'none')
    // // svg2.selectAll('line').attr('fill', 'none')

    // svg.append('g').attr('class', 'brush').attr('transform', 'translate(50,0)').call(brush)

    // // If user double click, reinitialize the chart
    // svg.on('dblclick', () => {
    //   x.domain(
    //     d3.extent(data, (d: any) => {
    //       return d.date
    //     })
    //   )
    //   xAxis.transition().call(d3.axisBottom(x))
    //   svg
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
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/websocket/data')
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        const date = changeDate(response.data[0].x)
        // getIntervalData(date)
        setPrevIntervalData(response.data)
        DrawD3LineChartInterval(response.data)

        // getIntervalData()
        // return response.data

        // setData(response.data[0].y)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/*d3 scatter plot chart */}
      <Wrapper ref={svgRef} />

      {/* <Plot data={chartData} layout={layoutOption} /> */}
    </Chakra.Box>
  )
}

export default D3LineChartInterval
