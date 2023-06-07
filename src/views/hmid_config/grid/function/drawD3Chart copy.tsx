import React, { ReactNode } from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import axios from 'axios'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  Calltype: 'WS' | 'Interval'
}

export const D3LineChart: React.FC = () => {
  const svgRef = React.useRef()
  const svgRef2 = React.useRef()

  const PrevChatDataVal: any = []

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
    //getPlotData()
  }, [])

  // React.useEffect(() => {
  //   if (PrevChartData !== undefined && PrevChartData.length !== 0) {
  //     console.log('[ PrevChartData UseEffect !!!! ]')
  //     console.log(PrevChartData)

  //     DrawD3LineChart(PrevChartData)
  //   }
  // }, [PrevChartData])

  //plotly chart test
  const getPlotData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData1?', ['Tag-34'])
      .then((response) => {
        // console.log('[ Chart response data ] : ')
        // console.log(response.data)
        // setChartData(response.data)
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

    if (data[0].x !== undefined && data[0].y !== undefined) {
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

    console.log('[ chart draw get Data ]')
    console.log(data)
    // console.log('[ Chart Draw Data ]')
    // console.log(data)

    const Value = data.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

    // append the svg object to the body of the page
    svg2
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

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y))

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
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)

    //select all path fill 지정
    // svg2.selectAll('path').attr('fill', 'none')
    // svg2.selectAll('line').attr('fill', 'none')

    svg2.append('g').attr('class', 'brush').attr('transform', 'translate(50,0)').call(brush)

    // If user double click, reinitialize the chart
    svg2.on('dblclick', () => {
      x.domain(
        d3.extent(data, (d: any) => {
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

  //d3 line chart
  const getChartData = async () => {
    const data: any = await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/chartData3?', ['Tag-34'])
      // .get('http://192.168.1.27:8001/api/websocket/data')
      .then((response) => {
        console.log('[ Chart response data ] : ')
        console.log(response.data)

        // changeDate(response.data[0])

        // setPrevChartData(response.data)

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
      <Wrapper ref={svgRef} />

      {/*d3 scatter plot chart*/}
      <Wrapper ref={svgRef2} />

      {/* <Plot data={chartData} layout={layoutOption} /> */}
    </Chakra.Box>
  )
}

export default D3LineChart
