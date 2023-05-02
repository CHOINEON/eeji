import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
// import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import '../style/styles.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'

const TagList = (props: any) => {
  const { syncSelectedTag, refresh } = props

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
      width: 200,
    },
  ])

  useEffect(() => {
    // console.log('taglist refresh:', gridRef.current)
    //selection 초기화
    if (refresh) gridRef.current.api.deselectAll()
  }, [refresh])

  useEffect(() => {
    setRowData([])
    fetchTaglistData()
  }, [])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'process',
      })
      .then((response) => {
        // console.log('fetchTaglistData/process:', response)
        setRowData(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const onSelectionChanged = (e: any) => {
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
      {/* <Box sx={{ m: 2, height: 30 }}> */}
      <div style={{ height: '0%', width: '100%' }}>
        {/* <Stack spacing={1} direction="row" justifyContent="flex-end"> */}
        {/* <Button type="primary" onClick={toggleUploadModal}>
          업로드
        </Button>
        <Button type="primary" onClick={(e) => toggleFormModal('add', e)}>
          태그 등록
        </Button>
        <Button type="primary" onClick={(e) => toggleFormModal('update', e)}>
          태그 수정
        </Button>
        <Button type="primary" onClick={handleDelete}>
          태그 삭제
        </Button> */}
        {/* </Stack> */}
      </div>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          rowHeight={40}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={'multiple'}
          // getRowId={getRowId}
          // onRowSelected={onRowSelected}
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
      </div>
      {/* <Box style={{ height: '40px', textAlign: 'center', marginTop: '10px' }}>
        <ButtonComponent cssClass="e-info" onClick={toggleUploadModal}>
          Load Data
        </ButtonComponent>
      </Box> */}
      {/* </Box> */}
      {/* <FormModal
        show={formModal}
        type={modalType}
        onSaveClick={onSaveClick}
        onCloseClick={() => setFormModal(false)}
        selectedData={selectedRowData}
        onRowEditted={onRowEditted}`
      /> */}

      {/* <UploadModal show={uploadModal} onUploaded={onUploaded} onCloseClick={() => setUploadModal(false)} /> */}
    </>
  )
}

export default TagList
