import React, { useState, useEffect } from 'react'
import { Modal, App, Spin } from 'antd'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import { dataPropertyState, uploadedDataState, userInfoState } from 'views/DataAnalysis/store/dataset/atom'
import styled from '@emotion/styled'
import DatasetApi from 'apis/DatasetApi'
import { useMutation, useQueryClient } from 'react-query'
import BeforeUpload from './BeforeUpload'
import AfterUpload from './AfterUpload'
import logo_xs from 'assets/img/ineeji/logo_xs.svg'

const DataImportModal = (props: any) => {
  const { message } = App.useApp()
  const userInfo = useRecoilValue(userInfoState)
  const queryClient = useQueryClient()

  const [saving, setSaving] = useState(false)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const resetUploadFileState = useResetRecoilState(uploadedDataState)
  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)
  const inputOption = useRecoilValue(dataPropertyState)

  const [btnDisabled, setBtnDisabled] = useState(true)

  const { mutate } = useMutation(DatasetApi.saveDataset, {
    onSuccess: (response: any) => {
      message.success(response.message)
      //refetching
      queryClient.invalidateQueries('datasets')
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
    // console.log('inputOption::', inputOption)
    if (inputOption && inputOption.date_col != '' && inputOption.target_y !== '') {
      setBtnDisabled(false)
    }
  }, [inputOption])

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
      if (dataFile) {
        const formData = new FormData()

        formData.append('com_id', userInfo.com_id)
        formData.append('date_col', inputOption.date_col)
        formData.append('target_y', inputOption.target_y)
        formData.append('name', inputOption.name)
        formData.append('desc', inputOption.desc.length === 0 ? null : inputOption.desc)

        // key/value 쌍이 담긴 리스트
        // for (const [name, value] of formData) {
        //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
        // }

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
          // setSummaryFetch('requested')
          setSaving(true)

          const user_id = localStorage.getItem('userId').toString()
          mutate({ user_id, formData })
        }
      }
    }
  }

  const handleCancel = () => {
    setImportOpen(false)
  }

  return (
    <>
      <Modal
        className="rounded-corners"
        width="400px"
        open={importOpen}
        title={
          <>
            <img style={{ margin: '10px 0 5px 0' }} src={logo_xs} />
            <p style={{ fontSize: '30px' }}>Data Import</p>
          </>
        }
        footer={null}
        onCancel={handleCancel}
      >
        <Spin tip="데이터 업로드 중 ..." spinning={saving}>
          {!uploadedData.file ? <BeforeUpload /> : <AfterUpload />}
          <div>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <UploadButton
              // className="block ant-btn ant-btn-primary"
              disabled={btnDisabled}
              onClick={handleSave}
            >
              Save
            </UploadButton>
          </div>
        </Spin>
      </Modal>
    </>
  )
}

export default DataImportModal

// const Button = styled.button`
//   width: 100%;
//   height: 46px;
// `

const UploadButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  height: 46px;
  background-color: ${(props: any) => (props.disabled ? '#C3CADB' : '#4338f7')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 15px;
`

const CancelButton = styled.button`
  block;
  m-auto;
  width: 100%;
  height: 46px;
  background-color: #ffffff;
  border-radius: 10px;
  color: #002d65;
  font-size: 13px;
`
