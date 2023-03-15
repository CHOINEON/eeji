import React from 'react'
import 'react-data-grid/lib/styles.css'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

interface DataTableProps {
  columns: any
  row: any
}

export const DataTable: React.FC<DataTableProps> = (props) => {
  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ]

  const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ]

  return (
    <>
      <DataGrid rows={rows} columns={columns} />
    </>
  )
}

export default DataTable
