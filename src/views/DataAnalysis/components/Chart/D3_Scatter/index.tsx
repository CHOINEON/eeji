import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { csv, select, scaleLinear, axisLeft, axisBottom, format, extent } from 'd3'
import dataArr from './data.json'
import { DropdownMenu } from './DropDownMenu'
import { Dropdown } from './style'

const Wrapper = styled.svg`
  background-color: lightgrey;
  width: 500px;
  height: 500px;
`

//https://velog.io/@suyeonme/JS-D3.js%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-Scatter-Plot-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
const ScatterPlot = () => {
  const svgRef = useRef(null)
  const [data, setData] = useState(dataArr)

  const svg = select('div').append('svg').attr('width', 1200).attr('height', 500)
  const width = +svg.attr('width')
  const height = +svg.attr('height')

  useEffect(() => {
    // render(data)
    const url_corr_data = process.env.REACT_APP_NEW_API_SERVER_URL + `/api/send_data/admin`
    const param_for_corrplot2 = {
      user_id: localStorage.getItem('userId'),
      com_id: localStorage.getItem('companyId'),
      ds_id: '79af5907d82e466789098c7ae0de35a4',
    }

    axios.post(url_corr_data, param_for_corrplot2).then((response) => {
      render(response.data)
    })
  }, [])

  const render = (data: Array<any>) => {
    const title = 'D3 chart test'
    const xValue = (d: any) => d.풍량
    const xAxisLabel = 'x axis label'

    const yValue = (d: any) => d.산소부화율
    const yAxisLabel = 'y axis label'

    const margin = {
      top: 80,
      right: 40,
      left: 50,
      bottom: 70,
    }

    const innerWidth = width - margin.right - margin.left
    const innerHeight = height - margin.top - margin.bottom
    const circleRadius = 1

    // min, max 구하기
    const columns = Object.keys(data[0])
    const result: { [key: string]: Array<string> } = {}

    //format
    columns.map((column: any) => {
      result[column] = []
    })

    //push items
    data.map((data: any) => {
      columns.forEach((column: any) => {
        result[column].push(data[column])
      })
    })

    const max_x = Math.max.apply(null, result['풍량'])
    const max_y = Math.max.apply(null, result['산소부화율'])

    console.log('result:', result)

    const xScale = scaleLinear()
      .domain(extent([0, max_x]))
      .range([0, innerWidth])
      .nice()
    const yScale = scaleLinear()
      .domain(extent([0, max_y]))
      .range([0, innerHeight])
      .nice()

    //Add margins
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    //Styling ticks
    const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(15)
    const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(10)

    //Add axis and label
    const yAxisG = g.append('g').call(yAxis)

    yAxisG.selectAll('.domain').remove()
    yAxisG
      .append('text')
      .attr('class', 'axis-label')
      .attr('y', -80)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', `middle`)
      .text(yAxisLabel)

    const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.select('.domain').remove()
    xAxisG
      .append('text')
      .attr('class', 'axis-label')
      .attr('y', 60)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel)

    //Add a title
    g.append('text').attr('class', 'title').attr('y', -10).text(title)

    // Create circles (data join)
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cy', (d) => yScale(yValue(d)))
      .attr('cx', (d) => xScale(xValue(d)))
      .attr('r', circleRadius)
  }

  const optionClicked = (e: any) => {
    console.log('returned:', e)
  }

  return (
    <>
      {/* <DropdownMenu options={['풍량', '산소부화율']} onOptionClicked={optionClicked}>
        <option value="death">풍량</option>
        <option value="case">산소부화율</option>
      </DropdownMenu> */}
      VS
      {/* <Dropdown onChange={(e) => handleChange('y', e.target.value)}>
        <option value="death">풍량</option>
        <option value="case">산소부화율</option>
      </Dropdown> */}
      <div ref={svgRef}></div>
    </>
  )
}

export default ScatterPlot
