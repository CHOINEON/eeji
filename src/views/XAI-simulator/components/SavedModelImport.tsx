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
// import { transformDataByRow } from '../AnalysisResult'

const SavedModelImport = () => {
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const [transformedData, setTransformedData] = useRecoilState(transformedXaiResultStore)

  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()
  const [modelId, setModelId] = useState('1be13733ed4e48338c92e6a74fea9f40')
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(false)

  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const { mutate: mutateGetResult } = useMutation(XaiApi.getXaiAnalysisResult, {
    onSuccess: (result: any) => {
      console.log('mutateGetResult:', result)

      //넣을때 포맷팅 해서 넣기..
      // setXaiResult(result)

      // setTransformedData({
      //   sample_size: result.sample_size,
      //   feature_length: result.feature_length,
      //   feature_list: result.feature_list,
      //   predict_result: result.predict_result?.predict_result,
      //   input_data: transformDataByRow(result.sample_size, result.input_data),
      //   xai_local: transformDataByRow(result.sample_size, result.xai_local),
      //   xai_global: result.xai_global,
      //   xai_pdp: result.xai_pdp,
      // })
      setSaving(false)
      setModal(null)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

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
    mutateGetResult({ user_id, payload })
  }

  return (
    <>
      <Spin tip="모델 로딩중 ..." spinning={saving}>
        <div>
          <ModelList data={data?.data} />
        </div>
        <div style={{ margin: '25px 0' }}>
          <p>**For developers</p>
          <input
            type="text"
            value={modelId}
            onInput={(e: any) => setModelId(e.target.value)}
            placeholder="model uuid"
            style={{ border: '1px soild red', width: '100%' }}
          />
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
