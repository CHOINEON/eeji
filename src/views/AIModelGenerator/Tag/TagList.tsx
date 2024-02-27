import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
// import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import '../style/styles.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'

const TagList = (props: any) => {
  const { syncSelectedTag, refresh, data } = props
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const gridRef = useRef<AgGridReact<any>>(null)
  //datagrid row data
  const [rowData, setRowData] = useState<Array<any>>()
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: 'TagName',
      field: 'name',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 250,
    },
  ])

  useEffect(() => {
    const result = []
    for (let i = 0; i < data.length; i++) {
      result.push({ name: data[i].name })
    }

    setRowData(result)
  }, [data])

  useEffect(() => {
    // console.log('taglist refresh:', gridRef.current)
    //selection 초기화
    if (refresh) gridRef.current.api.deselectAll()
  }, [refresh])

  const onSelectionChanged = (e: any) => {
    // console.log('onSelectionChanged:', e)

    const selectedRows = gridRef.current.api.getSelectedRows()
    const arr = []

    for (let i = 0; i < selectedRows.length; i++) {
      arr.push(selectedRows[i].name)
    }
    // console.log('arr:', arr)
    syncSelectedTag(arr)
  }

  return (
    <>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          rowHeight={40}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={'multiple'} //multiple
          // getRowId={getRowId}
          // onRowSelected={onRowSelected}
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
      </div>
    </>
  )
}

export default TagList
