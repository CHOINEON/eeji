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
    DrawD3ScatterPlotChart(props.Data)
  }, [props.Data])

  const DrawD3ScatterPlotChart = (data: any) => {
    const svg = d3.select(svgRef.current)

    if (props.DataName !== 'TestData') {
      const parseTime = d3.timeFormat('%Y-%m-%d')
      const parseDate = d3.timeParse('%Y-%m-%d')

      data.forEach((d: any) => {
        // d.date = parseDate(parseTime(new Date(d.x)))
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
  }

  return (
    <>
      <Wrapper ref={svgRef} />
    </>
  )
}

export default D3ScatterPlotChart
