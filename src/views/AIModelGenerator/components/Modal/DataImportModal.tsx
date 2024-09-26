import styled from '@emotion/styled'
import { App, Button } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import { UploadStateType } from 'apis/type/Dataset'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { dataPropertyState, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { fileUploadState } from 'views/AIModelGenerator/store/upload/atom'
import AfterUpload from '../DataInfo/AfterUpload'
import BeforeUpload from '../DataInfo/BeforeUpload'

type inputValuesType = {
  data_name: string
  is_classification: boolean
  target_y: string
  data_desc: string
  date_column: string
}

const DataImportModal = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const inputOption = useRecoilValue(dataPropertyState)
  const progress = useRecoilValue(ProgressState)
  const uploadedData = useRecoilValue(uploadedDataState)

  const setModal = useSetRecoilState(modalState)
  const setEnabled = useSetRecoilState(fileUploadState)
  const resetInputOption = useResetRecoilState(dataPropertyState)
  const resetUploadedData = useResetRecoilState(uploadedDataState)

  const [btnDisabled, setBtnDisabled] = useState(true)
  const [saving, setSaving] = useState(false)

  const { mutateAsync: getSignedUrl } = useMutation(DatasetApi.getSignedUrl, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {
      message.error(error)
    },
  })

  const { mutateAsync: uploadFile } = useMutation(DatasetApi.uploadFileToGcs, {
    onSuccess: async (response: any) => {
      await notifyBackend('success')

      const inputValues: inputValuesType = {
        data_name: inputOption.name,
        is_classification: Boolean(inputOption.algo_type),
        target_y: inputOption.target_y,
        data_desc: inputOption.desc,
        date_column: inputOption.date_col,
      }

      //모델 생성에 필요한 데이터 백엔드에 저장
      saveMetaData({ object_name: uploadedData.objectName, data: inputValues })
    },
    onError: (error: Error) => {
      message.error(error.message)
      notifyBackend('fail')
    },
  })

  const { mutateAsync: notifyState } = useMutation(DatasetApi.notifyWithState, {
    onSuccess: (response: any) => {},
    onError: (error: Error) => {
      message.error(error?.message)
    },
  })

  const { mutateAsync: saveMetaData } = useMutation(DatasetApi.saveModelData, {
    onSuccess: (response: any) => {
      message.success(t('Successfully saved'))

      setSaving(false)
      setModal(null)

      queryClient.invalidateQueries('datasets')
    },
    onError: (error: any) => {
      notifyBackend('fail')

      message.error(error.detail)
      setSaving(false)
    },
  })

  useEffect(() => {
    return () => {
      resetUploadedData()
      resetInputOption()
    }
  }, [])

  useEffect(() => {
    if (progress.isLoading === true) setBtnDisabled(true)
  }, [progress.isLoading])

  useEffect(() => {
    if (inputOption.target_y.length > 0) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [inputOption.target_y])

  const handleSave = async () => {
    const dataFile = uploadedData.file
    if (dataFile && dataFile.size > Number(process.env.REACT_APP_MAX_FILE_SIZE)) {
      message.open({
        type: 'error',
        // content: '데이터가 너무 큽니다(최대 400MB)',

        content: t('The data is too large (maximum 400MB)'),
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
      setEnabled(false)
    } else {
      if (dataFile) {
        setSaving(true)

        //signedURL을 정상적으로 발급 -> notify start -> GCS upload -> notify success -> save data
        //https://app.diagrams.net/#G1C7afvT0Z81_2GEPRH58ohi4QWQsuGRM5
        const getUrlResult = await getSignedUrl({ object_name: uploadedData.objectName })
        const startResult = await notifyBackend('start')

        try {
          if (getUrlResult.signed_url.length > 0 && startResult.data.message === 'success') {
            uploadFile({ signedUrl: getUrlResult.signed_url, file: dataFile })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  // Call notify API when GCS upload request got response
  const notifyBackend = async (state: UploadStateType) => {
    return await notifyState({
      object_name: uploadedData.objectName,
      object_size: uploadedData.file.size,
      status: state,
    })
  }

  const handleCancel = () => {
    resetUploadedData()
    setModal(null)
  }

  return (
    <>
      {!uploadedData.file ? <BeforeUpload /> : <AfterUpload />}
      <div>
        <CancelButton onClick={handleCancel}>{t('Cancel')}</CancelButton>
        <CustomButton type="primary" disabled={btnDisabled} onClick={handleSave} loading={saving}>
          {t('Save')}
        </CustomButton>
      </div>
    </>
  )
}

export default DataImportModal

export const CustomButton = styled(Button)<{ disabled?: boolean }>`
  width: 100%;
  height: 46px;
  background-color: ${(props: any) => (props.disabled ? '#C3CADB' : '#4338f7')};
  border-radius: 10px;
  color: ${(props: any) => (props.disabled ? 'black' : 'red')}
  font-size: 13px;
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
