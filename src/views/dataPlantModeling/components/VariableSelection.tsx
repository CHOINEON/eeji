import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
// import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Box } from '@mui/material'
import TagSelectList from './TagSelectList'

const VariableSelection = () => {
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
    setLoading(true)

    const Object: object = {
      com_id: localStorage.getItem('companyId'),
      cause: [
        {
          table_nm: 'tc',
          variable: ['Tag-2'],
        },
      ],
      target: {
        table_nm: 'tc',
        variable: ['Tag-1'],
      },
    }

    // console.log('json:', JSON.stringify(Object))
    // console.log('JSONstr:', JSONstr)

    ///////////////NEED TEST ////////////
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/preprocessing', JSON.stringify(Object), {
        headers: {
          'Content-Type': `application/json`,
        },
      })
      .then(
        (response: any) => {
          console.log('preprocessing response:', response)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.log('error:', error)
        }
      )
  }

  return (
    <>
      {/* <div className="ag-theme-alpine" style={{ height: '700px', width: '320px', float: 'left' }}>
        <TreeView
          aria-label="file system navigator"
          // defaultCollapseIcon={<ExpandMoreIcon />}
          // defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Applications">
            <TreeItem nodeId="2" label="Calendar" />
          </TreeItem>
          <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="10" label="OSS" />
            <TreeItem nodeId="6" label="MUI">
              <TreeItem nodeId="8" label="index.js" />
            </TreeItem>
          </TreeItem>
        </TreeView>
      </div> */}
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
            <TagSelectList multipleSelection={true} />
          </div>

          <div style={{ display: 'block', float: 'left' }}>
            타겟변수 :
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel htmlFor="grouped-native-select">Target Variable...</InputLabel>
              <Select native defaultValue="" id="grouped-native-select" label="Target Variable">
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
          NEXT
        </Button>

        {loading && <CircularProgress isIndeterminate color="green.300" />}
      </div> */}
    </>
  )
}

export default VariableSelection
