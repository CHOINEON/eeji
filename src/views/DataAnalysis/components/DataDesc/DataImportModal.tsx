import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import FileUploader from 'views/DataAnalysis/FileUploader'

const DataImportModal = (props: any) => {
  const { modalOpen, onClose, onSaveData } = props
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

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
    onSaveData(param)
    setOpen(false)
    onClose()
  }

  return (
    <div>
      <Modal
        open={open}
        title="Data Import"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          [
            // <Button key="back" onClick={handleCancel}>
            //   Return
            // </Button>,
            // <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            //   Submit
            // </Button>,
            // <Button
            //   key="link"
            //   href="https://google.com"
            //   type="primary"
            //   loading={loading}
            //   onClick={handleOk}
            // >
            //   Search on Google
            // </Button>,
          ]
        }
      >
        <FileUploader onSave={handleSave} />
      </Modal>
    </div>
  )
}

export default DataImportModal
