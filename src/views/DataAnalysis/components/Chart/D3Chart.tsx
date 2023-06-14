import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { select, utcParse, scaleLinear, axisBottom, axisLeft, csv } from 'd3'

const Wrapper = styled.svg`
  background-color: lightgrey;
  width: 500px;
  height: 500px;
`

//www.smashingmagazine.com/2018/02/react-d3-ecosystem/
//https://loshy244110.medium.com/d3-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EC%84%9C-d3-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-bb244b4fd3d4
function D3Chart() {
  const svgRef = useRef(null)
  const [data, setData] = useState([25, 30, 45, 60, 20])
  // const [data, setData] = useState<any>()

  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const width = 460 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  useEffect(() => {
    axios.post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/chartData', ['Tag-38', 'Tag-50']).then(
      (response: any) => {
        console.log('response:', response.data[0].data)
        setData(response.data[0].data)
      },
      (error) => {
        console.log('error:', error)
      }
    )
  }, [])

  useEffect(() => {
    // console.log(svgRef)
    const svg = select(svgRef.current)
    svg
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Add X axis
    const x = scaleLinear().domain([0, 100000]).range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(x))

    // Add Y axis
    const y = scaleLinear().domain([0, 2000]).range([height, 0])
    svg.append('g').call(axisLeft(y))

    // Add dots
    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d: any) {
        console.log(d)
        return x(d.x)
      })
      .attr('cy', function (d: any) {
        return y(d.y)
      })
      .attr('r', 1.5)
      .style('fill', '#69b3a2')
  }, [data])

  return (
    <>
      <Wrapper ref={svgRef}></Wrapper>
      <button style={{ border: '1px solid black' }} onClick={() => setData(data.map((value) => value + 5))}>
        update
      </button>
      <button style={{ border: '1px solid black' }} onClick={() => setData(data.filter((value) => value < 35))}>
        filter
      </button>
    </>
  )
}

export default D3Chart
