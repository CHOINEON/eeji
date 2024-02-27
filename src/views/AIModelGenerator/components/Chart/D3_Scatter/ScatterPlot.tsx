import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import {
  csv,
  select,
  scaleLinear,
  axisLeft,
  axisBottom,
  format,
  extent,
  scaleOrdinal,
  schemeCategory10,
  group,
  zoom,
} from 'd3'

import PropsTypes from 'prop-types'
import { Group, Chart, ChartWrapper } from './style/style'
import AxisLabel from './AxisLabel'
import Axis from './Axis'

//https://velog.io/@suyeonme/JS-D3.js%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-Scatter-Plot-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
//https://2019.wattenberger.com/blog/react-and-d3
function ScatterPlot({ data, featureX, featureY }: any) {
  const margin = {
    top: 80,
    right: 100,
    left: 50,
    bottom: 70,
  }
  const width = 400
  const height = 400
  const innerWidth = width - margin.right - margin.left
  const innerHeight = height - margin.top - margin.bottom

  const svgRef = useRef(null)
  const circleRef = useRef(null)

  const xValue = (d: any) => d[featureX.value]
  const xAxisLabel = featureX.value

  const yValue = (d: any) => d[featureY.value]
  const yAxisLabel = featureY.value

  // const colorValue = (d: any) => d

  // const colorScale = scaleOrdinal(schemeCategory10)
  // const nested = Array.from(group(data, colorValue), ([key, value]) => ({
  //   key,
  //   value,
  // }))

  // colorScale.domain(nested.map((d) => d.key))

  const axesTickFormat = useCallback((number) => {
    return number + '%'
  }, [])

  const circleRadius = 2

  const xScale = scaleLinear()
    .domain([Math.floor(featureX.sliderMin / 10) * 10, Math.ceil(featureX.sliderMax / 10) * 10])
    .range([0, innerWidth])
    .nice()
  const yScale = scaleLinear()
    .domain([Math.floor(featureY.sliderMin / 10) * 10, Math.ceil(featureY.sliderMax / 10) * 10])
    .range([innerHeight, 0])
    .nice()

  useEffect(() => {
    // console.log('scatter data:', data)
    // console.log('featureX:', featureX)
    // console.log('featureY:', featureY)

    handleDrawRect()
  }, [data, featureX, featureY])

  const handleDrawRect = () => {
    const circleGroup = select(circleRef.current) //to turn our ref into a d3 selection object

    circleGroup
      .selectAll('.scatter-circle')
      .data(data)
      .join('circle')
      .attr('class', 'scatter-circle')
      .attr('cy', innerHeight / 2)
      .attr('cx', innerWidth / 2)
      .attr('r', 0)
      // .on('mouseover', (e, d) => {
      //   setSelectedCircle(d)
      //   setPosition({ xPosition: e.pageX, yPosition: e.pageY })
      // })
      // .on('mouseout', () => setSelectedCircle(null))
      // .transition()
      // .duration(0)
      // .delay((_, i) => i * 10)
      .attr('cy', (d) => yScale(yValue(d)))
      .attr('cx', (d) => xScale(xValue(d)))
      .attr('r', circleRadius)
      .style('fill', (d) => 'cornflowerblue')
  }

  return (
    <ChartWrapper>
      <Chart>
        <svg ref={svgRef} width={width} height={height}>
          <Group x={width / 2} y={height / 2} right={margin.right} top={margin.top}>
            <Axis
              xScale={xScale}
              yScale={yScale}
              innerHeight={innerHeight}
              xTickPadding={10}
              yTickPadding={10}
              yTickSize={-innerWidth}
              yAxisTickFormat={axesTickFormat}
              xAixsTickFormat={axesTickFormat}
            ></Axis>
            <AxisLabel
              innerHeight={innerHeight}
              innerWidth={innerWidth}
              axisPadding={60}
              xLabel={xAxisLabel}
              yLabel={yAxisLabel}
              marginLeft={margin.left}
            />
            <g ref={circleRef} />
          </Group>
        </svg>
      </Chart>
    </ChartWrapper>
  )
}

ScatterPlot.propTypes = {
  data: PropsTypes.array,
  featureX: PropsTypes.object,
  featureY: PropsTypes.object,
}

export default ScatterPlot
