import React from 'react'
import styled from '@emotion/styled'
import { AgGridReact } from 'ag-grid-react'
import { Button, Stack, useColorModeValue } from '@chakra-ui/react'
import { MdOutlineAdd, MdOutlineRemove, MdSave } from 'react-icons/md'
import { RowValueChangedEvent, CellValueChangedEvent, ColDef } from 'ag-grid-community'

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

interface WidgetDataTableProps {
  // setDataGridData: (text: any) => void
  rows: any
  columns: any
  ref?: any
}

const DataGridWrap = styled.div`
  width: 100%;
  height: calc(100% - 1.1vw);
`

export const WidgetDataTable: React.FC<WidgetDataTableProps> = (props: any) => {
  const sidebarBg = useColorModeValue('white', 'navy.700')
  const gridRef: any = React.useRef<any>()

  const [TableRows, setTableRows] = React.useState<any>()
  const [TableColumns, setTableColumns] = React.useState<any>()

  //Data Grid Delete Modal
  const [DataGridDeleteModalisOpen, setDataGridDeleteModalIsOpen] = React.useState<boolean>(false)

  const [Theme, setTheme] = React.useState('ag-theme-alpine')

  //theme 변경
  // React.useEffect(() => {
  //   console.log(' data grid ---------->>> ')
  //   console.log(sidebarBg)

  //   if (sidebarBg === 'white') {
  //     setTheme('ag-theme-alpine')
  //   } else {
  //     setTheme('ag-theme-alpine-dark')
  //   }

  //   console.log(gridRef)
  // }, [sidebarBg])

  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  React.useEffect(() => {
    setTableRows(props.rows)
    setTableColumns(props.columns)

    console.log('[ props ] : ')
    console.log(props)
  }, [props])

  // React.useEffect(() => {
  //   console.log('------- Change GridRef ---------')
  //   console.log(gridRef.current.props)
  //   console.log(gridRef.current.props.rowData)
  //   console.log(gridRef.current.props.columnDefs)
  //   console.log('--------------------------------')

  //   // props.setDataGridData(gridRef.current)
  // }, [gridRef])

  // //default 수정권한
  const defaultColDef = React.useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
    }
  }, [])

  // Example of consuming Grid Event
  const cellClickedListener = React.useCallback((event: any) => {
    // props.setDataGridData('test')
    console.log('cellClicked', event)
  }, [])

  const rowClickedListener = React.useCallback((event: any) => {
    console.log('rowClicked', event)
    console.log(event.rowIndex)
  }, [])

  const onCellValueChanged = React.useCallback((event: CellValueChangedEvent) => {
    console.log('onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue)
  }, [])

  const rowValueChanged = React.useCallback((event: RowValueChangedEvent) => {
    console.log('rowValueChanged', event)
    const data = event.data
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(data)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
  }, [])

  //   // Example load data from sever
  //   React.useEffect(() => {
  //     fetch('https://www.ag-grid.com/example-assets/row-data.json')
  //       .then((result) => result.json())
  //       .then((rowData) => setTableRows(rowData))
  //   }, [])
  // const onAddRow = () => {
  //   console.log('add grid ref')
  //   console.log(gridRef.current)
  //   if (gridRef !== undefined) {
  //     if (gridRef.current !== undefined) {
  //       gridRef.current.api.gridApi.updateRowData({
  //         add: [{ make: 'BMW', model: 'S2', price: '63000' }],
  //       })
  //     }
  //   }
  // }

  // const onDeleteRow = () => {
  //   console.log('delete Row')
  //   setDataGridDeleteModalIsOpen(true)
  // }

  // const getCloseDataGridDeleteModal = (CloseDataGridDeleteModal: boolean) => {
  //   console.log(CloseDataGridDeleteModal)
  //   setDataGridDeleteModalIsOpen(CloseDataGridDeleteModal)
  // }

  // const getDataGridDeleteInfo = (DeleteInfo: string) => {
  //   console.log(DeleteInfo)
  // }

  return (
    <>
      {/* <DataGridDeleteModal
        DataGridDeleteModalisOpen={DataGridDeleteModalisOpen}
        setCloseDataGridDeleteModal={getCloseDataGridDeleteModal}
        setDataGridDeleteInfo={getDataGridDeleteInfo}
      /> */}
      {/* <Stack direction="row" spacing={4} pl={3} display={AdminInfo} marginTop={2} marginBottom={2}>
        <Button
          leftIcon={<MdOutlineAdd />}
          variant="brand"
          size="md"
          onClick={() => {
            onAddRow()
          }}
        >
          Add
        </Button>
        <Button
          leftIcon={<MdOutlineRemove />}
          variant="brand"
          size="md"
          onClick={() => {
            onDeleteRow()
          }}
        >
          Remove
        </Button>
        <Button leftIcon={<MdSave />} variant="brand" size="md">
          Save
        </Button>
      </Stack> */}
      <DataGridWrap className={Theme}>
        <AgGridReact
          ref={(el: any) => {
            gridRef.current = el
          }}
          rowData={TableRows}
          columnDefs={TableColumns}
          defaultColDef={defaultColDef}
          enableCellChangeFlash={true}
          //   rowSelection="multiple"
          // animateRows={true}
          // loadingCellRenderer={loadingCellRendererListener}
          onCellClicked={cellClickedListener}
          onRowClicked={rowClickedListener}
          editType={'fullRow'}
          onCellValueChanged={onCellValueChanged}
          onRowValueChanged={rowValueChanged}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </DataGridWrap>
    </>
  )
}

export default WidgetDataTable
