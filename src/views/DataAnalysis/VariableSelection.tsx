import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { indexColumnStore, selectedVarStoreX, selectedVarStoreY, stepCountStore, variableStore } from './atom'
import { Col, Row, DatePicker, Select, Space, Divider, Input, Modal, Switch } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined'
import './style/styles.css'

const VariableSelection = () => {
  const setActiveStep = useSetRecoilState(stepCountStore)
  const [loading, setLoading] = useState(false)

  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)

  // const tagList = useRecoilValue(currentTagListQuery)
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const indexColumn = useRecoilValue(indexColumnStore)

  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  const [filteredList, setFilteredList] = useState([])

  useEffect(() => {
    const cancelSource = axios.CancelToken.source()
    fetchTaglistData()
    // console.log('tagList:', tagList)

    return () => {
      console.log('variable selection cleanup')
      // cancelSource.cancel()
    }
  }, [])

  useEffect(() => {
    if (selectedVarY.length > 0 && filteredList.length > 0) {
      for (let i = 0; i < selectedVarY.length; i++) {
        const options = filteredList[0].options.filter((x: any) => x.value !== selectedVarY[i])
        const result = []

        result.push({
          label: filteredList[0].label,
          options: options,
        })
        setFilteredList(result)
      }
    }
    // console.log('----------', result)
  }, [selectedVarY])

  const fetchTaglistData = () => {
    axios
      .post(
        process.env.REACT_APP_API_SERVER_URL + '/api/tag/list',
        {
          com_id: localStorage.getItem('companyId'),
          search_type: 'tree',
        }
        // { cancelToken: cancelSource }
      )
      .then((response) => {
        // console.log('fetchTaglistData:', response.data)
        setVariableList(response.data)
        setFilteredList(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  // const onSelectionChanged = (param: any) => {
  //   if (param.type === 'TARGET_VARIABLE') setSelectedArr(param)
  // }

  const handleClick = () => {
    if (selectedVarX.length === 0) {
      alert('X 변수를 선택해 주세요')
    } else if (selectedVarY.length === 0) {
      alert('Y 변수를 선택해 주세요')
    } else {
      showModal()
    }
  }

  const showModal = () => {
    // console.log('selected x:', selectedVarX)
    // console.log('selected y:', selectedVarY)
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
  }

  const handlePreprocessing = () => {
    setLoading(true)
    hideModal()

    const causeArray = []
    const targetArray = []
    // console.log('selectedX:', selectedVarX)
    // console.log('selectedY:', selectedVarY)

    causeArray.push({ table_nm: variableList[0].label, variable: selectedVarX })
    targetArray.push({ table_nm: variableList[0].label, variable: selectedVarY })

    const Object: any = {
      com_id: localStorage.getItem('companyId'),
      cause: causeArray,
      target: targetArray[0],
    }
    console.log('Object:', Object)

    if (indexColumn !== '') {
      Object['data_index'] = indexColumn
    }

    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/preprocessing', JSON.stringify(Object), {
            headers: {
              'Content-Type': `application/json`,
            },
          })
          .then(
            (response: any) => {
              console.log('preprocessing response:', response)
              if (response.status === 200) {
                setLoading(false)
                setActiveStep(2)
              }
            },
            (error) => {
              setLoading(false)
              console.log('error:', error)
            }
          )
      } catch (error) {
        if (error.name === 'AbortError') {
          //
        }
      }
    }
    fetchData()
    return () => {
      abortController.abort()
    }
  }

  const onChangeSwitch = (param: any) => {
    // console.log('onChangeSwitch:', param)
    setChecked(param)
  }

  return (
    <>
      {/* <VariableProvider> */}
      <Box
        className="rounded-box"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: '100%',
            // height: 100,
          },
        }}
      >
        <Row justify="space-evenly" align="top"></Row>
        <Row style={{ width: '100%', marginLeft: '70px' }} justify={'start'}>
          <Col span="5">
            <div style={{ marginTop: '30px' }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                marginLeft={0}
                style={{ display: 'inline-block', float: 'left' }}
              >
                시계열 데이터
              </Typography>
              <Switch onChange={onChangeSwitch} checked={checked} style={{ margin: '0 10px' }} />
            </div>
          </Col>
          <Col span="6">
            <NewTagSelect
              style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
              selectionType="multiple"
              type="TARGET_VARIABLE"
              title="타겟변수(Y)"
              defaultOptions={variableList}
            />
          </Col>
          <Col span="6">
            <NewTagSelect
              style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
              selectionType="multiple"
              type="EXPLANATORY_VARIABLE"
              title="원인변수(X)"
              defaultOptions={variableList}
              filteredOptions={filteredList}
            />
          </Col>
          <Col span="6">
            {checked && (
              <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType=""
                type="INDEX_COLUMN"
                title="날짜 컬럼"
                subtext="시계열 데이터의 경우만 선택"
                defaultOptions={variableList}
              />
            )}
          </Col>
        </Row>
        {/* <Divider orientation="left">Variables</Divider> */}
        <Row justify="space-evenly" align="top"></Row>

        {/* <div style={{ display: 'block', float: 'left', margin: '10px 40px' }}>
          <Typography variant="subtitle1" gutterBottom marginLeft={1}>
            원인변수
          </Typography>
          <TagSelectList multipleSelection={true} type="EXPLANATORY_VARIABLE" onSelection={onSelectionChanged} />
        </div>

        <div style={{ display: 'block', float: 'left', margin: '10px 40px' }}>
          <Typography variant="subtitle1" gutterBottom marginLeft={1}>
            타겟변수
          </Typography>
          <TagSelectList multipleSelection={false} type="TARGET_VARIABLE" onSelection={onSelectionChanged} />
        </div> */}
      </Box>
      <div style={{ width: '100%', float: 'right', marginTop: '30px' }}>
        <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
          {loading ? <CircularProgress /> : <Button onClick={handleClick}>SAVE</Button>}
        </Box>
      </div>
      <Modal
        title="선택 확인"
        open={open}
        onOk={handlePreprocessing}
        onCancel={hideModal}
        okText="저장"
        cancelText="취소"
      >
        <p>X : {selectedVarX.length > 0 && selectedVarX.join(' / ')}</p>
        <p>Y : {selectedVarY.length > 0 && selectedVarY.join(' / ')}</p>
        <p>날짜 : {indexColumn === '' ? '없음' : indexColumn}</p>
      </Modal>
      {/* </VariableProvider> */}
    </>
  )
}

export default VariableSelection
