import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import { getTagData } from 'components/helpers/backend_helper'
import jsonData from './response.json'

export const TagListGrid = () => {
  //datagrid row data
  const [rowData, setRowData] = useState<Array<any>>()
  const [selectedRowData, setSelectedRowData] = useState({ id: 0, name: '', unit: '', description: '' })

  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: 'Tag-2 ',
      field: 'Tag-2 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-3 ',
      field: 'Tag-3 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-4 ',
      field: 'Tag-4 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-5 ',
      field: 'Tag-5 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-6 ',
      field: 'Tag-6 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-7 ',
      field: 'Tag-7 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-8 ',
      field: 'Tag-8 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Tag-9 ',
      field: 'Tag-9 ',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
    },
  ])

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    // getTagData()
    // axios
    //   .get('http://ec2-3-220-205-197.compute-1.amazonaws.com:9871/getTagList')
    //   .then((response) => {
    //     console.log('response', response)
    //     setRowData(response.data)
    //   })
    //   .catch((error) => error('Data Load Failed'))
    // console.log('jsonData::', jsonData_sm)
    // setRowData(jsonData_sm)
  }

  const onRowSelected = (e: any) => {
    // console.log('onRowSelected:', e)
    setSelectedRowData(e.data)
  }

  return (
    <>
      <AgGridReact
        rowHeight={40}
        //ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={'multiple'}
        // getRowId={getRowId}
        onRowSelected={onRowSelected}
      ></AgGridReact>
    </>
  )
}

export default TagListGrid
