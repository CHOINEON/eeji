import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import styled from '@emotion/styled'
import axios from 'axios'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { AgGridReact } from 'ag-grid-react'
import { Button, Modal, message } from 'antd'
import CircularProgress from '@mui/material/CircularProgress'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { modelListAtom } from './store/atom'
import { dateTimeToString, removeSeparator } from 'utils/DateFunction'

export type Model = {
  com_id: string
  create_date: string
  model_id: string
  model_name: string
  model_type: string
  x_value: string
  y_value: string
}

const ModelList = (props: any) => {
  const { onSelected } = props
  const [modelList, setModelList] = useRecoilState(modelListAtom)

  const gridRef = useRef<AgGridReact<any>>(null)
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')
  const [rowData, setRowData] = useState([])

  const [messageApi, contextHolder] = message.useMessage()

  const [requestParam, setRequestParam] = useState({})
  const [selectedRow, setSelectedRow] = useState<any>('')
  const [loading, setLoading] = useState(false)

  const modelNameColumnRenderer = (param: any) => {
    return (
      <span>
        <Link style={{ textDecoration: 'underline' }} to={`/admin/model/${param.data.model_name}`}>
          {param.data.model_name}
        </Link>
      </span>
    )
  }

  const showConfirm = (param: any) => {
    Modal.confirm({
      title: 'Do you want to delete this model?',
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

  const dateColumnRenderer = (param: any) => {
    return removeSeparator(param.value)
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
    { field: 'create_date', headerName: 'Created', resizable: true, cellRenderer: dateColumnRenderer },
    { field: 'edit', cellRenderer: editColumnRenderer },
  ])

  useEffect(() => {
    fetchModelList()
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
        // console.log('/api/predict/model resp::', response)
        setRowData(response.data)
        setModelList(response.data)
      })
      .catch((err) => console.error(err))
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={{ marginTop: '30px' }} className="grid-wrapper">
          <div className="ag-theme-alpine" style={{ height: 800, width: '100%' }}>
            <AgGridReact
              rowSelection="multiple"
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              // onGridReady={onGridReady}
              // onSelectionChanged={onSelectionChanged}
            ></AgGridReact>
          </div>
        </div>

        {loading && <CircularProgress />}
      </ThemeProvider>
      {contextHolder}
    </>
  )
}

export default ModelList
