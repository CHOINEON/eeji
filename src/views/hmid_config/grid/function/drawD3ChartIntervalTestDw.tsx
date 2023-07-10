/**
 * 2023-07-06 박윤희
 * 동원 데이터 가져와서 로컬에서 테스트
 */

import React from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import * as Chakra from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './style.css'
import { TestArchData } from './test_data_dongwon'
import TableData from './table_data_dongwon'

const Wrapper = styled.svg<{ ChartShow: boolean }>`
  margin: 0 1vw;
  background-color: rgba(0, 0, 0, 0);
  display: ${(props) => (props.ChartShow ? 'block' : 'none')};
`

const DataGridWrap = styled.div<{ TableShow: boolean }>`
  width: 100%;
  height: calc(100% - 1.1vw);
  display: ${(props) => (props.TableShow ? 'block' : 'none')};
`

export interface LineChartPorps {
  widthSize: any
  heightSize: any
  CallData: 'TestData'
  Color: string
  ChartShow: boolean
  TableShow: boolean
  Multiple: boolean
}

export const D3LineChartInterval: React.FC<LineChartPorps> = (props) => {
  const svgRef = React.useRef()
  const svgContainer = React.useRef(null)

  //datatable
  const [WSTableRowData, setWSTableRowData] = React.useState<any>([])
  const [WSTableRowDataClean, setWSTableRowDataClean] = React.useState<any>([])
  const [WSTableColumnData, setWSTableColumnData] = React.useState<any>([
    { field: 'date', headerName: 'Time', editable: false },
    { field: 'tradeprice', headerName: 'TradePrice', editable: false },
    { field: 'lowprice', headerName: 'LowPrice', editable: false },
    { field: 'highprice', headerName: 'HighPrice', editable: false },
    { field: 'openingprice', headerName: 'OpeningPrice', editable: false },
  ])

  const [widthState, setWidth] = React.useState<any>(props.widthSize)
  const [heightState, setHeight] = React.useState<any>(props.heightSize)

  React.useEffect(() => {
    getTestData()
    TableDataFunc()
  }, [])

  const TableDataFunc = () => {
    const data: any = TableData[1]
    console.log('[ Table Data ] : ', data)

    const DataType: any = ['current', 'predict']
    let DataObj: any = new Object()
    const DataArr: any = []

    for (let i = 0, len = DataType.length; i < len; i++) {
      DataObj.type = DataType[i]
      for (const j in data) {
        console.log(j)
        if (j.includes('OIL') === true) {
          console.log('[ Data Type ] : ', DataType[i])
          console.log('[ JSON Data ] : ', data[j])
          DataObj[j] = data[j]
        }
      }
      DataArr.push(DataObj)
      DataObj = new Object()
    }
  }

  const getTestData = () => {
    drawTestData(TestArchData)
    const data = window.localStorage.getItem('ChartData')

    RealDrawMultipleLineChart(data)
  }

  const drawTestData = async (data: any) => {
    console.log('[ Test Arch Data ] : ', data)

    let OriginalDataObjChild: any = new Object()
    const OriginalDataArrChild: any = []
    let PredictDataObjChild: any = new Object()
    const PredictDataObjChildArr: any = []
    const default_data: any = data

    for (let i = 0, len = default_data.values.length; i < len; i++) {
      if (default_data.values[i] !== undefined) {
        if (typeof default_data.values[i]['Tag-34'] === 'string' || default_data.values[i]['0'] === 'string') {
          default_data.values.splice(i, 1)
        }
      }
    }

    for (let j = 0, len = default_data.values.length; j < len; j++) {
      if (typeof default_data.values[j]['Tag-34'] !== 'string') {
        OriginalDataObjChild.name = 'original'
        OriginalDataObjChild.date = default_data.values[j].Date
        OriginalDataObjChild.value = default_data.values[j]['Tag-34']
        OriginalDataArrChild.push(OriginalDataObjChild)
        OriginalDataObjChild = new Object()

        PredictDataObjChild.name = 'predict'
        PredictDataObjChild.date = default_data.values[j].Date
        PredictDataObjChild.value = default_data.values[j]['0']
        PredictDataObjChildArr.push(PredictDataObjChild)
        PredictDataObjChild = new Object()
      }
    }

    const ResultData = OriginalDataArrChild.concat(PredictDataObjChildArr)
    window.localStorage.setItem('ChartData', JSON.stringify(ResultData))
  }

  React.useEffect(() => {
    const newArray = WSTableRowData.filter((item: any, i: any) => {
      return (
        WSTableRowData.findIndex((item2: any, j: any) => {
          return item.date.toString() === item2.date.toString()
        }) === i
      )
    })
    setWSTableRowDataClean(newArray)
  }, [WSTableRowData])

  const RealDrawMultipleLineChart = (test: any) => {
    const data: any = JSON.parse(window.localStorage.getItem('ChartData'))

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

    const xAxis = svg2.append('g').attr('transform', `translate(50, ${height})`).call(d3.axisBottom(x))
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
      .style('fill', 'orange')
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 4 + 8)
      .attr('y', height + 40)
      .text('Original')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    svg2
      .append('g')
      .append('rect')
      .attr('x', width / 1.5 + 15)
      .attr('y', height + 40)
      .attr('width', 4)
      .attr('height', 2)
      .style('fill', 'green')
    svg2
      .append('g')
      .append('text')
      .attr('x', width / 1.5 + 23)
      .attr('y', height + 40)
      .text('Predict')
      .style('font-size', '14px')
      .attr('alignment-baseline', 'middle')

    // color palette
    const res: any = sumstat.map(function (d: any) {
      return d.key
    }) // list of group names

    const color: any = d3.scaleOrdinal().domain(res).range(['orange', 'green'])

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
            //console.log(d.value)
            return y(+d.value)
          })(d.values)
      })

    // Add brushing
    /**
     * 2023.06.08 주석 처리
     */
    const brush: any = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', function (event, d) {
        const extent: any = event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
          x.domain([4, 8])
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])])
          svg2.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis
          .transition()
          .duration(1000)
          .call(d3.axisBottom(x))

          .select('.line')
          .transition()
          .duration(1000)
          .attr('d', function (d: any) {
            return d3
              .line()
              .x(function (d: any) {
                return x(d.date)
              })
              .y(function (d: any) {
                //console.log(d.value)
                return y(+d.value)
              })(d.values)
          })
      })

    // Add the brushing
    svg2.append('g').attr('class', 'brush').call(brush)

    // // A function that set idleTimeOut to null
    let idleTimeout: any
    function idled() {
      idleTimeout = null
    }

    svg2.on('dblclick', function () {
      x.domain(
        d3.extent(data, function (d: any) {
          return x(d.date)
        })
      )
      xAxis.transition().call(d3.axisBottom(x))
      svg2.transition().attr('d', function (d: any) {
        return d3
          .line()
          .x(function (d: any) {
            return x(d.date)
          })
          .y(function (d: any) {
            //console.log(d.value)
            return y(+d.value)
          })(d.values)
      })
    })
  }

  return (
    <>
      <Chakra.Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        {/*d3 line chart*/}
        {/* <div>Websocket</div> */}
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

      <DataGridWrap className={'ag-theme-alpine'} TableShow={props.TableShow}>
        <AgGridReact
          rowData={WSTableRowDataClean}
          columnDefs={WSTableColumnData}
          defaultColDef={{
            flex: 1,
            editable: true,
          }}
          enableCellChangeFlash={false}
          editType={'fullRow'}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </DataGridWrap>
    </>
  )
}

export default D3LineChartInterval
