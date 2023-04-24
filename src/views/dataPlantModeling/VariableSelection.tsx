import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
// import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'
import { Button } from '@chakra-ui/react'
import { CircularProgress } from '@chakra-ui/react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import ListSubheader from '@mui/material/ListSubheader'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Paper from '@mui/material/Paper'
import { Box } from '@mui/material'

const VariableSelection = (props: any) => {
  const { onClickNext } = props
  const [loading, setLoading] = useState(false)
  // const gridStyle = useMemo(() => ({ height: '700px', width: '320px' }), [])
  const gridRef = useRef<AgGridReact<any>>(null)
  //datagrid row data
  const [rowData, setRowData] = useState<Array<any>>()
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: 'TagName',
      field: 'tag_id',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 150,
    },
    {
      headerName: 'TableName',
      field: 'table_nm',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      width: 150,
    },
  ])

  useEffect(() => {
    setRowData([])
    fetchTaglistData()
  }, [])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'all',
      })
      .then((response) => {
        // console.log('fetchTaglistData:', response)
        setRowData(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  const handlePreprocessing = () => {
    console.log('clicked ')
    setLoading(true)
    onClickNext(2)

    const testRequest: object = {
      com_id: '회사 아이디',
      cause: [
        {
          table_nm: '변수 데이터',
          variable: ['선택한 변수'],
        },
      ],
      target: {
        table_nm: '변수 데이터',
        variable: ['선택한 변수'],
      },
    }

    ///////////////NEED TEST ////////////
    axios.post(process.env.REACT_APP_API_LOCAL_URL + '/api/tag/preprocessing', testRequest).then(
      (response: any) => {
        console.log('preprocessing response:', response)
        setLoading(false)
      },
      (error) => {
        console.log('error:', error)
      }
    )
  }

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: '700px', width: '320px', float: 'left' }}>
        <AgGridReact
          rowHeight={40}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection={'multiple'}
          // getRowId={getRowId}
          // onRowSelected={onRowSelected}
          // onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
      </div>
      <>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 5,
              // width: '100%',
              // height: 100,
            },
          }}
        >
          {/* <Paper style={{ margin: 10 }}> */}
          <div style={{ display: 'block', float: 'left' }}>
            원인변수 :
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="grouped-native-select">Grouping</InputLabel>
              <Select native defaultValue="" id="grouped-native-select" label="Grouping">
                <option aria-label="None" value="" />
                <optgroup label="PULL">
                  <option value={1}>pull</option>
                </optgroup>
                <optgroup label="TC">
                  <option value={3}>Tag-1</option>
                  <option value={4}>Tag-2</option>
                </optgroup>
                <optgroup label="POWER">
                  <option value={3}>single-phase</option>
                  <option value={4}>three-phase</option>
                </optgroup>
              </Select>
            </FormControl>
          </div>

          <div style={{ display: 'block', float: 'left' }}>
            타겟변수 :
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="grouped-native-select">Grouping</InputLabel>
              <Select native defaultValue="" id="grouped-native-select" label="Grouping">
                <option aria-label="None" value="" />
                <optgroup label="PULL">
                  <option value={1}>pull</option>
                </optgroup>
                <optgroup label="TC">
                  <option value={3}>Tag-1</option>
                  <option value={4}>Tag-2</option>
                </optgroup>
                <optgroup label="POWER">
                  <option value={3}>single-phase</option>
                  <option value={4}>three-phase</option>
                </optgroup>
              </Select>
            </FormControl>
          </div>
          {/* </Paper> */}
        </Box>
      </>

      {/* <div style={{ textAlign: 'right' }}>
        <Button colorScheme="teal" variant="ghost" onClick={handlePreprocessing}>
          Preprocessing
        </Button>

        {loading && <CircularProgress isIndeterminate color="green.300" />}
      </div> */}
    </>
  )
}

export default VariableSelection
