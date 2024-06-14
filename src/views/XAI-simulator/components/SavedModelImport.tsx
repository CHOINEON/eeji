import { App, Empty, Spin } from 'antd'
import XaiApi from 'apis/XaiApi'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { SavedModelListState } from 'store/model/atom'
import { modalState } from 'stores/modal'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/Modal/DataImportModal'
import { xaiResultStore } from '../store/analyze/atom'
import { transformDataByRow } from '../XaiAnalysisResult'
import ModelList from './ModelSelect/ModelList'

const SavedModelImport = () => {
  const { message } = App.useApp()
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)

  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [modelId, setModelId] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [data, setData] = useRecoilState(SavedModelListState)

  const { mutate: mutateGetModelList } = useMutation(XaiApi.getSavedModelList, {
    onSuccess: (result: any) => {
      setData(result.data)
    },
    onError: (error: AxiosError) => {
      console.error(error.message)
    },
  })

  const { mutate: mutatePostResult } = useMutation(XaiApi.postModelForXaiResult, {
    onSuccess: (result: any) => {
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
    onError: (error: AxiosError) => {
      setSaving(false)
      message.error(error?.message)
    },
  })

  useEffect(() => {
    const param = {
      user_id: localStorage.getItem('userId'),
    }
    mutateGetModelList(param)
  }, [])

  const handleRunModel = () => {
    fetchGetResult(modelId)
  }

  const fetchGetResult = (uuid: string) => {
    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: uuid,
    }

    if (uuid) {
      setSaving(true)
      mutatePostResult(payload)
    } else {
      message.error('불러올 모델을 선택해주세요.')
    }
  }

  const handleSelect = (model_id: string) => {
    setModelId(model_id)
  }

  return (
    <>
      <Spin tip="모델 분석중..." spinning={saving}>
        <div>{data?.length > 0 ? <ModelList data={data} onSelect={handleSelect} /> : <Empty />}</div>
        <div className="mt-[25px]">
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <CustomButton visible={true} disabled={false} onClick={handleRunModel}>
            Run
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default SavedModelImport
