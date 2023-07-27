import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import FileUploader from 'components/uploader/FileUploader'

/**
 *
 */

const DataImportModal = (props: any) => {
  const { modalOpen, onClose, onSaveData, reqParams, type } = props
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setOpen(modalOpen)
  }, [modalOpen])

  const handleOk = () => {
    setOpen(false)
    setRefresh(true)
    onClose()
  }

  const handleCancel = () => {
    setOpen(false)
    setRefresh(true)
    onClose()
  }

  const handleSaved = (param: any) => {
    onSaveData(param)
    setOpen(false)
    onClose()
    setRefresh(true)
  }

  return (
    <div>
      <Modal open={open} title="Data Import" onOk={handleOk} onCancel={handleCancel} footer={null}>
        <FileUploader type={type} onSaved={handleSaved} refresh={refresh} reqParams={reqParams} />
      </Modal>
    </div>
  )
}

export default DataImportModal
