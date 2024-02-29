import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { CancelButton, CustomButton } from '../../AIModelGenerator/components/DataInfo/DataImportModal'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import ModelList from './ModelSelect/ModelList'
import { useMutation } from 'react-query'
import XaiApi from 'apis/XaiApi'

const SavedModelImport = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(false)

  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const { mutate: mutateGetResult } = useMutation(XaiApi.getXaiAnalysisResult, {
    onSuccess: (result: any) => {
      console.log('mutateGetResult:', result)
      // setResult({ ...result, data: result })
      setSaving(false)
      setModal(null)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  useEffect(() => {
    console.log('SavedModelImport list:', data)
  }, [data])

  const handleRunModel = () => {
    fetchGetResult('08b1a60fa2ef44149e1444ca3c18d08a')
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
