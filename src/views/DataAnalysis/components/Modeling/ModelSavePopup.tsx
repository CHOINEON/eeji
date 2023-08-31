import { Button, Input, Modal, Space, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { saveModalAtom } from 'views/DataAnalysis/store/modal/atom'
import { modelListAtom } from 'views/AIModelManagement/store/atom'

import axios from 'axios'
import * as common from 'common/DateFunction'

// const getNowDateTime = () => {
//   const now = new Date()
//   const year = now.getFullYear()

//   let month: any = now.getMonth() + 1
//   if (month.toString().length === 1) month = '0' + month
//   let date: any = now.getDate()
//   if (date.toString().length === 1) date = '0' + date
//   let hour: any = now.getHours()
//   if (hour.toString().length === 1) hour = '0' + hour
//   let minutes: any = now.getMinutes()
//   if (minutes.toString().length === 1) minutes = '0' + minutes
//   let seconds: any = now.getSeconds()
//   if (seconds.toString().length === 1) seconds = '0' + seconds

//   return year + month + date + hour + minutes + seconds
// }

function ModelSavePopup(props: any) {
  const { onSave, data } = props

  const ModelList = useRecoilValue(modelListAtom)
  const [saveModalOpen, setSaveModalOpen] = useRecoilState(saveModalAtom)
  const [modelList, setModelList] = useRecoilState(modelListAtom)

  const [inputStatus, setInputStatus] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    fetchSavedModelList()
  }, [])

  useEffect(() => {
    clearInput()
  }, [saveModalOpen])

  useEffect(() => {
    let str_y_value = ''

    if (typeof data.y_value === 'object') {
      str_y_value = data.y_value.toString()
    } else {
      str_y_value = data.y_value
    }

    if (Object.keys(data).length !== 0) {
      //data.y_value
      const new_title = `${data.predict_type}_${str_y_value}_${common.getNowDateTime()}`
      setTitle(new_title)
    }
  }, [data])

  //모델명 중복검사 하려고 여기 놓음(0830)
  const fetchSavedModelList = () => {
    const com_id = localStorage.getItem('companyId')
    const user_id = localStorage.getItem('userId')

    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model?com_id=' + com_id + '&user_id=' + user_id)
      .then((response: any) => {
        // console.log('/api/predict/mode response:', response)
        setModelList(response.data)
      })
      .catch((err) => console.error(err))
  }

  const clearInput = () => {
    setInputStatus(undefined)
    setTitle('')
    setDescription('')
  }

  const handleOk = () => {
    // console.log('ok')
    setSaveModalOpen(false)
    clearInput()
    // onClose()
  }

  const handleCancel = () => {
    // console.log('clear')
    setSaveModalOpen(false)
    clearInput()
  }

  const handleSave = () => {
    console.log('save')
    if (modelList.find((model) => model.model_name === title)) {
      console.log('if')

      messageApi.open({
        type: 'error',
        content: `이미 존재하는 모델명입니다. (${title})`,
        duration: 2,
        style: {
          margin: 'auto',
        },
      })
      setInputStatus('error')
    } else {
      console.log('else')

      //중복검사 통과하면 전달함
      //onSave(title, description)
      setInputStatus(undefined)
      fetchSaveModel(title, description)
    }
  }

  const fetchSaveModel = (modelName?: string, desc?: string) => {
    const param = {
      user_id: localStorage.getItem('userId'),
      model_name: modelName,
      desc: desc,
    }

    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/save_model', param)
      .then((response) => {
        console.log('/api/save_model::', response)
        if (response.status === 200) {
          messageApi.open({
            type: 'success',
            content: 'Saved.',
            duration: 1,
            style: {
              margin: 'auto',
            },
          })
          setSaveModalOpen(false)
        }
      })
      .catch((err) => {
        setSaveModalOpen(false)
        messageApi.open({
          type: 'error',
          content: '저장 실패. 관리자에게 문의하세요.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
        console.log(err)
      })
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputStatus(undefined)
    setTitle(e.target.value)
  }

  const onChangeTextArea = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('e:', e)
    setDescription(e.target.value)
  }

  return (
    <div>
      <Modal
        open={saveModalOpen}
        title="Save Model"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          // <Button key="back" onClick={handleCancel}>
          //   Return
          // </Button>,
          <Button style={{ marginTop: '30px' }} key="Save" type="primary" loading={loading} onClick={handleSave}>
            Save
          </Button>,
          // <Button
          //   key="link"
          //   href="https://google.com"
          //   type="primary"
          //   loading={loading}
          //   onClick={handleOk}
          // >
          //   Search on Google
          // </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <div>
            Model Name:{' '}
            <Input allowClear showCount maxLength={30} onChange={onChangeInput} value={title} status={inputStatus} />
          </div>
          <div>
            {' '}
            Description :{' '}
            <TextArea
              placeholder="Model Description"
              allowClear
              onChange={onChangeTextArea}
              maxLength={280}
              style={{ height: 120, resize: 'none' }}
              showCount
            />
          </div>
        </Space>
      </Modal>
      {contextHolder}
    </div>
  )
}

export default ModelSavePopup
