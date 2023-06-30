import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import FileUploader from 'views/DataAnalysis/FileUploader'

const DataImportModal = (props: any) => {
  const { modalOpen, onClose, onSaveData } = props
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setOpen(modalOpen)
  }, [props])

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setOpen(false)
    onClose()
    setRefresh(true)
  }

  const handleCancel = () => {
    setOpen(false)
    onClose()
    setRefresh(true)
  }

  const handleSaved = (param: any) => {
    // console.log(param)
    onSaveData(param)
    setOpen(false)
    onClose()
    setRefresh(true)
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
        <FileUploader onSaved={handleSaved} refresh={refresh} />
      </Modal>
    </div>
  )
}

export default DataImportModal
