import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button, Stack } from '@chakra-ui/react'
import { MdOutlineAdd, MdOutlineRemove, MdSave } from 'react-icons/md'

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

interface WidgetDataTableProps {
  rows: any
  columns: any
}

export const WidgetDataTable: React.FC<WidgetDataTableProps> = (props: any) => {
  const gridRef = React.useRef()

  const [TableRows, setTableRows] = React.useState<any>()
  const [TableColumns, setTableColumns] = React.useState<any>()

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  React.useEffect(() => {
    setTableRows(props.rows)
    setTableColumns(props.columns)

    console.log(props.rows)
    console.log(props.columns)
  }, [props])

  // Example of consuming Grid Event
  const cellClickedListener = React.useCallback((event: any) => {
    console.log('cellClicked', event)
  }, [])

  //   // Example load data from sever
  //   React.useEffect(() => {
  //     fetch('https://www.ag-grid.com/example-assets/row-data.json')
  //       .then((result) => result.json())
  //       .then((rowData) => setTableRows(rowData))
  //   }, [])

  return (
    <>
      <Stack direction="row" spacing={4} pl={3} display={AdminInfo} marginTop={2} marginBottom={2}>
        <Button leftIcon={<MdOutlineAdd />} variant="brand" size="md">
          Add
        </Button>
        <Button leftIcon={<MdOutlineRemove />} variant="brand" size="md">
          Remove
        </Button>
        <Button leftIcon={<MdSave />} variant="brand" size="md">
          Save
        </Button>
      </Stack>
      <div className="ag-theme-alpine" style={{ width: 'auto', height: '20vw' }}>
        <AgGridReact
          ref={gridRef}
          rowData={TableRows}
          columnDefs={TableColumns}
          rowSelection="multiple"
          animateRows={true}
          onCellClicked={cellClickedListener}
        />
      </div>
    </>
  )
}

export default WidgetDataTable
