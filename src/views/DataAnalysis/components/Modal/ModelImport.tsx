import { Modal, Radio, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import RadioButtonGroup from '../DataEntry/RadioButtonGroup'
import ModelTypeRadio from './Model/ModelTypeRadio'
import ModelUpload from './Model/Upload'
import ModelApi from 'apis/ModelApi'
import { useMutation } from 'react-query'
import { CancelButton, UploadButton } from '../DataInfo/DataImportModal'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { message } from 'antd'
import ColumnList from './Model/ColumnList'

interface IDataObj {
  model: any
  data: any
  column: any
  type: any
}

const TestResponse = {
  uuid: '55abedc3e63c4aaaad4655d4faec7a06',
  variable_list: [
    'K6 KILN SPEED 1',
    'K6 TEMP INLET',
    'K6 AUX COAL FD TH',
    'K6 INLET O2',
    'K6 INLET CO',
    'K6 INLET NOX',
    'K6 WGAS O2',
    'K6 WGAS CO',
    'K6 H FUEL TH',
    'K6 RISING DUCT',
    'K6 CFW FLOW',
    'K6 RDF CFW FEED',
  ],
  message: 'File uploaded successfully',
}

const ModelImport = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<IDataObj>() //upload(step1) 요청 시 필요한 데이터
  const [params, setParams] = useState({ uuid: '', variable_list: [], selected_var: [] }) //save(step2) 요청 시 필요한 파라메터
  const [modal, setModal] = useRecoilState(modalState)

  const { mutate: mutateUpload } = useMutation(ModelApi.uploadModelwithData, {
    onSuccess: (response: any) => {
      message.open({
        type: 'success',
        content: response.message,
        duration: 1,
        style: {
          margin: 'auto',
        },
      })

      setParams({ ...response, uuid: response.uuid, variable_list: response['variable_list'] })
      setSaving(false)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })
  const { mutate: mutateSave } = useMutation(ModelApi.saveModelwithColumns, {
    onSuccess: (response: any) => {
      console.log('resp:', response)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })

  useEffect(() => {
    setData({ ...data, model: 'pytorch' })
  }, [])

  useEffect(() => {
    // console.log('data:', data)
    if (data?.model && data?.data && data?.type && data.column) {
      const formData = new FormData()

      formData.append('weight', data.model)
      formData.append('input_data', data.data)
      formData.append('model_type', data.type)
      formData.append('columns', data.column || null)

      mutateUpload({ user_id, formData })

      setSaving(true)
    }
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
  const handleChangeType = (param: string) => {
    setData({ ...data, type: param })
  }
  const handleSelectColumn = (param: Array<any>) => {
    setParams({ ...params, selected_var: param })
  }
  //
  const handleSave = () => {
    const formData = new FormData()

    formData.append('com_id', com_id)
    formData.append('uuid', params.uuid)
    // formData.append('x_value', params.selected_var)

    mutateSave({ user_id, formData })
  }

  return (
    <>
      <Spin tip="데이터 업로드 중 ..." spinning={saving}>
        <div>
          <ModelTypeRadio onChange={handleChangeType} />
          <ModelUpload label="예측모델 파일 업로드" onChange={handleChangeModel} selectedFile={data?.model?.name} />
          <ModelUpload label="분석할 데이터" onChange={handleChangeData} selectedFile={data?.data?.name} />
          <ModelUpload label="Column(Optional)" onChange={handleChangeColumn} selectedFile={data?.column?.name} />
        </div>
        <div style={{ width: '100%', height: 200, overflow: 'auto' }}>
          <ColumnList data={params.variable_list} onSelect={handleSelectColumn} />
        </div>

        <div style={{ marginBottom: '35px' }}>
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <UploadButton
            // className="block ant-btn ant-btn-primary"
            disabled={false}
            onClick={handleSave}
          >
            Upload
          </UploadButton>
        </div>
      </Spin>
    </>
  )
}

export default ModelImport
