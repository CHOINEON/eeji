import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { Button } from 'antd'
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { dataFileStore, dataSetStore, stepCountStore } from './store/atom'
import {
  selectedVarStoreX,
  selectedVarStoreY,
  usedVariableStore,
  variableStore,
  indexColumnStore,
} from './store/variable/atom'
import { Col, Row, Modal, Switch } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'
import './style/styles.css'
import { ArrowRightOutlined } from '@ant-design/icons'

const VariableSelection = () => {
  const setActiveStep = useSetRecoilState(stepCountStore)
  const [loading, setLoading] = useState(false)
  const selectedDataset = useRecoilState(dataSetStore)
  const selectedFile = useRecoilState(dataFileStore)

  //최초 리스트
  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  // const tagList = useRecoilValue(currentTagListQuery)
  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)
  const [indexColumn, setIndexColumn] = useRecoilState(indexColumnStore)

  //left side
  // const [tagList, setTagList] = useState([])
  // const [chartData, setChartData] = useState([])

  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (selectedDataset[0] == '' || selectedFile[0] == '') {
      alert('파일이 선택되지 않았습니다.')
      setActiveStep(0)
    }

    // corr plot에서 선택된 값 초기화
    setSelectedVarX([])
    setSelectedVarY([])
  }, [])

  const handleClick = () => {
    // console.log('selectedX:', selectedVarX)
    // console.log('selectedY:', selectedVarY)

    if (selectedVarX.length === 0) {
      alert('X 변수를 선택해 주세요')
    } else if (selectedVarY.length === 0) {
      alert('Y 변수를 선택해 주세요')
    } else {
      showModal()
    }
  }

  const showModal = () => {
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
  }

  const handlePreprocessing = () => {
    setLoading(true)
    hideModal()
    // console.log('selectedX:', selectedVarX)
    // console.log('selectedY:', selectedVarY)

    const causeArray = []
    const targetArray = []

    causeArray.push({ file_nm: variableList[0].label, variable: selectedVarX })
    targetArray.push({ file_nm: variableList[0].label, variable: selectedVarY })

    const Object: any = {
      com_id: localStorage.getItem('companyId'),
      dataset_id: selectedDataset[0],
      cause: causeArray,
      target: targetArray[0],
    }
    // console.log('Object:', Object)

    if (indexColumn !== '') {
      Object['data_index'] = indexColumn
    }

    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/preprocessing', JSON.stringify(Object), {
            headers: {
              'Content-Type': `application/json`,
            },
          })
          .then(
            (response: any) => {
              // console.log('preprocessing response:', response.data)
              if (response.status === 200) {
                // setTagList(response.data)
                setLoading(false)
                setActiveStep(3)
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
    if (!param) setIndexColumn('')
    setChecked(param)
  }

  const handleSelect = (param: any) => {
    // console.log('select:', param)

    if (param.type === 'x') {
      //multiple selection
      setSelectedVarX((prev) => [...prev, param.value])

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (param.value.includes(usedVariable[i].value)) {
          result.push({ value: usedVariable[i].value, used: true, category: param.type })
        } else {
          result.push(usedVariable[i])
        }
      }

      setUsedVariable(result)
    } else if (param.type == 'y') {
      //single selection
      setSelectedVarY([param.value])

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        //같은 카테고리에 선택된거 있으면 해제
        if (usedVariable[i].category === param.type) {
          result.push({ value: usedVariable[i].value, used: false })
        }
        //선택된 값은 true처리
        else if (usedVariable[i].value === param.value) {
          result.push({ value: usedVariable[i].value, used: true, category: param.type })
        } else {
          //그 외는 그대로 렌더링
          result.push(usedVariable[i])
        }
      }

      setUsedVariable(result)
    } else {
      setIndexColumn(param.value)
    }
  }

  const handleDeselect = (param: any) => {
    // console.log('deselect:', param)

    if (param.type === 'x') {
      //multiple selection

      setSelectedVarX(selectedVarX.filter((x) => x !== param.value))

      const result = []
      for (let i = 0; i < usedVariable.length; i++) {
        if (param.value === usedVariable[i].value) {
          result.push({ value: usedVariable[i].value, used: false })
        } else {
          result.push(usedVariable[i])
        }
      }
      setUsedVariable(result)
    }

    //
  }
  // const handleChange = (param: any) => {
  //   // console.log('before:', usedVariable)

  //   const newValue = param.value
  //   const result = []
  //   for (let i = 0; i < usedVariable.length; i++) {
  //     if (newValue.includes(usedVariable[i].value)) {
  //       result.push({ value: usedVariable[i].value, used: true, category: param.type })
  //     } else {
  //       result.push(usedVariable[i])
  //     }
  //   }
  //   // console.log('result:', result)
  //   setUsedVariable(result)
  // }

  return (
    <>
      <Box
        className="rounded-box"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            width: '100%',
            // m: 1,
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
            <div style={{ marginTop: '20px' }}>
              <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="single"
                type="y"
                title="타겟변수(Y)"
                onSelect={handleSelect}
                onDeselect={handleDeselect}
              />
            </div>
          </Col>
          <Col span="6">
            <div style={{ marginTop: '20px' }}>
              {' '}
              <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="multiple"
                type="x"
                title="원인변수(X)"
                onSelect={handleSelect}
                onDeselect={handleDeselect}
              />
            </div>
          </Col>
          <Col span="6">
            <div style={{ marginTop: '20px' }}>
              {checked && (
                <NewTagSelect
                  style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                  selectionType=""
                  type="date"
                  title="날짜 컬럼"
                  onSelect={handleSelect}
                  onDeselect={handleDeselect}

                  // subtext="시계열 데이터의 경우만 선택"
                  // defaultOptions={variableList}
                />
              )}
            </div>
          </Col>
        </Row>
      </Box>
      <div style={{ width: '100%', float: 'right', margin: '10px 0px' }}>
        <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
          <Button type="text" icon={<ArrowRightOutlined />} onClick={handleClick} loading={loading}>
            NEXT
          </Button>
        </Box>
      </div>
      {open && (
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
      )}
    </>
  )
}

export default VariableSelection
