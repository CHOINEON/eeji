import React, { useState, useEffect } from 'react'
import { Button, Col, Input, Modal, Row, Typography, message, App } from 'antd'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import Uploader from 'components/uploader/Uploader'
import DataSummary from './DataSummary'
import DataProperties from './DataProperties'
import {
  dataPropertyState,
  summaryFetchState,
  // uploadFileInfoAtom,
  uploadedDataState,
  userInfoState,
} from 'views/DataAnalysis/store/base/atom'
import styled from '@emotion/styled'
import DatasetApi from 'apis/DatasetApi'
import { useMutation } from 'react-query'

const DataImportModal = (props: any) => {
  const userInfo = useRecoilValue(userInfoState)
  const [summaryFetch, setSummaryFetch] = useRecoilState(summaryFetchState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const resetUploadFileState = useResetRecoilState(uploadedDataState)
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)
  const inputOption = useRecoilValue(dataPropertyState)

  const [dataArray, setDataArray] = useState([])
  const [buttonVisible, setButtonVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const { message } = App.useApp()
  const { mutate } = useMutation(DatasetApi.saveDataset, {
    onSuccess: (response: any) => {
      message.success(response.message)
      setImportOpen(false)
    },
    onError: (error: any, query: any) => {
      message.error(error)
      // console.error(error)
    },
  })

  useEffect(() => {
    if (!importOpen) {
      //선택 초기화
      resetUploadFileState()
    }
  }, [importOpen])

  useEffect(() => {
    if (inputOption && inputOption.date_col != '') setButtonVisible(true)
  }, [inputOption])

  const handleSelectedFile = (file: any) => {
    // console.log('selected:', file)
    if (file) {
      if (file.size <= 209715200) {
        readFile(file)
        setUploadedData({ ...uploadedData, file: file, name: file.name, content: [] })
      } else {
        message.open({
          type: 'error',
          content: '업로드 가능 파일용량 초과(최대 200MB)',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  useEffect(() => {
    setUploadedData({ ...uploadedData, content: dataArray })
  }, [dataArray])

  const readFile = (file: any) => {
    // console.log('readfile:', file)
    // console.log('type:', file.name.split('.', 2)[1])

    const fileReader = new FileReader()

    const fileFormat = file.name.split('.', 2)[1]
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file) {
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result
          csvFileToArray(file.name, file.size, text)
        }

        fileReader.readAsText(file)
      } else {
        message.open({
          type: 'error',
          content: '지원하지 않는 파일 유형입니다.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  const csvFileToArray = (name: string, size: number, string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    const array = csvRows.map((item) => {
      if (item != '') {
        const values = item.split(',')
        const obj = csvHeader.reduce((object: any, header, index) => {
          object[header] = values[index]
          return object
        }, {})
        return obj
      }
    })

    array.splice(array.length - 1) //split하면서 마지막 행에 빈 값 들어있어서 자름
    setDataArray(array)
    // setUploadedData({ ...uploadedData, content: array })
    // console.log('array:', array)
  }

  const handleSave = () => {
    const dataFile = uploadedData.file
    // console.log('dataFile::', dataFile)

    if (dataFile && dataFile.size > 209715200) {
      message.open({
        type: 'error',
        content: '200MB 이상의 파일은 업로드 할 수 없습니다.',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
    } else {
      const url = process.env.REACT_APP_NEW_API_SERVER_URL + `/api/save/${userInfo.user_id}?user_id=${userInfo.user_id}`
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
      if (dataFile) {
        const formData = new FormData()

        formData.append('com_id', userInfo.com_id)
        formData.append('date_col', inputOption.date_col)
        formData.append('name', inputOption.name)
        formData.append('desc', inputOption.desc.length === 0 ? null : inputOption.desc)

        if (inputOption.date_col.length === 0) {
          message.open({
            type: 'error',
            content: 'Timestamp column is not selected.',
            duration: 5,
            style: {
              margin: 'auto',
            },
          })
        } else {
          setSummaryFetch('requested')
          // setSaving(true)

          const user_id = localStorage.getItem('userId').toString()
          mutate({ user_id, formData })

          // axios
          //   .post(url, formData, config)
          //   .then((response) => {
          //     if (response.status === 200) {
          //       setSummaryFetch('completed')
          //       // setSaving(false)
          //       console.log('response:', response.data['1'])
          //       // saveDataSummary(response.data['1'])
          //       messageApi.open({
          //         type: 'success',
          //         content: '저장 완료!',
          //         duration: 1,
          //         style: {
          //           margin: 'auto',
          //         },
          //       })
          //       setImportOpen(false)
          //     }
          //   })
          //   .catch((error) => {
          //     setSummaryFetch('failed')

          //     messageApi.open({
          //       type: 'error',
          //       content: error,
          //       duration: 5,
          //       style: {
          //         margin: 'auto',
          //       },
          //     })
          //     // setSaving(false)
          //     setImportOpen(false)
          //   })
        }
      }
    }
  }

  const handleCancel = () => {
    setImportOpen(false)
  }

  const handleCancelClick = () => {
    // console.log('param:', param)
    resetUploadFileState()
  }

  return (
    <>
      <Modal
        className="rounded-corners"
        width="700px"
        open={importOpen}
        title="Data Import"
        footer={null}
        onCancel={handleCancel}
      >
        <Uploader onSelectedFile={handleSelectedFile} onCancelClick={handleCancelClick} />

        <DataProperties />
        <DataSummary />
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <div style={{ width: '40%', display: 'inline-block' }}>
            {/* <Button
              type="default"
              onClick={handleCancel}
              style={{ width: '100px', height: '30px', borderRadius: '10px', marginRight: '10px' }}
            >
              CANCEL
            </Button> */}
            <UploadButton
              className="custom-btn custom-btn-primary"
              // type="primary"
              // loading={saving}
              visible={buttonVisible}
              onClick={handleSave}
            >
              Upload
            </UploadButton>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DataImportModal

const UploadButton = styled.button<{ visible: boolean }>`
  width: 100%;
  height: 30px;
  display: ${(props: any) => (props.visible ? 'block' : 'none')};
`
