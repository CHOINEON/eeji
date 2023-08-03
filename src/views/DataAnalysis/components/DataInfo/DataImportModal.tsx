import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import FileUploader from 'components/uploader/FileUploader'
import { useRecoilState, useRecoilValue } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'

const DataImportModal = (props: any) => {
  const { onSaveData, reqParams, type } = props
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [importOpen, setImportOpen] = useRecoilState(importModalAtom)

  useEffect(() => {
    setOpen(importOpen)
  }, [importOpen])

  const handleOk = () => {
    setImportOpen(true)
    // setRefresh(true)
  }

  const handleCancel = () => {
    // setRefresh(true)
    setImportOpen(false)
  }

  const handleSaved = (param: any) => {
    onSaveData(param)
    // setRefresh(true)
    setImportOpen(false)
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
