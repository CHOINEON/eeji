import { message, Spin } from 'antd'
import ModelApi from 'apis/ModelApi'
import XaiApi from 'apis/XaiApi'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { CancelButton, CustomButton } from 'views/AIModelGenerator/components/Modal/DataImportModal'
import { customModelStore, xaiResultStore } from 'views/XAI-simulator/store/analyze/atom'
import { transformDataByRow } from '../XaiAnalysisResult'
import ColumnList from './ModelSelect/ColumnList'
import ModelTypeRadio from './ModelSelect/ModelTypeRadio'
import ModelUpload from './ModelSelect/Upload'

interface IDataObj {
  type: string
  model: File
  script: File
  data: File
  column: File
}

const UserModelImport = () => {
  const { t } = useTranslation()
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const resetModelUploadResult = useResetRecoilState(customModelStore)
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const [modelUploadResult, setModelUploadResult] = useRecoilState(customModelStore)

  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<IDataObj>() //upload(step1) 요청 시 필요한 데이터
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(true)
  const [haveColumn, setHaveColumn] = useState(false)

  const { mutate: mutateUserModelUpload } = useMutation(XaiApi.uploadModelwithData, {
    onSuccess: (response: any) => {
      setModelUploadResult({ ...modelUploadResult, uuid: response.uuid, variable_list: response['variable_list'] })
      setSaving(false)
    },
    onError: (error: AxiosError) => {
      setSaving(false)
      message.error(error.message)
    },
  })

  const { mutate: mutatePostResult } = useMutation(XaiApi.postModelForXaiResult, {
    onSuccess: (result: any) => {
      message.open({
        type: 'success',
        content: t('Successfully saved'),
        duration: 1,
        style: {
          margin: 'auto',
        },
      })

      setXaiResult({
        ...xaiResult,
        sample_size: result['sample_size'],
        feature_length: result['feature_length'],
        feature_list: result['feature_list'],
        predict_result: result['predict_result'],
        input_data: transformDataByRow(result['sample_size'], result['input_data']),
        xai_local: transformDataByRow(result['sample_size'], result['xai_local']),
        xai_global: result['xai_global'][0], //gcs에 저장된 위치 result('xai_global')
        xai_pdp: result['xai_pdp'],
        colors: STACKED_BAR_CHART_COLORS,
      })
      setSaving(false)
      setModal(null)
    },
    onError: (error: AxiosError) => {
      setSaving(false)
      message.error(error.message)
    },
  })

  const { mutate: mutateSave } = useMutation(ModelApi.saveModelwithColumns, {
    onSuccess: (response: any) => {
      //결과 데이터 받아오기 위해 다시 요청
      const payload = {
        user_id: user_id,
        com_id: com_id,
        uuid: response.uuid,
      }
      mutatePostResult(payload)
    },
    onError: (error: AxiosError) => {
      message.error(error.message)
      setSaving(false)
    },
  })

  useEffect(() => clearSelectedFile('torch'), [])

  useEffect(() => {
    if (!data?.model || !data?.data) {
      setIsDisabled(true) //버튼 활성화
    } else {
      setIsDisabled(false)
    }
  }, [data, haveColumn])

  const handleChangeScript = (param: File) => {
    setData({ ...data, script: param })
  }
  const handleChangeModel = (param: File) => {
    setData({ ...data, model: param })
  }
  const handleChangeData = (param: File) => {
    setData({ ...data, data: param })
  }
  const handleChangeColumn = (param: File) => {
    setData({ ...data, column: param })
  }
  const handleChangeType = (param: string) => {
    clearSelectedFile(param)
  }

  const clearSelectedFile = (selectedType: string) => {
    setData({ ...data, type: selectedType, model: undefined, data: undefined, column: undefined, script: undefined })
    resetModelUploadResult()
  }

  const handleSelectColumn = (param: Array<string>) => {
    setModelUploadResult({ ...modelUploadResult, selected_var: param })
  }

  const handleUpload = () => {
    setSaving(true)

    if (data?.model && data?.data) {
      const formData = new FormData()

      formData.append('structure', data.type === 'torch' ? data.script : '') //torch인 경우만 선택
      formData.append('weight', data.model)
      formData.append('input_data', data.data)
      formData.append('model_type', !data.type ? 'torch' : data.type)
      formData.append('columns', data.column || '') //빈값인 경우 공백으로 보내기

      mutateUserModelUpload({ user_id, formData })
    }
  }

  const handleSave = () => {
    setSaving(true)
    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: modelUploadResult.uuid,
      x_value: modelUploadResult.selected_var,
    }

    mutateSave({ user_id, payload })
  }

  return (
    <>
      <Spin tip={t('uploading').concat('...')} spinning={saving}>
        <div>
          <ModelTypeRadio onChange={handleChangeType} />
          <ModelUpload
            hidden={data?.type !== 'torch'}
            required={true}
            label={t('Model script file')}
            onChange={handleChangeScript}
            selectedFile={data?.script?.name}
          />
          <ModelUpload
            required={true}
            label={t('Prediction model file')}
            onChange={handleChangeModel}
            selectedFile={data?.model?.name}
          />
          <ModelUpload required={true} label={t('Data')} onChange={handleChangeData} selectedFile={data?.data?.name} />
          <ModelUpload
            required={false}
            label={t('Column(Optional)')}
            onChange={handleChangeColumn}
            selectedFile={data?.column?.name}
          />
        </div>
        {modelUploadResult.uuid.length > 0 && modelUploadResult?.variable_list?.length == 0 ? (
          <div className="text-center mt-5">{t('No columns to check. Please click save to proceed')}</div>
        ) : (
          <div
            style={{
              width: '100%',
              height: 200,
              overflow: 'auto',
              display: modelUploadResult?.variable_list?.length > 0 ? 'block' : 'none',
            }}
          >
            <ColumnList data={modelUploadResult?.variable_list} onSelect={handleSelectColumn} />
          </div>
        )}

        <div style={{ margin: '25px 0' }}>
          <CancelButton onClick={() => setModal(null)}>{t('Cancel')}</CancelButton>
          {modelUploadResult?.uuid ? (
            <CustomButton onClick={handleSave}>{t('Model Save')}</CustomButton>
          ) : (
            <CustomButton disabled={isDisabled} onClick={handleUpload}>
              {t('Upload')}
            </CustomButton>
          )}
        </div>
      </Spin>
    </>
  )
}

export default UserModelImport
