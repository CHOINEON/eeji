import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState } from 'stores/modal'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/DataInfo/DataImportModal'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import ModelList from './ModelSelect/ModelList'
import { useMutation } from 'react-query'
import XaiApi from 'apis/XaiApi'

import { customModelStore, transformedXaiResultStore, xaiResultStore } from '../store/analyze/atom'
import { transformDataByRow } from '../AnalysisResult'
// import { transformDataByRow } from '../AnalysisResult'
import { colorsForStackedBarChart as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'

const SavedModelImport = () => {
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)

  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [modelId, setModelId] = useState()
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(false)
  const [data, setData] = useState([])
  // const { data } = useGetDatasets(localStorage.getItem('userId'))

  const { mutate: mutateGetModelList } = useMutation(XaiApi.getSavedModelList, {
    onSuccess: (result: any) => {
      // console.log('mutateGetModelList:', result)
      setData(result.data)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  const { mutate: mutatePostResult } = useMutation(XaiApi.postModelForXaiResult, {
    onSuccess: (result: any) => {
      // console.log('mutateGetResult:', result)

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
      console.log('error: ', error)
    },
  })

  useEffect(() => {
    if (user_id) mutateGetModelList({ user_id: user_id })
  }, [])

  const handleRunModel = () => {
    // '1be13733ed4e48338c92e6a74fea9f40'  // feature length : 4
    fetchGetResult(modelId) //feature length: 12
  }

  const fetchGetResult = (uuid: string) => {
    setSaving(true)
    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: uuid,
    }

    // console.log('payload:', payload)
    mutatePostResult(payload)
  }

  const handleSelect = (param: any) => {
    setModelId(param)
  }

  return (
    <>
      <Spin tip="모델 로딩중 ..." spinning={saving}>
        <div>
          <ModelList data={data} onSelect={handleSelect} />
        </div>
        <div style={{ margin: '25px 0' }}>
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <CustomButton
            // className="block ant-btn ant-btn-primary"
            visible={true}
            disabled={isDisabled}
            onClick={handleRunModel}
          >
            Run
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default SavedModelImport
