import React from 'react'
import styled from '@emotion/styled'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export const RealTimeDataTable: React.FC = () => {
  const [WSTableRowData, setWSTableRowData] = React.useState([])
  const [WSTableColumnData, setWSTableColumnData] = React.useState<any>([
    { field: 'date', headerName: 'Date', editable: false },
    { field: 'tradeprice', headerName: 'TradePrice', editable: false },
    { field: 'lowprice', headerName: 'LowPrice', editable: false },
    { field: 'highprice', headerName: 'HighPrice', editable: false },
    { field: 'openingprice', headerName: 'OpeningPrice', editable: false },
  ])
  const [WSData, setWsData] = React.useState<any>([])

  const [IntervalTableRowData, setIntervalTableRowData] = React.useState<any>([])
  const [IntervalTableColumnData, setIntervalTableColumnData] = React.useState<any>([])

  const webSocketUrl = `ws://192.168.1.27:8001/api/ws`
  const ws = React.useRef(null)

  React.useEffect(() => {
    getSocketTableData()
  }, [])

  React.useEffect(() => {
    console.log('useEffect !!!!!!!')
    if (WSTableRowData !== undefined) {
      if (WSTableRowData.length === 0 && WSData.length !== 0) {
        console.log('50미만 ㅡ!!!!!!!!!!!!!!!!!!')
        console.log(WSTableRowData)
        console.log(WSData)
        setWSTableRowData([WSData[0]])
      } else if (WSTableRowData.length === 10) {
        const arr = WSTableRowData
        arr.splice(0, 1)
        arr.push(WSData[0])
        setWSTableRowData([...WSTableRowData, arr])
      }
    } else {
      setWSTableRowData([WSData[0]])
    }
  }, [WSData])

  //웹소켓
  const getSocketTableData = () => {
    ws.current = new WebSocket(webSocketUrl)
    ws.current.onopen = function () {
      console.log('ws connection !!!! ')
    }
    ws.current.onmessage = function (event: any) {
      console.log('[ ws Return Data ]')
      console.log(JSON.parse(event.data))

      const parseData = JSON.parse(event.data)
      const wsObj: any = new Object()
      const wsArr: any = []

      wsObj.date = parseData[0].candleDateTime
      wsObj.tradeprice = parseData[0].tradePrice
      wsObj.lowprice = parseData[0].lowPrice
      wsObj.highprice = parseData[0].highPrice
      wsObj.openingprice = parseData[0].openingPrice
      wsArr.push(wsObj)

      console.log(wsArr)

      setWsData(wsArr)

      // wsObj.y = parseData[0].tradePrice
      // wsObj.x = parseData[0].candleDateTimeKst
    }
    ws.current.onclose = function () {
      console.log('ws close... ')

      setTimeout(function () {
        getSocketTableData()
      }, 1000)
    }
  }

  return (
    <>
      <DataGridWrap className={'ag-theme-alpine'}>
        <AgGridReact
          rowData={WSTableRowData}
          columnDefs={WSTableColumnData}
          defaultColDef={{
            flex: 1,
            editable: true,
          }}
          enableCellChangeFlash={true}
          editType={'fullRow'}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </DataGridWrap>
    </>
  )
}

export default RealTimeDataTable
