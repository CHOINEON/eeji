import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import axios from 'axios'
import './style.css'
import { TestBtData } from './test_data_dongwon'

const Wrapper = styled.svg<{ ChartShow: boolean }>`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
  display: ${(props) => (props.ChartShow ? 'block' : 'none')};
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  CallData: 'TestData' | 'Bottom' | 'LowPrice' | 'OpeningPrice' | 'DataTable' | 'Opening & High & Low'
  Color: string
  ChartShow: boolean
  TableShow: boolean
  Multiple: boolean
}

export const D3LineChartIntervalBT: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()
  const svgContainer = React.useRef(null)

  const [IntervalData, setIntervalData] = React.useState<any>([])
  const [lastDate, setLastDate] = React.useState<any>()

  const [widthState, setWidth] = React.useState<any>(props.widthSize)
  const [heightState, setHeight] = React.useState<any>(props.heightSize)

  React.useEffect(() => {
    getTestData()
  }, [])

  const getTestData = () => {
    drawTestData(TestBtData)
    const data = window.localStorage.getItem('ChartBTData')

    RealDrawMultipleLineChart(data)
  }

  const drawTestData = async (data: any) => {
    console.log('[ Test Bt Data ] : ', data)

    let OriginalDataObjChild: any = new Object()
    const OriginalDataArrChild: any = []
    let PredictDataObjChild: any = new Object()
    const PredictDataObjChildArr: any = []
    const default_data: any = data

    console.log(default_data)

    for (let i = 0, len = default_data.values.length; i < len; i++) {
      if (default_data.values[i] !== undefined) {
        if (typeof default_data.values[i]['Tag-42'] === 'string') {
          default_data.values.splice(i, 1)
        }
      }
    }

    console.log('[ result_data ] : ', default_data)

    for (let j = 0, len = default_data.values.length; j < len; j++) {
      if (typeof default_data.values[j]['Tag-42'] !== 'string') {
        OriginalDataObjChild.name = 'original_BT'
        OriginalDataObjChild.date = data.values[j].Date
        OriginalDataObjChild.value = data.values[j]['Tag-42']
        OriginalDataArrChild.push(OriginalDataObjChild)
        OriginalDataObjChild = new Object()

        PredictDataObjChild.name = 'predict'
        PredictDataObjChild.date = data.values[j].Date
        PredictDataObjChild.value = data.values[j].bt_pred_1
        PredictDataObjChildArr.push(PredictDataObjChild)
        PredictDataObjChild = new Object()
      }
    }

    const ResultData = OriginalDataArrChild.concat(PredictDataObjChildArr)
    console.log(OriginalDataArrChild.concat(PredictDataObjChildArr))
    window.localStorage.setItem('ChartBTData', JSON.stringify(ResultData))
  }

  const RealDrawMultipleLineChart = (test: any) => {
    const data: any = JSON.parse(window.localStorage.getItem('ChartBTData'))
    const svg2 = d3.select(svgRef.current)

    const parseTime = d3.timeFormat('%H:%M:%S')
    const parseDate = d3.timeParse('%H:%M:%S')

    //redraw
    svg2.selectAll('g').remove()
    data.forEach((d: any) => {
      d.date = parseDate(parseTime(new Date(d.date)))
      d.value = d.value
    })

    console.log('[ Multiple Chart Data ] : ', data)

    const Value = data.map((v: any) => {
      return v.value
    })

    const max = Math.max.apply(null, Value)
    const min = Math.min.apply(null, Value)

    console.log('[ min & max ] : ', min + ' , ' + max)

    /** resize Chart Size */
    const margin = { top: 20, right: 50, bottom: 50, left: 70 }
    let width: any = 0,
      height: any = 0
    if (widthState !== undefined && heightState !== undefined) {
      width = widthState - margin.left - margin.right
      height = heightState - margin.top - margin.bottom
    }

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

    const sumstat = Array.from(
      d3.group(data, (d: any) => d.name),
      ([key, values]) => ({ key, values })
    )
    console.log('ArrayData :', sumstat)

    // Add X axis --> it is a date format
    const x: any = d3.scaleTime().range([0, width])
    x.domain(
      d3.extent(data, (d: any) => {
        return parseDate(parseTime(new Date(d.date)))
      })
    )

    // Add Y axis
    const y: any = d3
      .scaleLinear()
      .domain([min - 50, max + 100])
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
        .attr('x1', (d: any) => x(d))
        .attr('x2', (d: any) => x(d))

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

    svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
    svg2.append('g').attr('transform', `translate(40,3)`).call(d3.axisLeft(y))

    //grid 그리기
    svg2.append('g').call(xGrid)
    svg2.append('g').call(yGrid)
    svg2
      .append('g')
      .append('rect')
      .attr('x', width / 4)
      .attr('y', height + 40)
      .attr('width', 4)
      .attr('height', 2)
      .style('fill', 'pink')
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 4 + 8)
      .attr('y', height + 40)
      .text('Original_BT')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')
    svg2
      .append('g')
      .append('rect')
      .attr('x', width / 1.5 + 15)
      .attr('y', height + 40)
      .attr('width', 4)
      .attr('height', 2)
      .style('fill', 'blue')
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 1.5 + 23)
      .attr('y', height + 40)
      .text('Predict_BT')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // color palette
    const res: any = sumstat.map(function (d: any) {
      return d.key
    }) // list of group names

    const color: any = d3.scaleOrdinal().domain(res).range(['pink', 'blue'])
    // Draw the line
    svg2
      .append('g')
      .attr('clip-path', 'url(#clip)')
      // .append('path')
      .selectAll('.line')
      .data(sumstat)
      .enter()
      .append('path')
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
            return x(d.date)
          })
          .y(function (d: any) {
            return y(+d.value)
          })(d.values)
      })
  }

  return (
    <>
      <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {/*d3 line chart*/}
        <div ref={svgContainer}>
          <Wrapper ref={svgRef} ChartShow={props.ChartShow} />
          <div id="tooltip" className="tooltip">
            <div className="tooltip-date">
              <span id="date"></span>
            </div>
            <div className="tooltip-Value">
              Value : <span id="value"></span>
            </div>
          </div>
        </div>
      </Chakra.Box>
    </>
  )
}

export default D3LineChartIntervalBT
