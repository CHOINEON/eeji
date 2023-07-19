/**
 * 2023-07-05
 * 박윤희
 * d3 scatter plot chart 코드 정리
 */

import React from 'react'
import styled from '@emotion/styled'
import * as d3 from 'd3'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

export interface D3ScatterPlotProps {
  widthSize: any
  heightSize: any
  Data: any
  DataName: string
  Color: string
}

export const D3ScatterPlotChart: React.FC<D3ScatterPlotProps> = (props) => {
  const svgRef = React.useRef()

  React.useEffect(() => {
    if (Object.keys(props.Data[0]).length > 2) {
      DrawMultipleSeriesScatterPlotChart(props.Data)
    } else {
      DrawD3ScatterPlotChart(props.Data)
    }
  }, [props.Data])

  const DrawMultipleSeriesScatterPlotChart = (data: any) => {
    const svg = d3.select(svgRef.current)

    //redraw
    svg.selectAll('g').remove()

    // d3 group
    const sumstat: any = Array.from(
      d3.group(data, (d: any) => d.name),
      ([key, values]) => ({ key, values })
    )

    /** resize Chart Size */
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

    // Add X axis --> it is a date format
    const x: any = d3.scaleLinear().range([0, width])
    x.domain(
      d3.extent(data, (d: any) => {
        return d.year
      })
    )

    // Add Y axis
    const y: any = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d: any) => {
          return +d.n
        }),
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

    const newArray = data.filter((item: any, i: any) => {
      return (
        data.findIndex((item2: any, j: any) => {
          return item.yaer === item2.year
        }) === i
      )
    })

    const arr: any = []
    for (let i = 0, len = newArray.length; i < len; i++) {
      arr.push(newArray[i].year)
    }

    // svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).tickValues(arr))
    svg.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).ticks(5))
    svg.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

    //grid 그리기
    svg.append('g').call(xGrid)
    svg.append('g').call(yGrid)

    //random color array 생성
    const colorArr: any = []
    for (let i = 0, len = sumstat.length; i < len; i++) {
      const colorCode = '#' + Math.round(Math.random() * 0xffffff).toString(16)
      colorArr.push(colorCode)
    }

    const res: any = sumstat.map(function (d: any) {
      return d.key
    }) // list of group names

    const color: any = d3.scaleOrdinal().domain(res).range(colorArr)

    //add multiple data
    svg
      .selectAll('myDots')
      .data(sumstat)
      .enter()
      .append('g')
      .attr('transform', 'translate(50,0)')
      .style('fill', function (d: any) {
        return color(d.key)
      })
      .attr('class', function (d: any) {
        return d.key
      })
      .selectAll('myPoints')
      .data(function (d: any) {
        return d.values
      })
      .enter()
      .append('circle')
      .attr('cx', function (d: any) {
        return x(d.year)
      })
      .attr('cy', function (d: any) {
        return y(+d.n)
      })
      .attr('r', 2)

    // Add a legend (interactive)
    svg
      .selectAll('myLegend')
      .data(sumstat)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .style('z-index', '999')
      .attr('transform', 'translate(50,0)')
      .append('text')
      .attr('x', function (d: any, i: any) {
        return 20 + i * 60
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

  const DrawD3ScatterPlotChart = (data: any) => {
    const svg = d3.select(svgRef.current)

    if (props.DataName !== 'TestData') {
      data.forEach((d: any) => {
        d.date = new Date(d.x)
        d.value = d.y
        delete d.x
        delete d.y
      })
    } else {
      const parseTime = d3.timeParse('%Y-%m-%d')
      data.forEach((d: any) => {
        d.date = parseTime(d.date)
        d.value = +d.value
      })
    }

    const Value = data.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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

    const scaleXaxis = d3.axisBottom(x)
    const scaleYaxis = d3.axisLeft(y)

    // Add X axis
    const xAxis = svg.append('g').attr('transform', `translate(50, ${height})`).call(scaleXaxis)

    // Add Y axis
    const yAxis = svg.append('g').attr('transform', `translate(40,3)`).call(scaleYaxis)

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
      .text(props.DataName)
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // Add dots
    const g = svg.append('g').attr('clip-path', 'url(#clip)').attr('transform', 'translate(50,0)')

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
      .style('fill', props.Color)

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 32])
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
      })

    svg.call(zoom)

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
  }

  return (
    <>
      <Wrapper ref={svgRef} />
    </>
  )
}

export default D3ScatterPlotChart
