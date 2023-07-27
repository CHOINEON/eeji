import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import styled from '@emotion/styled'
import axios from 'axios'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { AgGridReact } from 'ag-grid-react'
import { Button } from 'antd'
import LineChart from 'views/DataAnalysis/components/Chart/LineChart'
import DataImportModal from 'views/DataAnalysis/components/DataInfo/DataImportModal'
import CircularProgress from '@mui/material/CircularProgress'

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
  // const requestParam = { url: '/api/upload' }
  // const [modelList, setModelList] = useState([])
  const [rowData, setRowData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [requestParam, setRequestParam] = useState({})
  const [selectedRow, setSelectedRow] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])

  const editColumnRenderer = (param: any) => {
    // console.log('param:', param)

    const handleDeleteClick = useCallback((modelId: any) => {
      // console.log('delete:', modelId)

      const com_id = localStorage.getItem('companyId')
      axios
        .delete(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model?com_id=' + com_id + '&model_id=' + modelId)
        .then((response) => {
          // console.log('response:', response)
          if (response.status === 200) {
            alert('success')
          }
          fetchModelList()
        })
        .catch((error) => console.log('error:', error))
    }, [])

    return (
      <span>
        <a href="#" style={{ color: 'red' }} onClick={() => handleDeleteClick(param.data.model_id)}>
          Delete
        </a>
      </span>
    )
  }

  const [columnDefs] = useState([
    { field: 'model_name', headerName: 'Name', resizable: true },
    { field: 'model_type', headerName: 'Type', resizable: true, width: 100 },
    { field: 'file_nm', headerName: 'File Name' },
    { field: 'x_value', headerName: 'X', resizable: true },
    { field: 'y_value', headerName: 'Y', resizable: true, width: 100 },
    { field: '', headerName: 'accuracy', resizable: true, width: 100 },
    { field: '', headerName: 'loss', resizable: true, width: 100 },
    { field: '', headerName: 'Creator', resizable: true, width: 100 },
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
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model?com_id=' + com_id)
      .then((response: any) => {
        setRowData(response.data)
      })
      .catch((err) => console.error(err))
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const handleSave = (savedFile: any) => {
    getChartdata(savedFile)
  }

  const getChartdata = (rawFile: any) => {
    // console.log('file：', rawFile)

    setLoading(true)
    // const modelArr = new Array(selectedRow.model_id.toString())
    const formData = new FormData()

    for (const i in selectedRow) {
      formData.append('com_id', localStorage.getItem('companyId'))
      formData.append('model_id', selectedRow[i].model_id)
      formData.append('file', rawFile) //single file
    }

    // key/value 쌍이 담긴 리스트
    for (const [name, value] of formData) {
      console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
    }

    // const param = { com_id: com_id, model_id: selectedRow.model_id, file: file }
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model/chart', formData, {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      })
      .then(
        (response: any) => {
          if (response.status === 200) {
            console.log('/api/predict/model/chart response: ', response.data)
            setChartData(response.data)
            setLoading(false)
          }
        },
        (error) => {
          console.log('error:', error)
          setLoading(false)
        }
      )
  }

  // const handleCardClick = (param: any) => {
  //   console.log(param)
  //   setModalOpen(true)
  // }

  const onGridReady = useCallback(fetchModelList, [])

  const handleRunTest = () => {
    setRequestParam({ url: '/api/upload', data: selectedRow })
    setModalOpen(true)
  }

  const onSelectionChanged = useCallback(() => {
    const selectedRowdata = gridRef.current.api.getSelectedRows()
    setSelectedRow(selectedRowdata)
    // console.log('selectedRowdata:', selectedRowdata)
  }, [])

  return (
    <>
      {/* <div>
        {modelList.map((model, index) => (
          <ModelCard data={model} key={index} onClicked={handleCardClick} />
        ))}
      </div> */}
      <ThemeProvider theme={theme}>
        <div style={{ textAlign: 'right', margin: '20px 0' }}>
          <Button type="primary" onClick={handleRunTest}>
            Run
          </Button>
        </div>
        <div className="grid-wrapper">
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
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
        <div className="grid-wrapper" style={{ marginTop: '30px' }}>
          <LineChart chartData={chartData} />
        </div>
        <DataImportModal
          type="TEST"
          modalOpen={modalOpen}
          onClose={handleClose}
          onSaveData={handleSave}
          reqParams={requestParam}
        />
        {loading && <CircularProgress />}
      </ThemeProvider>
      {/* <div style={{ display: 'block', width: '100%', margin: 'auto' }}>
        <LineChart />
      </div> */}
    </>
  )
}

export default ModelList
