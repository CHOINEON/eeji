import { Button, Input, Modal, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'

function ModelSavePopup(props: any) {
  const { modalOpen, onClose, onSave, data } = props
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('model_')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setOpen(modalOpen)
  }, [props])

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setOpen(false)
    onClose()
  }

  const handleCancel = () => {
    setOpen(false)
    onClose()
  }

  const handleSave = (param: any) => {
    onSave(title)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('e:', e)
    setTitle(e.target.value)
  }

  const onChangeTextArea = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('e:', e)
    setDescription(e.target.value)
  }

  return (
    <div>
      <Modal
        open={open}
        title="Save Model"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          // <Button key="back" onClick={handleCancel}>
          //   Return
          // </Button>,
          <Button key="Save" type="primary" loading={loading} onClick={handleSave}>
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
          Model Name: <Input showCount maxLength={30} onChange={onChangeInput} defaultValue={'model_'} />
          Description : <TextArea placeholder="Model Description" allowClear onChange={onChangeTextArea} />
        </Space>
      </Modal>
    </div>
  )
}

export default ModelSavePopup
