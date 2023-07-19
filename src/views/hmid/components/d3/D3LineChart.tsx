import React from 'react'
import styled from '@emotion/styled'
import * as d3 from 'd3'

const Wrapper = styled.svg`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
`

export interface D3LineProps {
  widthSize: any
  heightSize: any
  Data: any
  DataName: string
  Color: string
}

export const D3LineChart: React.FC<D3LineProps> = (props) => {
  const svgRef2 = React.useRef()

  React.useEffect(() => {
    if (Object.keys(props.Data[0]).length > 2) {
      DrawMultipleSeriesD3LineChart(props.Data)
    } else {
      DrawD3LineChart(props.Data)
    }
  }, [props.Data])

  const DrawMultipleSeriesD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef2.current)

    // const parseTime = d3.timeFormat('%H:%M:%S')
    // const parseDate = d3.timeParse('%H:%M:%S')

    //redraw
    svg2.selectAll('g').remove()

    // d3 group 만들기
    const sumstat: any = Array.from(
      d3.group(data, (d: any) => d.name),
      ([key, values]) => ({ key, values })
    )
    console.log('Multiple Series ArrayData :', sumstat)

    /** resize Chart Size */
    const margin = { top: 20, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

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
    svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x).ticks(5))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

    //grid 그리기
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)

    //random color
    const colorArr: any = []
    for (let i = 0, len = sumstat.length; i < len; i++) {
      const colorCode = '#' + Math.round(Math.random() * 0xffffff).toString(16)
      console.log('[ Color Code ] : ', colorCode)
      colorArr.push(colorCode)
    }

    console.log('[ Color ] : ', colorArr)

    const res: any = sumstat.map(function (d: any) {
      return d.key
    }) // list of group names

    const color: any = d3.scaleOrdinal().domain(res).range(colorArr)

    const tooltip = d3.select('#tooltip')
    const tooltipDot = svg2
      .append('g')
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#fc8781')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .style('pointer-events', 'none')

    svg2
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0)
      .on('touchmouse mousemove', function (event) {
        const mousePos = d3.pointer(event, this)
        // x coordinate stored in mousePos index 0
        const date = x.invert(mousePos[0])

        const xAccessor = (d: any) => d.year
        const yAccessor = (d: any) => d.value

        // Custom Bisector - left, center, right <= bisector options
        const dateBisector = d3.bisector(xAccessor).center
        const bisectionIndex = dateBisector(data, date)
        const hoveredIndexData = data[bisectionIndex - 1]

        // console.log(hoveredIndexData)
        // console.log(yAccessor(hoveredIndexData))
        // console.log(hoveredIndexData)
        // console.log(xAccessor(hoveredIndexData))
        tooltipDot
          .style('opacity', 1)
          // .attr('cx', x(xAccessor(hoveredIndexData)))
          .attr('cx', x(xAccessor(hoveredIndexData)))
          .attr('cy', y(yAccessor(hoveredIndexData)))

        // console.log(hoveredIndexData)

        tooltip
          .style('display', 'block')
          .style('top', `${y(yAccessor(hoveredIndexData)) - 50}px`)
          .style('left', `${x(xAccessor(hoveredIndexData))}px`)

        tooltip.select('.price').text(`${yAccessor(hoveredIndexData)}`)

        const dateFormatter = d3.timeFormat('%B %-d, %Y')

        tooltip.select('.date').text(`${dateFormatter(xAccessor(hoveredIndexData))}`)
      })

      .on('mouseleave', function (event) {
        const mousePos = d3.pointer(event, this)
      })

    svg2
      .append('g')
      .attr('clip-path', 'url(#clip)')
      // .append('path')
      .selectAll('.line')
      .data(sumstat)
      .enter()
      .append('path')
      .attr('class', function (d: any) {
        return d.key
      })
      .attr('transform', 'translate(50,0)')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', function (d: any) {
        return color(d.key)
      })
      .attr('stroke-width', 1.5)
      .attr('d', function (d: any) {
        return d3
          .line()
          .x(function (d: any) {
            return x(d.year)
          })
          .y(function (d: any) {
            return y(+d.n)
          })(d.values)
      })
    // .on('mouseover', mouseover)
    // .on('mousemove', mousemove)
    // .on('mouseleave', mouseleave)

    svg2
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

  const DrawD3LineChart = (data: any) => {
    const svg2 = d3.select(svgRef2.current)
    //날짜일 경우 : %Y-%m-%d
    //24시간이면 %H 아니면 %I
    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    const rtnData = data

    /**
     * 2023-06-13 박윤희
     * Test 데이터인경우 조건 걸어놓음
     * 추후 조건 삭제해야함.
     */
    if (props.DataName !== 'TestData') {
      if (rtnData[0].x !== undefined && rtnData[0].y !== undefined) {
        rtnData.forEach((d: any) => {
          d.date = parseDate(parseTime(new Date(d.x)))
          d.value = d.y
          delete d.x
          delete d.y
        })
      } else {
        svg2.selectAll('g').remove()
        rtnData.forEach((d: any) => {
          d.date = parseDate(parseTime(d.date))
          d.value = d.value
        })
      }
    } else {
      const parseTime = d3.timeParse('%Y-%m-%d')
      rtnData.forEach((d: any) => {
        d.date = parseTime(d.date)
        d.value = +d.value
      })
    }

    const Value = rtnData.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    const margin = { top: 20, right: 50, bottom: 50, left: 70 },
      width = props.widthSize - margin.left - margin.right,
      height = props.heightSize - margin.top - margin.bottom

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
    const y: any = d3.scaleLinear().domain([min, max]).range([height, 0])

    x.domain(
      d3.extent(rtnData, (d: any) => {
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
    const xAxis: any = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))
    //grid 그리기
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
    svg2
      .append('g')
      .append('rect')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('width', 10)
      .attr('height', 2)
      .style('fill', props.Color)
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 2 + 20)
      .attr('y', height + 40)
      .text(props.DataName)
      .style('font-size', '14px')
      // .style('cursor', 'pointer')
      .attr('alignment-baseline', 'middle')

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
      .data([rtnData])
      .attr('transform', 'translate(50,0)')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', props.Color)
      .attr('stroke-width', 1.5)
      .attr('d', valueLine)
  }

  return (
    <div id="svg_parent">
      <Wrapper ref={svgRef2} />
      <div id="tooltip" className="tooltip">
        <div className="tooltip-date">
          <span id="date"></span>
        </div>
        <div className="tooltip-Value">
          Value : <span id="value"></span>
        </div>
      </div>
    </div>
  )
}

export default D3LineChart
