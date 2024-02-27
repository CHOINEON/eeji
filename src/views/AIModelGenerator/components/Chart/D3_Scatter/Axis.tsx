import React, { useEffect, useRef } from 'react'
import { axisBottom, axisLeft, scaleLinear, select } from 'd3'
import { styled } from 'styled-components'
import PropsTypes from 'prop-types'

const Tick = styled.g<{ axistype?: string; innerheight?: number }>`
  transform: ${(props) => props.axistype === 'yAxis' && `translate(0, ${props.innerheight}px)`};
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
      <Tick ref={xAxisRef} axistype="xAxis" />
      <Tick ref={yAxisRef} axistype="yAxis" innerheight={innerHeight} />
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
