import React, { useState, useMemo, useRef, useEffect } from 'react'
// import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import '../style/styles.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'
import { ProgressButton } from '@syncfusion/ej2-react-splitbuttons'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Box } from '@mui/material'
import UploadModal from './UploadModal'

const TagList = (props: any) => {
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])

  const [uploadModal, setUploadModal] = React.useState(false)
  const [formModal, setFormModal] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  //datagrid row data
  const [rowData, setRowData] = useState<Array<any>>()
  const [selectedRowData, setSelectedRowData] = useState({ id: 0, name: '', unit: '', description: '' })

  const [columnDefs] = useState<ColDef[]>([
    // {
    //   headerName: 'Id',
    //   field: 'id',
    //   floatingFilter: true,
    //   filter: 'agNumberColumnFilter',
    //   hide: true,
    // },
    {
      headerName: 'TagName',
      field: 'name',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 200,
    },
    // {
    //   headerName: 'Units',
    //   field: 'unit',
    //   floatingFilter: true,
    //   filter: 'agTextColumnFilter',
    //   width: 130,
    //   // hide: true,
    // },
    // {
    //   headerName: 'Description',
    //   field: 'description',
    //   floatingFilter: true,
    //   filter: 'agTextColumnFilter',
    //   width: 300,
    //   hide: true,
    // },
  ])

  useEffect(() => {
    setRowData([])
  }, [])

  const getData = () => {
    axios
      .get('http://220.94.157.27:59871/getTagList')
      .then((response) => {
        console.log('resp:', response)
        setRowData(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const onUploaded = (isUploaded: boolean) => {
    console.log('isupload:', isUploaded)
    if (isUploaded) {
      getData()
    }
  }

  const toggleUploadModal = () => {
    // alert('기능 구현 완료/테스트 중')
    setUploadModal(!uploadModal)
  }

  /* Tag Form(Add, Update) Modal */
  const toggleFormModal = (type: string, e: any) => {
    e.preventDefault()
    setModalType(type)

    if (type === 'add') {
      setFormModal(true)
    } else {
      alert('기능 테스트 중입니다')
    }
  }

  const onSaveClick = () => {
    setFormModal(false)
  }

  const handleSave = () => {
    axios
      .post('http://220.94.157.27:59871/createTag', JSON.stringify(rowData))
      .then((response) => {
        console.log('resp:', response)
      })
      .catch((error) => error('failed'))
  }

  const handleDelete = () => {
    // console.log('row:', selectedRowData)
    //////////////////selectedRow 비우기

    if (selectedRowData) {
      axios
        .delete('http://220.94.157.27:59871/deleteTag/' + selectedRowData.id)
        .then((response) => {
          console.log('resp:', response)

          // const progressBtn: ProgressButton = new ProgressButton({
          //   content: '태그삭제',
          //   spinSettings: { position: 'Right', width: 20, template: '<div class="template"></div>' },
          // })
          // progressBtn.appendTo('#progressbtn')

          alert('삭제 완료')
          getData()
        })
        .catch((error) => error('failed'))
    } else {
      alert('삭제할 태그를 선택해 주세요')
    }
  }

  const onRowSelected = (e: any) => {
    // console.log('onRowSelected:', e)
    setSelectedRowData(e.data)
  }

  const onRowEditted = () => {
    getData()
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
      {/* </Box> */}
      {/* <Box sx={{ m: 2, height: 550 }}> */}
      <div className="ag-theme-alpine" style={gridStyle}>
        {/* <Title>TagList</Title> */}
        <AgGridReact
          rowHeight={40}
          //ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={'multiple'}
          // getRowId={getRowId}
          onRowSelected={onRowSelected}
        ></AgGridReact>
      </div>
      <Box style={{ height: '40px', textAlign: 'center', marginTop: '10px' }}>
        <ButtonComponent cssClass="e-info" onClick={toggleUploadModal}>
          Load Data
        </ButtonComponent>
      </Box>
      {/* </Box> */}
      {/* <FormModal
        show={formModal}
        type={modalType}
        onSaveClick={onSaveClick}
        onCloseClick={() => setFormModal(false)}
        selectedData={selectedRowData}
        onRowEditted={onRowEditted}
      /> */}

      <UploadModal show={uploadModal} onUploaded={onUploaded} onCloseClick={() => setUploadModal(false)} />
    </>
  )
}

export default TagList
