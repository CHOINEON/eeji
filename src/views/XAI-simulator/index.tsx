/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { App } from 'antd'
import XaiApi from 'apis/XaiApi'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { transformDataByRow } from './functions'
import { xaiPaginationStore, xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import XaiAnalysisResult from './XaiAnalysisResult'

const XAIsimulator = () => {
  const [xAIanalysisResult] = useRecoilState(xaiResultStore)
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const resetAnalysisResult = useResetRecoilState(xaiResultStore)
  const [xaiPagination, setXaiPagination] = useRecoilState(xaiPaginationStore)

  const { id } = useParams<{ id: string }>()
  const [modelId, setModelId] = useState<string>(id || '')

  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const setModal = useSetRecoilState(modalState)

  const { mutate: mutateXaiResultCount } = useMutation(XaiApi.getTotalXaiRows, {
    onSuccess: (result: any) => {
      setXaiPagination({ ...xaiPagination, total: result?.xai_result_count })
      mutateXaiResult({ model_id: modelId, offset: xaiPagination.offset, limit: xaiPagination.limit })
    },
    onError: (error: AxiosError) => {
      message.error(error.message)
    },
  })

  const { mutate: mutateXaiResult } = useMutation(XaiApi.getPaginatedXaiResult, {
    onSuccess: (result: any) => {
      if (Object.keys(result).length > 0)
        setXaiResult({
          ...xaiResult,
          sample_size: result['sample_size'],
          feature_length: result.feature_list.length,
          feature_list: result['feature_list'],
          predict_result: result['predict_result'],
          input_data: transformDataByRow(
            xaiPagination.limit,
            xaiPagination.offset,
            result['input_data'],
            xaiPagination.total
          ),
          xai_local: transformDataByRow(
            xaiPagination.limit,
            xaiPagination.offset,
            result['xai_local'],
            xaiPagination.total
          ),
          xai_global: result['xai_global'],
          xai_pdp: result['xai_pdp'],
          colors: STACKED_BAR_CHART_COLORS,
        })
      setLoading(false)
      setModal(null)
    },
    onError: (error: AxiosError) => {
      message.error(t('The result is not available. Please contact admin'))
      setLoading(false)
    },
  })

  useEffect(() => {
    if (id == null) {
      resetAnalysisResult()
    } else {
      setLoading(true)

      setXaiResult({ ...xaiResult, model_id: id })
      mutateXaiResultCount({ model_id: id })
    }
    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/xai-simulator',
        pageTitle: 'XAI',
        user_id: localStorage.getItem('userId'),
      },
    }
    TagManager.dataLayer(args)
  }, [id])

  return (
    <>
      {xAIanalysisResult?.feature_length > 0 ? (
        <XaiAnalysisResult />
      ) : !id ? (
        <div className="relative w-full h-full">
          <UploadPage />
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default XAIsimulator
