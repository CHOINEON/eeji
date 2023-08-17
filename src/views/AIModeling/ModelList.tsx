import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import styled from '@emotion/styled'
import axios from 'axios'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { AgGridReact } from 'ag-grid-react'
import { Button, Modal, message } from 'antd'
import LineChart from 'views/DataAnalysis/components/Chart/LineChart'
import DataImportModal from 'views/DataAnalysis/components/DataInfo/DataImportModal'
import CircularProgress from '@mui/material/CircularProgress'
import { useRecoilState } from 'recoil'
import { importModalAtom, listModalAtom } from 'views/DataAnalysis/store/modal/atom'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { runModalAtom } from './store/atom'
import ModelRunModal from './ModelRunModal'

export type Model = {
  com_id: string
  create_date: string
  model_id: string
  model_name: string
  model_type: string
  x_value: string
  y_value: string
}

const ModelList = () => {
  const gridRef = useRef<AgGridReact<any>>(null)
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')
  const [rowData, setRowData] = useState([])

  // const [modalOpen, setModalOpen] = useState(false)
  const [importOpen, setImportOpen] = useRecoilState(runModalAtom)
  const [messageApi, contextHolder] = message.useMessage()

  const [requestParam, setRequestParam] = useState({})
  const [selectedRow, setSelectedRow] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])

  const modelNameColumnRenderer = (param: any) => {
    // console.log('param:', param)

    const handleModelClick = useCallback((model: any) => {
      //
      //팝업이 열리고 그 팝업에 과거 예측 이미지랑 업로드 컴포넌트 보임
      setImportOpen(true)
    }, [])

    return (
      <span>
        <a href="#" onClick={() => handleModelClick(param.data.model_id)}>
          <span style={{ textDecoration: 'underline' }}>{param.data.model_name}</span>
        </a>
      </span>
    )
  }

  const showConfirm = (param: any) => {
    Modal.confirm({
      title: 'Do you Want to delete this model?',
      icon: <ExclamationCircleFilled />,
      content: `Deletion is permanent and you will not be able to undo it.`,
      onOk() {
        handleDeleteClick(param.value)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const editColumnRenderer = (param: any) => {
    return (
      <span>
        <a href="#" style={{ color: 'red' }} onClick={() => showConfirm(param.data.model_id)}>
          Delete
        </a>
      </span>
    )
  }

  const handleDeleteClick = useCallback((modelId: any) => {
    // console.log('delete:', modelId)

    axios
      .delete(
        process.env.REACT_APP_API_SERVER_URL +
          '/api/predict/model?com_id=' +
          com_id +
          '&model_id=' +
          modelId +
          '&user_id=' +
          user_id
      )
      .then((response) => {
        console.log('response:', response)
        if (response.status === 200) {
          messageApi.open({
            type: 'success',
            content: 'Deleted.',
            duration: 1,
            style: {
              margin: 'auto',
            },
          })
        }
        fetchModelList()
      })
      .catch((error) => console.log('error:', error))
  }, [])

  const [columnDefs] = useState([
    { field: 'model_name', headerName: 'Name', resizable: true, cellRenderer: modelNameColumnRenderer, width: 200 },
    { field: 'model_type', headerName: 'Type', resizable: true, width: 100 },
    { field: 'file_nm', headerName: 'File Name' },
    { field: 'x_value', headerName: 'X', resizable: true },
    { field: 'y_value', headerName: 'Y', resizable: true, width: 100 },
    { field: 'error', headerName: 'Error', resizable: true, width: 120 },
    { field: 'creator', headerName: 'Creator', resizable: true, width: 100 },
    { field: 'create_date', headerName: 'Created', resizable: true },
    { field: 'edit', cellRenderer: editColumnRenderer },
  ])

  useEffect(() => {
    fetchModelList()
    // sizeToFit()
  }, [])

  const sizeToFit = useCallback(() => {
    if (gridRef.current !== undefined) {
      gridRef.current.api.sizeColumnsToFit({
        defaultMinWidth: 100,
        columnLimits: [{ key: 'model_name', minWidth: 100 }],
      })
    }
  }, [])

  const fetchModelList = () => {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model?com_id=' + com_id + '&user_id=' + user_id)
      .then((response: any) => {
        console.log('/api/predict/model resp::', response)
        setRowData(response.data)
      })
      .catch((err) => console.error(err))
  }

  // const handleCardClick = (param: any) => {
  //   console.log(param)
  //   setModalOpen(true)
  // }

  const onGridReady = useCallback(fetchModelList, [])

  const handleRunTest = () => {
    setRequestParam({ url: '/api/upload', data: selectedRow })
    // setImportOpen(true)
  }

  const onSelectionChanged = useCallback(() => {
    const selectedRowdata = gridRef.current.api.getSelectedRows()
    setSelectedRow(selectedRowdata[0])
    // console.log('selectedRowdata:', selectedRowdata[0])
  }, [])

  return (
    <>
      {/* <div>
        {modelList.map((model, index) => (
          <ModelCard data={model} key={index} onClicked={handleCardClick} />
        ))}
      </div> */}
      <ThemeProvider theme={theme}>
        {/* <div style={{ textAlign: 'right', margin: '20px 0' }}>
          <Button type="primary" onClick={handleRunTest}>
            Run
          </Button>
        </div> */}

        <div style={{ marginTop: '30px' }} className="grid-wrapper">
          <div className="ag-theme-alpine" style={{ height: 700, width: '100%' }}>
            <AgGridReact
              rowSelection="multiple"
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onSelectionChanged={onSelectionChanged}
            ></AgGridReact>
          </div>
        </div>
        {/* <div className="d-block">
          <LineChart chartData={chartData} />
        </div> */}
        <ModelRunModal selectedData={selectedRow} />
        {loading && <CircularProgress />}
      </ThemeProvider>
      {/* <div style={{ display: 'block', width: '100%', margin: 'auto' }}>
        <LineChart />
      </div> */}
      {contextHolder}
    </>
  )
}

export default ModelList
