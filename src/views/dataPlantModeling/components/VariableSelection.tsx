import React, { useState, useMemo, useRef, useEffect, useReducer, useCallback, createContext, Dispatch } from 'react'
import axios from 'axios'
import { Box } from '@mui/material'
import TagSelectList from './TagTree/TagSelectList'
import TagTreeList from '../backup/TagTreeList'
import TagSelectReducer from './TagTree/reducer'
import initialState from './TagTree/initialState'
import { VariableProvider } from './VariableContext'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { slideFadeConfig } from '@chakra-ui/react'
import { readJsonConfigFile } from 'typescript'

const VariableSelection = (props: any) => {
  const { onClickNext } = props
  const [loading, setLoading] = useState(false)
  // const [rowData, setRowData] = useState<Array<any>>()
  const [targetVar, setTargetVar] = useState()
  const [explanatoryVar, setExplanatoryVar] = useState()
  // let object

  useEffect(() => {
    // setRowData([])
    // fetchTaglistData()
  }, [])

  // const fetchTaglistData = () => {
  //   axios
  //     .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
  //       com_id: localStorage.getItem('companyId'),
  //       search_type: 'all',
  //     })
  //     .then((response) => {
  //       // console.log('fetchTaglistData:', response)
  //       setRowData(response.data)
  //     })
  //     .catch((error) => error('Data Load Failed'))
  // }

  const onSelectionChanged = (type: any, payload: any) => {
    // console.log('type:', type)
    // console.log('payload:', payload)

    // object = {
    //   com_id: localStorage.getItem('companyId'),
    //   cause: [{}],
    //   target: [{}],
    // }
    if (type === 'EXPLANATORY_VARIABLE') setExplanatoryVar(payload)
    if (type === 'TARGET_VARIABLE') setTargetVar(payload)
  }

  const handlePreprocessing = () => {
    setLoading(true)

    const Object: object = {
      com_id: localStorage.getItem('companyId'),
      cause: explanatoryVar,
      target: targetVar && targetVar[0],
    }

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/preprocessing', JSON.stringify(Object), {
        headers: {
          'Content-Type': `application/json`,
        },
      })
      .then(
        (response: any) => {
          // console.log('preprocessing response:', response)
          if (response.status === 200) {
            onClickNext(true)
            setLoading(false)
          }
        },
        (error) => {
          setLoading(false)
          console.log('error:', error)
        }
      )
  }

  return (
    <>
      {/* <VariableProvider> */}
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
          <TagSelectList multipleSelection={true} type="EXPLANATORY_VARIABLE" onSelection={onSelectionChanged} />
        </div>

        <div style={{ display: 'block', float: 'left' }}>
          타겟변수 :{/* <TagTreeList /> */}
          <TagSelectList multipleSelection={false} type="TARGET_VARIABLE" onSelection={onSelectionChanged} />
        </div>

        <div style={{ width: '100%', float: 'right' }}>
          <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
            {loading ? (
              <CircularProgress style={{ position: 'relative', top: '200px' }} />
            ) : (
              <Button onClick={handlePreprocessing}>Next</Button>
            )}
          </Box>
        </div>
        {/* </Paper> */}
      </Box>
      {/* </VariableProvider> */}
    </>
  )
}

export default VariableSelection
