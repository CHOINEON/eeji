import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  dataFileStore,
  dataSetStore,
  indexColumnStore,
  selectedVarStoreX,
  selectedVarStoreY,
  stepCountStore,
  usedVariableStore,
  variableStore,
} from './store/atom'
import { Col, Row, Modal, Switch } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'
import './style/styles.css'

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

  //left side
  const [tagList, setTagList] = useState([])
  const [chartData, setChartData] = useState([])
  const indexColumn = useRecoilValue(indexColumnStore)

  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (selectedDataset[0] !== '' && selectedFile[0] !== '') fetchTaglistData()
    else {
      alert('파일이 선택되지 않았습니다.')
      setActiveStep(0)
    }
  }, [])

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
                setTagList(response.data)
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
    setChecked(param)
  }

  const fetchTaglistData = () => {
    // console.log('selectedDataset:', selectedDataset)
    // console.log('selectedFile:', selectedFile)

    const param = [
      {
        id: selectedDataset[0],
        file_name: selectedFile[0],
      },
    ]

    // console.log('param：', param)

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag', param)
      .then((response) => {
        // console.log('fetchTaglistData:', response.data)
        setVariableList(response.data)

        const values = response.data[0].options
        const valueArr: Array<any> = values.map((item: any) => item.value)

        const result: Array<any> = []
        valueArr.forEach((value: any) => {
          result.push({ value: value, used: false })
        })

        setUsedVariable(result)
      })
      .catch((error) => alert('TagData Load Failed::'))
  }

  const onTagClicked = (tags: any) => {
    // console.log('tag clicked:', tags)
    // console.log('전체 taglist::', tagList)

    const tempArr = []
    for (let i = 0; i < tags.length; i++) {
      const selectedData = tagList.filter((tag: any) => tag.name === tags[i])
      // console.log('selectedData:', selectedData)
      tempArr.push(selectedData[0])
    }
    // console.log('tempArr:', tempArr)
    setChartData(tempArr)
    // tagList.filter((item: any) => tagList.includes(item.name))
    // setSelectedTag(params)
  }

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
                type="TARGET_VARIABLE"
                title="타겟변수(Y)"
              />
            </div>
          </Col>
          <Col span="6">
            <div style={{ marginTop: '20px' }}>
              {' '}
              <NewTagSelect
                style={{ width: '70%', margin: 'auto', minWidth: '150px' }}
                selectionType="multiple"
                type="EXPLANATORY_VARIABLE"
                title="원인변수(X)"
              />
            </div>
          </Col>
          <Col span="6">
            <div style={{ marginTop: '20px' }}>
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
            </div>
          </Col>
        </Row>
        <Row justify="space-evenly" align="top"></Row>
        <div style={{ width: '100%', float: 'right' }}>
          <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
            {loading ? <CircularProgress /> : <Button onClick={handleClick}>SAVE</Button>}
          </Box>
        </div>
      </Box>
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
        {/* <Row style={{ width: '100%', height: '650px' }}>
          <div style={{ width: '20%' }}>
            <TagList data={tagList} syncSelectedTag={onTagClicked} />
          </div>
          <div style={{ width: '80%', backgroundColor: 'lightgrey' }}>
            multi chart 테스트중 <Worksheet selectedTags={chartData} />
          </div>
        </Row> */}
        {/* <Row>
          <Box style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
            <Button variant="contained" onClick={handleNext}>
              NEXT
            </Button>
          </Box>
        </Row> */}
      </Box>
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
    </>
  )
}

export default VariableSelection
