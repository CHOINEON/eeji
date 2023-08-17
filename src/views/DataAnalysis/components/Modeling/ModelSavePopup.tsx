import { Button, Input, Modal, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { saveModalAtom } from 'views/DataAnalysis/store/modal/atom'

const getNowDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()

  let month: any = now.getMonth() + 1
  if (month.toString().length === 1) month = '0' + month
  let date: any = now.getDate()
  if (date.toString().length === 1) date = '0' + date
  let hour: any = now.getHours()
  if (hour.toString().length === 1) hour = '0' + hour
  let minutes: any = now.getMinutes()
  if (minutes.toString().length === 1) minutes = '0' + minutes
  let seconds: any = now.getSeconds()
  if (seconds.toString().length === 1) seconds = '0' + seconds

  return year + month + date + hour + minutes + seconds
}

function ModelSavePopup(props: any) {
  const { onSave, data } = props
  const [saveModalOpen, setSaveModalOpen] = useRecoilState(saveModalAtom)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setTitle('')
    setDescription('')

    let str_y_value = ''
    if (typeof data.y_value === 'object') {
      str_y_value = data.y_value.toString()
    } else {
      str_y_value = data.y_value
    }

    if (Object.keys(data).length !== 0) {
      //data.y_value
      const new_title = `${data.predict_type}_${str_y_value}_${getNowDateTime()}`
      setTitle(new_title)
    }
  }, [data])

  const handleOk = () => {
    setSaveModalOpen(false)
    // onClose()
  }

  const handleCancel = () => {
    setSaveModalOpen(false)
  }

  const handleSave = (param: any) => {
    onSave(title, description)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            Model Name: <Input showCount maxLength={30} onChange={onChangeInput} value={title} />
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
    </div>
  )
}

export default ModelSavePopup
