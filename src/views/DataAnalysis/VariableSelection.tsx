import React, { useState } from 'react'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import TagSelectList from './components/TagTree/TagSelectList'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { indexColumnStore, selectedVarStoreX, selectedVarStoreY, stepCountStore } from './atom'
import { Col, Row, DatePicker, Select, Space, Divider, Input, Modal } from 'antd'
import NewTagSelect from './components/TagTree/NewTagSelect'

const VariableSelection = () => {
  const setActiveStep = useSetRecoilState(stepCountStore)
  const [loading, setLoading] = useState(false)

  const [selectedVarX, setSelectedVarX] = useRecoilState(selectedVarStoreX)
  const [selectedVarY, setSelectedVarY] = useRecoilState(selectedVarStoreY)

  const indexColumn = useRecoilValue(indexColumnStore)

  const [selectedArr, setSelectedArr] = useState([])
  const [open, setOpen] = useState(false)

  const onSelectionChanged = (param: any) => {
    console.log('variable selection onSelectionChanged----')
    console.log('param: ', param)
    if (param.type === 'TARGET_VARIABLE') setSelectedArr(param)
  }

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

    const Object: any = {
      com_id: localStorage.getItem('companyId'),
      cause: selectedVarX,
      target: selectedVarY[0],
    }
    console.log('Object:', Object)

    if (indexColumn !== '') {
      Object['data_index'] = indexColumn
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
            setLoading(false)
            setActiveStep(2)
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
        className="rounded-box"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 3,
            width: '100%',
            // height: 100,
          },
        }}
      >
        <Divider orientation="left">Variables</Divider>
        <Row justify="space-evenly" align="top">
          <Col span="8">
            <NewTagSelect
              style={{ width: '60%', margin: 'auto', minWidth: '150px' }}
              selectionType=""
              type="TARGET_VARIABLE"
              title="타겟변수(Y)"
              onSelectionChanged={onSelectionChanged}
            />
          </Col>
          <Col span="8">
            <NewTagSelect
              style={{ width: '60%', margin: 'auto', minWidth: '150px' }}
              selectionType="multiple"
              type="EXPLANATORY_VARIABLE"
              title="원인변수(X)"
              // onSelectionChanged={onSelectionChanged}
              defaultValue={selectedArr}
            />
          </Col>
          <Col span="8">
            <div style={{ width: '60%', margin: 'auto', minWidth: '150px' }}>
              {/* <Typography variant="subtitle1" gutterBottom marginLeft={1}>
                인덱스 컬럼명
              </Typography> */}
              <NewTagSelect
                style={{ width: '60%', margin: 'auto', minWidth: '150px' }}
                selectionType=""
                type="INDEX_COLUMN"
                title="인덱스 컬럼명"
                // onSelectionChanged={onSelectionChanged}
              />
              {/* <Input defaultValue="" onChange={handleChange} /> */}
            </div>
          </Col>
        </Row>
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
        <p>X : {selectedVarX.length > 0 && selectedVarX[0].variable.join(' / ')}</p>
        <p>Y : {selectedVarY.length > 0 && selectedVarY[0].variable.join(' / ')}</p>
        <p>INDEX : {indexColumn === '' ? '없음' : indexColumn}</p>
      </Modal>
      {/* </VariableProvider> */}
    </>
  )
}

export default VariableSelection
