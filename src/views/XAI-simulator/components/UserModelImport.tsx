import React, { useEffect, useState } from 'react'
import { message, Spin } from 'antd'
import ModelTypeRadio from './ModelSelect/ModelTypeRadio'
import ModelUpload from './ModelSelect/Upload'
import ModelApi from 'apis/ModelApi'
import { useMutation } from 'react-query'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/DataInfo/DataImportModal'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import ColumnList from './ModelSelect/ColumnList'
import { customModelStore, xaiResultStore } from 'views/XAI-simulator/store/analyze/atom'
import XaiApi from 'apis/XaiApi'
import { transformDataByRow } from '../XaiAnalysisResult'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'

interface IDataObj {
  model: any
  script: any
  data: any
  column: any
  type: any
}

interface IParamObj {
  uuid: string
  variable_list: Array<string>
  selected_var: Array<string>
}

const UserModelImport = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)

  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<IDataObj>() //upload(step1) 요청 시 필요한 데이터
  // const [response, setResponse] = useState<IParamObj>() //save(step2) 요청 시 필요한 파라메터
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(true)
  const [haveColumn, setHaveColumn] = useState(false)
  const [modelUploadResult, setModelUploadResult] = useRecoilState(customModelStore)

  const { mutate: mutateUpload } = useMutation(XaiApi.uploadModelwithData, {
    onSuccess: (response: any) => {
      console.log('mutateUpload;', response)

      setModelUploadResult({ ...modelUploadResult, uuid: response.uuid, variable_list: response['variable_list'] })
      setSaving(false)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })

  const { mutate: mutatePostResult } = useMutation(XaiApi.postModelForXaiResult, {
    onSuccess: (result: any) => {
      console.log('mutatePostResult:', result)

      setXaiResult({
        sample_size: result.sample_size,
        feature_length: result.feature_length,
        feature_list: result.feature_list,
        predict_result: result.predict_result?.predict_result,
        input_data: transformDataByRow(result.sample_size, result.input_data),
        xai_local: transformDataByRow(result.sample_size, result.xai_local),
        xai_global: result.xai_global,
        xai_pdp: result.xai_pdp,
        colors: STACKED_BAR_CHART_COLORS,
      })
      setSaving(false)
      setModal(null)
    },
    onError: (error: any, query: any) => {
      //
    },
  })
  const { mutate: mutateSave } = useMutation(ModelApi.saveModelwithColumns, {
    onSuccess: (response: any) => {
      // console.log('mutateSave;', response)
      message.open({
        type: 'success',
        content: response.message,
        duration: 1,
        style: {
          margin: 'auto',
        },
      })

      setSaving(false)

      //결과 데이터 받아오기 위해 다시 요청
      const payload = {
        user_id: user_id,
        com_id: com_id,
        uuid: response.uuid,
      }
      // console.log('payload:', payload)
      mutatePostResult(payload)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })

  useEffect(() => {
    setData({ ...data, type: 'pytorch', model: undefined, data: undefined, column: undefined, script: undefined })
  }, [])

  useEffect(() => {
    // console.log('useEffect:', data)
    // console.log('haveColumn:', haveColumn)

    if (!data?.model || !data?.data) {
      setIsDisabled(true) //버튼 활성화
    } else {
      setIsDisabled(false)
    }
  }, [data, haveColumn])

  const handleChangeScript = (param: any) => {
    // console.log('handle change:', param)
    setData({ ...data, script: param })
  }
  const handleChangeModel = (param: any) => {
    // console.log('handle change:', param)
    setData({ ...data, model: param })
  }
  const handleChangeData = (param: any) => {
    setData({ ...data, data: param })
  }
  const handleChangeColumn = (param: any) => {
    setData({ ...data, column: param })
  }
  const handleChangeType = (param: string) => {
    setData({ ...data, type: param })
  }

  const handleSelectColumn = (param: Array<any>) => {
    setModelUploadResult({ ...modelUploadResult, selected_var: param })
  }

  const handleUpload = () => {
    setSaving(true)

    if (data?.model && data?.data) {
      const formData = new FormData()

      formData.append('structure', data.script)
      formData.append('weight', data.model)
      formData.append('input_data', data.data)
      formData.append('model_type', !data.type ? 'pytorch' : data.type)
      formData.append('columns', data.column || '')

      mutateUpload({ user_id, formData })
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
      <Spin tip="업로드 중 ..." spinning={saving}>
        <div>
          <ModelTypeRadio onChange={handleChangeType} />
          <ModelUpload
            hidden={data?.type !== 'pytorch'}
            required={true}
            label="모델 스크립트 파일"
            onChange={handleChangeScript}
            selectedFile={data?.script?.name}
          />
          <ModelUpload
            required={true}
            label="예측모델 파일 업로드"
            onChange={handleChangeModel}
            selectedFile={data?.model?.name}
          />
          <ModelUpload
            required={true}
            label="분석할 데이터"
            onChange={handleChangeData}
            selectedFile={data?.data?.name}
          />
          <ModelUpload
            required={false}
            label="Column(Optional)"
            onChange={handleChangeColumn}
            selectedFile={data?.column?.name}
          />
        </div>
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
        <div style={{ margin: '25px 0' }}>
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <CustomButton visible={modelUploadResult?.uuid ? false : true} disabled={isDisabled} onClick={handleUpload}>
            Upload
          </CustomButton>
          <CustomButton visible={modelUploadResult?.uuid ? true : false} onClick={handleSave}>
            Model Save
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default UserModelImport
