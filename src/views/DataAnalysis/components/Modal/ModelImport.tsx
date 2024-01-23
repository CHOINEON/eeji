import { Modal, Radio, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import RadioButtonGroup from '../DataEntry/RadioButtonGroup'
import ModelTypeRadio from './Model/ModelTypeRadio'
import ModelUpload from './Model/Upload'

interface IDataObj {
  model: any
  data: any
  column: any
}

const ModelImport = () => {
  const [data, setData] = useState<IDataObj>()

  useEffect(() => {
    console.log('data:', data)
  }, [data])

  const handleChangeModel = (param: any) => {
    setData({ ...data, model: param })
  }
  const handleChangeData = (param: any) => {
    setData({ ...data, data: param })
  }
  const handleChangeColumn = (param: any) => {
    setData({ ...data, column: param })
  }

  return (
    <>
      <Spin tip="데이터 업로드 중 ..." spinning={false}>
        <div>
          <ModelUpload label="예측모델 파일 업로드" onChange={handleChangeModel} selectedFile={data?.model?.name} />
          <ModelUpload label="분석할 데이터" onChange={handleChangeData} selectedFile={data?.data?.name} />
          <ModelUpload label="Column(Optional)" onChange={handleChangeColumn} selectedFile={data?.column?.name} />

          <ModelTypeRadio />
        </div>
        <div>
          {/* <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <UploadButton
            // className="block ant-btn ant-btn-primary"
            disabled={btnDisabled}
            onClick={handleSave}
          >
            Save
          </UploadButton> */}
        </div>
      </Spin>
    </>
  )
}

export default ModelImport
