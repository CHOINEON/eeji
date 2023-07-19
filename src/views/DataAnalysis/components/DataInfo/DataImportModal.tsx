import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import FileUploader from 'components/uploader/FileUploader'

const DataImportModal = (props: any) => {
  const { modalOpen, onClose, onSaveData, reqParams, type } = props
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    // console.log('DataImportModal props::', props)
  }, [props])

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
        <FileUploader type={type} onSaved={handleSaved} refresh={refresh} reqParams={reqParams} />
      </Modal>
    </div>
  )
}

export default DataImportModal
