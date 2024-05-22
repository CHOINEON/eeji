import styled from '@emotion/styled'
import { App } from 'antd'
import { axiosProgress } from 'apis/axios'
import useAxiosInterceptor from 'hooks/useAxiosInterceptor'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { dataPropertyState, uploadedDataState, userInfoState } from 'views/AIModelGenerator/store/dataset/atom'
import AfterUpload from '../DataInfo/AfterUpload'
import BeforeUpload from '../DataInfo/BeforeUpload'

const DataImportModal = (props: any) => {
  const { message } = App.useApp()
  const [modal, setModal] = useRecoilState(modalState)

  const userInfo = useRecoilValue(userInfoState)
  const inputOption = useRecoilValue(dataPropertyState)
  const progress = useRecoilValue(ProgressState)

  const queryClient = useQueryClient()

  const [saving, setSaving] = useState(false)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const resetInputOption = useResetRecoilState(dataPropertyState)
  const resetUploadedData = useResetRecoilState(uploadedDataState)
  const [btnDisabled, setBtnDisabled] = useState(true)

  useAxiosInterceptor(axiosProgress)

  const fetchData = async (payload: any) => {
    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }

    const { data } = await axiosProgress.post(
      `/api/save_new/${payload.user_id}?user_id=${payload.user_id}`,
      payload.formData,
      config
    )
    return data
  }

  const { mutate } = useMutation(fetchData, {
    onSuccess: (response: any) => {
      message.success('데이터를 성공적으로 저장했습니다.')
      //refetching
      queryClient.invalidateQueries('datasets')
    },
    onError: (error: any, query: any) => {
      message.error(error)
    },
  })

  useEffect(() => {
    if (progress.isLoading === true) setBtnDisabled(true)
  }, [progress.isLoading])

  useEffect(() => {
    return () => {
      //선택 초기화
      resetUploadedData()
      resetInputOption()
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    if (inputOption.target_y.length > 0) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [inputOption.target_y])

  const handleSave = () => {
    const dataFile = uploadedData.file
    if (dataFile && dataFile.size > 33554432) {
      message.open({
        type: 'error',
        content: '데이터가 너무 큽니다(최대 32MB)',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
    } else {
      if (dataFile) {
        const formData = new FormData()

        formData.append('com_id', userInfo.com_id)
        formData.append('date_col', inputOption.date_col ? inputOption.date_col : 'undefined')
        formData.append('target_y', inputOption.target_y)
        formData.append('name', inputOption.name)
        formData.append('desc', inputOption.desc ? inputOption.desc : null)
        formData.append('is_classification', inputOption.algo_type.toString())

        if (inputOption.target_y.length === 0) {
          message.open({
            type: 'error',
            content: 'Target variable is not selected.',
            duration: 5,
            style: {
              margin: 'auto',
            },
          })
        } else {
          setSaving(true)

          const user_id = localStorage.getItem('userId').toString()
          mutate({ user_id, formData })
        }
      }
    }
  }

  const handleCancel = () => {
    setSaving(false)
    resetUploadedData()
    setModal(null)
  }

  const handleUploadComplete = () => {
    setModal(null)
  }

  return (
    <>
      {!uploadedData.file ? <BeforeUpload /> : <AfterUpload onUploadSuccess={handleUploadComplete} />}
      <div>
        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        <CustomButton visible={true} disabled={btnDisabled} onClick={handleSave}>
          Save
        </CustomButton>
      </div>
    </>
  )
}

export default DataImportModal

export const CustomButton = styled.button<{ disabled?: boolean; visible?: boolean }>`
  width: 100%;
  height: 46px;
  background-color: ${(props: any) => (props.disabled ? '#C3CADB' : '#4338f7')};
  display: ${(props: any) => (props.visible ? 'block' : 'none')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 15px;
  font-face: 'Helvetica Neue';
`

export const CancelButton = styled.button`
  block;
  m-auto;
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background-color: #ffffff;
  color: #002d65;
  font-size: 13px;
`
