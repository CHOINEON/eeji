import { App, Empty, Spin } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelInfo } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/Modal/DataImportModal'
import { xaiResultStore } from '../store/analyze/atom'
import { transformDataByRow } from '../XaiAnalysisResult'
import ModelList from './ModelSelect/ModelList'

const SavedModelImport = () => {
  const { message } = App.useApp()

  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const setModal = useSetRecoilState(modalState)

  const [modelId, setModelId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const { data } = useGetModelList(localStorage.getItem('userId'))
  const [completedModelList, setCompletedModelList] = useState([])

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      downloadData(result.signed_url)
    },
    onError: (error: Error) => {
      console.log('err:', error)
    },
  })

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setCompletedModelList(data.filter((i: IModelInfo) => i.state === '7'))
    }
  }, [data])

  const handleRunModel = () => {
    setLoading(true)
    mutateTrainingResult({ model_id: modelId, is_xai: 'true' })
  }

  const downloadData = async (url: string) => {
    try {
      const result = await ModelApi.getJsonResult(url)

      if (Object.keys(result).length > 0)
        setXaiResult({
          ...xaiResult,
          sample_size: result['sample_size'],
          feature_length: result.feature_list.length,
          feature_list: result['feature_list'],
          predict_result: result['predict_result'],
          input_data: transformDataByRow(result['sample_size'], result['input_data']),
          xai_local: transformDataByRow(result['sample_size'], result['xai_local']),
          xai_global: result['xai_global'][0],
          xai_pdp: result['xai_pdp'],
          colors: STACKED_BAR_CHART_COLORS,
        })
      setLoading(false)
      setModal(null)
    } catch (error) {
      message.error('결과를 확인할 수 없습니다. 관리자에게 문의하세요')
      setLoading(false)
    }
  }

  const handleSelect = (model_id: string) => {
    setModelId(model_id)
  }

  return (
    <>
      <Spin tip="모델 분석중..." spinning={loading}>
        <div>
          {completedModelList?.length > 0 ? (
            <ModelList data={completedModelList.filter((i: IModelInfo) => i.state === '7')} onSelect={handleSelect} />
          ) : (
            <Empty />
          )}
        </div>
        <div className="mt-[25px]">
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <CustomButton disabled={false} onClick={handleRunModel}>
            Run
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default SavedModelImport
