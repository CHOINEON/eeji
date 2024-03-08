import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState } from 'stores/modal'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/DataInfo/DataImportModal'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import ModelList from './ModelSelect/ModelList'
import { useMutation } from 'react-query'
import XaiApi from 'apis/XaiApi'
import ModelApi from 'apis/ModelApi'
import { customModelStore, xaiResultStore } from '../store/analyze/atom'

const SavedModelImport = () => {
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)

  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(false)

  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const { mutate: mutateGetResult } = useMutation(ModelApi.postModelList, {
    onSuccess: (result: any) => {
      // console.log('mutateGetResult:', result)
      setXaiResult(result)
      setSaving(false)
      setModal(null)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  // const { mutate: mutateGetResult } = useMutation(XaiApi.getXaiAnalysisResult, {
  //   onSuccess: (result: any) => {
  //     // console.log('mutateGetResult:', result)
  //     setXaiResult(result)
  //     setSaving(false)
  //     setModal(null)
  //   },
  //   onError: (error: any, query: any) => {
  //     //
  //   },
  // })

  // useEffect(() => {
  //   console.log('SavedModelImport list:', data)
  // }, [data])

  const handleRunModel = () => {
    // '1be13733ed4e48338c92e6a74fea9f40'  // feature length : 4
    fetchGetResult('1be13733ed4e48338c92e6a74fea9f40') //feature length: 12
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
