import { Checkbox, Modal, Radio, Spin, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import ModelTypeRadio from './ModelSelect/ModelTypeRadio'
import ModelUpload from './ModelSelect/Upload'
import ModelApi from 'apis/ModelApi'
import { useMutation } from 'react-query'
import { CancelButton, CustomButton } from '../../DataAnalysis/components/DataInfo/DataImportModal'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import ColumnList from './ModelSelect/ColumnList'
import { customModelStore } from 'views/XAI-simulator/store/analyze/atom'

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

const UserModelImport = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId').toString()

  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<IDataObj>() //upload(step1) 요청 시 필요한 데이터
  // const [response, setResponse] = useState<IParamObj>() //save(step2) 요청 시 필요한 파라메터
  const [modal, setModal] = useRecoilState(modalState)
  const [isDisabled, setIsDisabled] = useState(true)
  const [haveColumn, setHaveColumn] = useState(false)
  const [result, setResult] = useRecoilState(customModelStore)

  const { mutate: mutateUpload } = useMutation(ModelApi.uploadModelwithData, {
    onSuccess: (response: any) => {
      console.log('mutateUpload;', response)
      // message.open({
      //   type: 'success',
      //   content: response.message,
      //   duration: 1,
      //   style: {
      //     margin: 'auto',
      //   },
      // })

      setResult({ ...result, uuid: response.uuid, variable_list: response['variable_list'] })
      setSaving(false)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })
  const { mutate: mutateSave } = useMutation(ModelApi.saveModelwithColumns, {
    onSuccess: (response: any) => {
      // message.open({
      //   type: 'success',
      //   content: response,
      //   duration: 1,
      //   style: {
      //     margin: 'auto',
      //   },
      // })
      setSaving(false)

      //결과 데이터 받아오기 위해 다시 요청
      fetchGetResult(response.uuid)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      setSaving(false)
    },
  })

  const { mutate: mutateGetResult } = useMutation(ModelApi.getXaiAnalysisResult, {
    onSuccess: (result: any) => {
      console.log('mutateGetResult:', result)
      setResult({ ...result, data: result })
      setSaving(false)
      setModal(null)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  useEffect(() => {
    setData({ ...data, model: 'pytorch', data: undefined, column: undefined })
  }, [])

  useEffect(() => {
    // console.log('useEffect:', data)
    // console.log('haveColumn:', haveColumn)

    if (!data?.model || !data?.data) {
      setIsDisabled(true) //버튼 활성화
    } else {
      setIsDisabled(false)
    }
  }, [data, haveColumn])

  const handleChangeModel = (param: any) => {
    // console.log('handle change:', param)
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
    setResult({ ...result, selected_var: param })
  }

  const handleUpload = () => {
    setSaving(true)

    if (data?.model && data?.data) {
      const formData = new FormData()

      formData.append('weight', data.model)
      formData.append('input_data', data.data)
      formData.append('model_type', !data.type ? 'pytorch' : data.type)
      formData.append('columns', data.column || null)

      mutateUpload({ user_id, formData })
    }
  }

  const handleSave = () => {
    setSaving(true)
    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: result.uuid,
      x_value: result.selected_var,
    }

    mutateSave({ user_id, payload })
  }

  const fetchGetResult = (uuid: string) => {
    setSaving(true)
    const payload = {
      user_id: user_id,
      com_id: com_id,
      uuid: uuid,
    }
    console.log('payload:', payload)
    mutateGetResult({ user_id, payload })
  }

  return (
    <>
      <Spin tip="업로드 중 ..." spinning={saving}>
        <div>
          <ModelTypeRadio onChange={handleChangeType} />
          <ModelUpload
            required={true}
            label="예측모델 파일 업로드"
            onChange={handleChangeModel}
            selectedFile={data?.model?.name}
          />
          <ModelUpload
            required={true}
            label="분석할 데이터"
            onChange={handleChangeData}
            selectedFile={data?.data?.name}
          />
          {/* <Switch
            defaultChecked
            checkedChildren={
              <>
                <span>Column </span>
                <CheckOutlined />
              </>
            }
            unCheckedChildren={
              <>
                <span>Column </span>
                <CloseOutlined />
              </>
            }
          /> */}
          {/* <Checkbox style={{ color: '#002d65', fontSize: '13px' }} onChange={(e) => setHaveColumn(e.target.checked)}>
            Do you have columns to upload?
          </Checkbox>
          {haveColumn ? ( */}
          <ModelUpload
            required={false}
            label="Column(Optional인데 아직은 필수 입력)"
            onChange={handleChangeColumn}
            selectedFile={data?.column?.name}
          />
          {/* ) : null} */}
        </div>
        <div
          style={{
            width: '100%',
            height: 200,
            overflow: 'auto',
            display: result?.variable_list?.length > 0 ? 'block' : 'none',
          }}
        >
          <ColumnList data={result?.variable_list} onSelect={handleSelectColumn} />
        </div>
        <div style={{ margin: '25px 0' }}>
          <CancelButton onClick={() => setModal(null)}>Cancel</CancelButton>
          <CustomButton
            // className="block ant-btn ant-btn-primary"
            visible={result?.uuid ? false : true}
            disabled={isDisabled}
            onClick={handleUpload}
          >
            Upload
          </CustomButton>
          <CustomButton visible={result?.uuid ? true : false} onClick={handleSave}>
            Model Save
          </CustomButton>
        </div>
      </Spin>
    </>
  )
}

export default UserModelImport
