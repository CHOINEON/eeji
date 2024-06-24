import styled from '@emotion/styled'
import { App } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import { axiosProgress } from 'apis/axios'
import { UploadStateType } from 'apis/type/Dataset'
import useAxiosInterceptor from 'hooks/useAxiosInterceptor'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { dataPropertyState, signedUrlState, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { fileUploadState } from 'views/AIModelGenerator/store/upload/atom'
import AfterUpload from '../DataInfo/AfterUpload'
import BeforeUpload from '../DataInfo/BeforeUpload'

const DataImportModal = () => {
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const inputOption = useRecoilValue(dataPropertyState)
  const progress = useRecoilValue(ProgressState)
  const signedUrl = useRecoilValue(signedUrlState)
  const uploadedData = useRecoilValue(uploadedDataState)

  const setModal = useSetRecoilState(modalState)
  const setEnabled = useSetRecoilState(fileUploadState)
  const resetInputOption = useResetRecoilState(dataPropertyState)
  const resetUploadedData = useResetRecoilState(uploadedDataState)

  const [btnDisabled, setBtnDisabled] = useState(true)

  useAxiosInterceptor(axiosProgress)

  const { mutate: mutateUpload } = useMutation(DatasetApi.uploadFileToGcs, {
    onSuccess: () => {
      message.success('데이터를 성공적으로 저장했습니다.')
      notifyBackend('success')
    },
    onError: (error: any, query: any) => {
      message.error(error)
      notifyBackend('fail')
    },
  })

  const { mutate: mutateNotify } = useMutation(DatasetApi.notifyWithState, {
    onSuccess: (response: any) => {
      queryClient.invalidateQueries('datasets')
    },
    onError: (error: any) => {
      message.error(error)
    },
  })

  useEffect(() => {
    if (progress.isLoading === true) setBtnDisabled(true)
  }, [progress.isLoading])

  useEffect(() => {
    return () => {
      resetUploadedData()
      resetInputOption()
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
    if (dataFile && dataFile.size > Number(process.env.REACT_APP_MAX_FILE_SIZE)) {
      message.open({
        type: 'error',
        content: '데이터가 너무 큽니다(최대 400MB)',
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
      setEnabled(false)
    } else {
      if (dataFile) {
        notifyBackend('start')
        mutateUpload({ signedUrl: signedUrl, dataFile })
      }
    }
  }

  const notifyBackend = (state: UploadStateType) => {
    // TODO: Call notify API when GCS upload request got response
    // Below is the metadata in Form to send
    const formData = new FormData()
    formData.append('com_id', localStorage.getItem('companyId'))
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
    }

    mutateNotify({ state: state, formData: formData })
  }

  const handleCancel = () => {
    resetUploadedData()
    setModal(null)
  }

  return (
    <>
      {!uploadedData.file ? <BeforeUpload /> : <AfterUpload />}
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
