import React, { useState, useMemo, useRef } from 'react'
// import Button from '@mui/material/Button';
import Title from '../Title'
import Box from '@mui/material/Box'
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import '../style/styles.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Modal, Row, Button, Typography, Form } from 'antd'
import { Stack } from '@mui/material'
import UploadModal from './UploadModal'
import FormModal from './FormModal'

const TagList = () => {
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])

  const [uploadModal, setUploadModal] = React.useState(false)
  const [formModal, setFormModal] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  //datagrid row data
  const [rowData, setRowData] = useState<any>()

  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: 'Id',
      field: 'id',
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
      // hide: true,
    },
    {
      headerName: 'TagName',
      field: 'tagName',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 200,
    },
    {
      headerName: 'Units',
      field: 'units',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Description',
      field: 'descr',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 300,
    },
  ])

  /* Delete Modal */
  const showModal = () => {
    console.log('test')
  }

  const onUploadClick = (json: any) => {
    setRowData(json)
  }

  const toggleUploadModal = () => {
    setUploadModal(!uploadModal)
  }

  /* Tag Form(Add, Update) Modal */
  const toggleFormModal = (type: string, e: any) => {
    e.preventDefault()
    setModalType(type)
    setFormModal(true)
  }

  const onSaveClick = () => {
    setFormModal(false)
  }

  return (
    <>
      <Box sx={{ m: 2, height: 30 }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button type="primary" onClick={toggleUploadModal}>
              업로드
            </Button>
            <Button type="primary" onClick={(e) => toggleFormModal('add', e)}>
              태그 등록
            </Button>
            <Button type="primary" onClick={(e) => toggleFormModal('update', e)}>
              태그 수정
            </Button>
            <Button type="primary" onClick={showModal}>
              태그 삭제
            </Button>
          </Stack>
        </div>
      </Box>
      <Box sx={{ m: 2, height: 500 }}>
        <div className="ag-theme-alpine" style={gridStyle}>
          <Title>TagList</Title>
          <AgGridReact
            rowHeight={40}
            //ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection={'multiple'}

            // getRowId={getRowId}
            // onRowSelected={onRowSelected}
          ></AgGridReact>
          <Stack sx={{ mt: 2 }} spacing={1} direction="row" justifyContent="flex-end">
            <Button type="primary" color="success">
              저장
            </Button>
          </Stack>
        </div>
      </Box>
      <FormModal show={formModal} type={modalType} onSaveClick={onSaveClick} onCloseClick={() => setFormModal(false)} />

      <UploadModal show={uploadModal} onUploadClick={onUploadClick} onCloseClick={() => setUploadModal(false)} />
    </>
  )
}

export default TagList
