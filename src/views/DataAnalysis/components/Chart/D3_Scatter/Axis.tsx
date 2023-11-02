import React, { useEffect, useRef } from 'react'
import { axisBottom, axisLeft, scaleLinear, select } from 'd3'
import { styled } from 'styled-components'
import PropsTypes from 'prop-types'

const Tick = styled.g<{ axisType?: string; innerHeight?: number }>`
  transform: ${(props) => props.axisType === 'yAxis' && `translate(0, ${props.innerHeight}px)`};
  path,
  line {
    stroke: #dcdbdb;
  }

  text {
    font-size: 0.5rem;
  }
`

function Axis({ xScale, yScale, innerHeight, xTickPadding, yTickPadding, yTickSize }: any) {
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)

  useEffect(() => {
    const xGroup = select(xAxisRef.current)
    const yGroup = select(yAxisRef.current)

    const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(xTickPadding)
    const yAxis = axisLeft(yScale).tickSize(yTickSize).tickPadding(yTickPadding)

    xGroup.call(yAxis)
    yGroup.call(xAxis)
  }, [xScale, yScale])

  return (
    <g>
      <Tick ref={xAxisRef} axisType="xAxis" />
      <Tick ref={yAxisRef} axisType="yAxis" innerHeight={innerHeight} />
    </g>
  )
}

Axis.propTypes = {
  xScale: PropsTypes.func,
  yScale: PropsTypes.func,
  innerHeight: PropsTypes.number,
  yAxisTickFormat: PropsTypes.func,
  xAixsTickFormat: PropsTypes.func,
  yTickSize: PropsTypes.number,
  xTickPadding: PropsTypes.number,
  yTickPadding: PropsTypes.number,
}

export default Axis
