import React, { useState, useEffect } from 'react'
import { Button, Col, Input, Modal, Row, Typography, message } from 'antd'
import { useRecoilState } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import Uploader from 'components/uploader/Uploader'
import axios from 'axios'
import DataSummary from './DataSummary'
import DataProperties from './DataProperties'
import { optionListState, uploadDataAtom, uploadFileInfoAtom } from 'views/DataAnalysis/store/base/atom'
import { dateTimeToString } from 'common/DateFunction'

const DataImportModal = (props: any) => {
  const [inputOption, setInputOption] = useRecoilState(optionListState)

  const [uploadData, setUploadData] = useRecoilState(uploadDataAtom)
  const [uploadFileInfo, setUploadFileInfo] = useRecoilState(uploadFileInfoAtom)

  const [dataFile, setDataFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)

  useEffect(() => {
    if (!importOpen) {
      //선택 초기화
      clearSelectedFile()
    }
  }, [importOpen])

  const handleSelectedFile = (file: any) => {
    setDataFile(file)
    if (file) {
      if (file.size <= 10485760) {
        readFile(file)
        setUploadFileInfo(file)
      } else {
        messageApi.open({
          type: 'error',
          content: '업로드 가능 파일용량 초과(최대 10MB)',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  const clearSelectedFile = () => {
    setUploadData([])
    setUploadFileInfo({ name: '', size: 0, type: '' })
  }

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
        messageApi.open({
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
    setUploadData(array)
    // console.log('array:', array)
  }

  const handleSave = () => {
    // console.log('dataFile::', dataFile)

    if (dataFile && dataFile.size > 10485760) {
      messageApi.open({
        type: 'error',
        content: '10MB 이상의 파일은 업로드 할 수 없습니다.',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
    } else {
      const url = process.env.REACT_APP_API_SERVER_URL + '/api/upload'
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      if (dataFile) {
        const formData = new FormData()
        const uploadFile = dataFile

        formData.append('user_id', localStorage.getItem('userId'))
        formData.append('com_id', localStorage.getItem('companyId'))
        formData.append('name', inputOption.name)
        formData.append('date_col', inputOption.date_col)
        formData.append('files', uploadFile)
        formData.append('desc', inputOption.desc.length === 0 ? null : inputOption.desc)

        // for (const [name, value] of formData) {
        //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
        // }

        if (inputOption.date_col.length === 0) {
          messageApi.open({
            type: 'error',
            content: 'Timestamp column is not selected.',
            duration: 5,
            style: {
              margin: 'auto',
            },
          })
        } else {
          setSaving(true)

          axios
            .post(url, formData, config)
            .then((response) => {
              if (response.status === 200) {
                setSaving(false)
                messageApi.open({
                  type: 'success',
                  content: '저장 완료!',
                  duration: 1,
                  style: {
                    margin: 'auto',
                  },
                })
                setImportOpen(false)
              }
            })
            .catch((error) => {
              messageApi.open({
                type: 'error',
                content: error,
                duration: 5,
                style: {
                  margin: 'auto',
                },
              })
              setSaving(false)
              setImportOpen(false)
            })
        }
      }
    }
  }

  const handleCancel = () => {
    setImportOpen(false)
  }

  const handleCancelClick = () => {
    // console.log('param:', param)
    clearSelectedFile()
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
            <Button
              type="default"
              onClick={handleCancel}
              style={{ width: '100px', height: '30px', borderRadius: '10px', marginRight: '10px' }}
            >
              CANCEL
            </Button>
            <Button
              type="primary"
              loading={saving}
              onClick={handleSave}
              style={{ width: '100px', height: '30px', borderRadius: '10px' }}
            >
              Ok
            </Button>
          </div>
        </div>
      </Modal>
      {contextHolder}
    </>
  )
}

export default DataImportModal
