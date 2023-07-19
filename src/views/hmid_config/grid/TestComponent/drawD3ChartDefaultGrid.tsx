/**
 * 2023-07-06 박윤희
 * D3 chart Default Grid
 */
import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

export interface DefaultGridProps {
  widthSize: any
  heightSize: any
}

export const D3ChartDefaultGrid: React.FC<DefaultGridProps> = (props) => {
  const svgRef2 = React.useRef()

  React.useEffect(() => {
    DrawD3DefaultGridDraw()
  }, [])

  const DrawD3DefaultGridDraw = () => {
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

    const y: any = d3.scaleLinear().range([height, 0])

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
  }

  return (
    <>
      <Wrapper ref={svgRef2} />
    </>
  )
}

export default D3ChartDefaultGrid
