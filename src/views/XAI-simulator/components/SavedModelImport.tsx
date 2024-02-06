import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { CancelButton, CustomButton } from '../../DataAnalysis/components/DataInfo/DataImportModal'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import ModelList from './ModelSelect/ModelList'

const SavedModelImport = () => {
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(true)

  const { data } = useGetDatasets(localStorage.getItem('userId'))

  const handleRunModel = () => {
    //
  }

  useEffect(() => {
    console.log('test:', data)
  }, [data])

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
