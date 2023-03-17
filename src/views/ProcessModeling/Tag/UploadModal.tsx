import React, { useState, useRef, useEffect } from 'react'
import { Modal, Row, Button, Typography } from 'antd'
import * as XLSX from 'xlsx'

interface UploadModalProps {
  show: boolean
  onUploadClick: (json: any) => void
  onCloseClick: () => void
}

export const UploadModal: React.FC<UploadModalProps> = (props) => {
  const { show, onUploadClick, onCloseClick } = props
  const { Text } = Typography
  //modal visibility
  const [visibie, setVisible] = React.useState(false)
  //file upload data
  const [data, setData] = React.useState<any>()
  const fileInput = useRef<any>(null)

  useEffect(() => {
    setVisible(show)
  }, [show])

  const handleOk = () => {
    onUploadClick(data)
    setVisible(false)
  }

  const handleCancel = () => {
    onCloseClick()
    setVisible(false)
  }

  const handleAfterClose = () => {
    fileInput.current.value = ''
  }

  const handleChange = async (e: any) => {
    const file = e.target.files[0]
    const data = await file.arrayBuffer()
    const extension = file.name.slice(-4)
    const allowedExtensions = ['xlsx', '.xls', '.csv']

    if (allowedExtensions.indexOf(extension) === -1) {
      alert('.xls(x), .csv 파일만 가능합니다')
    } else {
      const wb = XLSX.read(data)
      const ws = wb.Sheets[wb.SheetNames[0]]

      if (extension === 'xlsx' || extension === '.xls') {
        const EXCEL_JSON = XLSX.utils.sheet_to_json(wb.Sheets['tag_description'], {
          raw: false,
          blankrows: false,
        })
        setData(EXCEL_JSON)
      } else if (extension === '.csv') {
        const CSV_JSON = XLSX.utils.sheet_to_json(ws)
        setData(CSV_JSON)
      }
    }
  }

  return (
    <>
      <Modal
        title="파일 업로드"
        open={visibie}
        onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        afterClose={handleAfterClose}
      >
        <Row>
          <input
            ref={fileInput}
            type="file"
            name="upload"
            id="upload"
            //hidden
            accept=".xls,.xlsx,.csv"
            onChange={handleChange}
          ></input>
        </Row>
        <Row>
          <Text type="secondary">Allowed file extensions : .xls(x), .csv</Text>
        </Row>
      </Modal>
    </>
  )
}

export default UploadModal
