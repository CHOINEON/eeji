import { App, Empty, Spin } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelInfo } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { validationCheck } from 'utils/DateFunction'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/Modal/DataImportModal'
import { xaiResultStore } from '../store/analyze/atom'
import { transformDataByRow } from '../XaiAnalysisResult'
import ModelList from './ModelSelect/ModelList'

const SavedModelImport = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const setModal = useSetRecoilState(modalState)

  const [modelId, setModelId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const { data } = useGetModelList(localStorage.getItem('userId'))
  const [completedModelList, setCompletedModelList] = useState([])

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // GCS에서 받아온 만료시간이 GMT으로 설정되어 있어 한국 시간대(GMT + 9)로 변경하여 확인함
      if (validationCheck(result.expiration, 9)) downloadData(result.signed_url)
      else message.error(t('Sorry. This request is expired.'))
    },
    onError: (error: Error) => {
      console.error('err:', error)
    },
  })

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setCompletedModelList(data.filter((i: IModelInfo) => i.state === '9'))
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
          xai_global: result['xai_global'],
          xai_pdp: result['xai_pdp'],
          colors: STACKED_BAR_CHART_COLORS,
        })
      setLoading(false)
      setModal(null)
    } catch (error) {
      message.error(t('The result is not available. Please contact admin'))
      setLoading(false)
    }
  }

  const handleSelect = (model_id: string) => {
    setModelId(model_id)
  }

  return (
    <>
      <Spin tip={t('analyzing').concat('...')} spinning={loading}>
        <div>
          {completedModelList?.length > 0 ? <ModelList data={completedModelList} onSelect={handleSelect} /> : <Empty />}
        </div>
        <div className="mt-[25px]">
          <CancelButton onClick={() => setModal(null)}>{t('Cancel')}</CancelButton>
          <CustomButton disabled={false} onClick={handleRunModel}>
            {t('Run')}
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default SavedModelImport
