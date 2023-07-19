import { Button, Input, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ModelSavePopup(props: any) {
  const { modalOpen, onClose, onSave, data } = props
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('model_')

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
    // console.log(param)
    // onSave()
    // setOpen(false)
    // onClose()
    // setRefresh(true)
    // fetchModelingData()
    onSave(title)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('Change:', e.target.value)
    setTitle(e.target.value)
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
        <Input showCount maxLength={30} onChange={onChange} defaultValue={'model_'} />
      </Modal>
    </div>
  )
}

export default ModelSavePopup
