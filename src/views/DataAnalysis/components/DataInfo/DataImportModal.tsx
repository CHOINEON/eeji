import React, { useState, useEffect } from 'react'
import { Button, Input, Modal, message } from 'antd'
import { useRecoilState } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import Uploader from 'components/uploader/Uploader'
import axios from 'axios'
import DataSummary from './DataSummary'

const DataImportModal = (props: any) => {
  const [dataFile, setDataFile] = useState(null)
  const [dataName, setDataName] = useState(null)
  const [saving, setSaving] = useState(false)
  const [defaultValue, setDefaultValue] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)

  useEffect(() => {
    if (!importOpen) {
      //선택 초기화
      setDataFile(null)
      setDataName(null)
    }
  }, [importOpen])

  const handleSelectedFile = (param: any) => {
    setDataFile(param)
    setDataName(param.name)
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
        setSaving(true)

        const formData = new FormData()
        const uploadFile = dataFile

        formData.append('com_id', localStorage.getItem('companyId'))
        formData.append('user_id', localStorage.getItem('userId'))
        formData.append('name', dataName)
        formData.append('files', uploadFile)

        setDefaultValue(uploadFile.name)

        // for (const [name, value] of formData) {
        //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
        // }

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
              duration: 1,
              style: {
                margin: 'auto',
              },
            })
            setSaving(false)
            setImportOpen(false)
          })
      } else {
        messageApi.open({
          type: 'error',
          content: '업로드할 파일이 없습니다.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  const handleCancel = () => {
    setImportOpen(false)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('Change:', e.target.value)
    setDataName(e.target.value)
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
        <Uploader onSelectedFile={handleSelectedFile} />
        <DataSummary file={dataFile} />
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <div style={{ width: '60%', display: 'inline-block' }}>
            <span> Dataset Name : </span>
            <Input style={{ width: '300px' }} maxLength={20} onChange={onChange} value={dataName} />
          </div>
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
