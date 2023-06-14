import React from 'react'
import styled from '@emotion/styled'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export interface DataTableProps {
  Calltype: 'WS' | 'Interval'
}

export const RealTimeDataTable: React.FC<DataTableProps> = (props) => {
  const [WSTableRowData, setWSTableRowData] = React.useState<any>([])
  const [WSTableRowDataPrev, setWSTableRowDataPrev] = React.useState<any>([])
  const [WSTableColumnData, setWSTableColumnData] = React.useState<any>([
    { field: 'date', headerName: 'Date', editable: false },
    { field: 'tradeprice', headerName: 'TradePrice', editable: false },
    { field: 'lowprice', headerName: 'LowPrice', editable: false },
    { field: 'highprice', headerName: 'HighPrice', editable: false },
    { field: 'openingprice', headerName: 'OpeningPrice', editable: false },
  ])
  const [WSData, setWsData] = React.useState<any>([])

  const webSocketUrl = `ws://192.168.1.27:8001/api/ws`
  const ws = React.useRef(null)

  React.useEffect(() => {
    // getSocketTableData()
  }, [])

  React.useEffect(() => {
    console.log('useEffect !!!!!!!')
    if (WSData.length !== 0) {
      let TableRowTest: any = []
      console.log(WSTableRowDataPrev)
      if (WSTableRowDataPrev !== undefined) {
        if (WSTableRowDataPrev.length !== 0) {
          TableRowTest = [...WSTableRowDataPrev]
        }
      }
      console.log('[ Table Row Price Prev ---->>>>>> ]')
      console.log(TableRowTest)
      console.log(WSData)
      if (TableRowTest.length < 10) {
        TableRowTest.push(WSData)
        setWSTableRowDataPrev(TableRowTest)
        setWSTableRowData(TableRowTest)
      } else {
        TableRowTest.splice(0, 1)
        TableRowTest.push(WSData)
        setWSTableRowDataPrev(TableRowTest)
        setWSTableRowData(TableRowTest)
      }
    }
  }, [WSData])

  // //웹소켓
  // const getSocketTableData = () => {
  //   ws.current = new WebSocket(webSocketUrl)
  //   ws.current.onopen = function () {
  //     console.log('ws connection !!!! ')
  //   }
  //   ws.current.onmessage = function (event: any) {
  //     console.log('[ ws Return Data ]')
  //     console.log(JSON.parse(event.data))

  //     const parseData = JSON.parse(event.data)
  //     const wsObj: any = new Object()
  //     const wsArr: any = []

  //     wsObj.date = parseData[0].candleDateTime
  //     wsObj.tradeprice = parseData[0].tradePrice
  //     wsObj.lowprice = parseData[0].lowPrice
  //     wsObj.highprice = parseData[0].highPrice
  //     wsObj.openingprice = parseData[0].openingPrice

  //     console.log(wsObj)

  //     setWsData(wsObj)
  //   }
  //   ws.current.onclose = function () {
  //     console.log('ws close... ')

  //     setTimeout(function () {
  //       getSocketTableData()
  //     }, 1000)
  //   }
  // }

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
