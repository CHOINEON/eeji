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

interface IParamObj {
  uuid: string
  variable_list: Array<string>
  selected_var: Array<string>
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
  const [response, setResponse] = useState<IParamObj>() //save(step2) 요청 시 필요한 파라메터
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

      setResponse({ ...response, uuid: response.uuid, variable_list: response['variable_list'] })
      setSaving(false)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })
  const { mutate: mutateSave } = useMutation(ModelApi.saveModelwithColumns, {
    onSuccess: (response: any) => {
      message.open({
        type: 'success',
        content: response,
        duration: 1,
        style: {
          margin: 'auto',
        },
      })
      setModal(null)
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
    if (data?.model && data?.data && data.column) {
      const formData = new FormData()

      formData.append('weight', data.model)
      formData.append('input_data', data.data)
      formData.append('model_type', !data.type ? 'pytorch' : data.type)
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
    setResponse({ ...response, selected_var: param })
  }
  //
  const handleSave = () => {
    // const params = new URLSearchParams()

    // params.append('com_id', com_id)
    // params.append('uuid', response.uuid)
    // params.append('x_value', JSON.stringify(response.selected_var))

    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: response.uuid,
      x_value: response.selected_var,
    }
    mutateSave({ user_id, payload })
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
        <div
          style={{ width: '100%', height: 200, overflow: 'auto', display: response?.variable_list ? 'block' : 'none' }}
        >
          <ColumnList data={response?.variable_list} onSelect={handleSelectColumn} />
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
