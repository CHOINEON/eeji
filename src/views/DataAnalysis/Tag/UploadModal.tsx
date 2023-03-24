import React, { useState, useRef, useEffect } from 'react'
import { Modal, Row, Button, Typography, Upload, message } from 'antd'
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids'
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { ProgressButton } from '@syncfusion/ej2-react-splitbuttons'

interface UploadModalProps {
  show: boolean
  onUploaded: (isUploaded: boolean) => void
  onCloseClick: () => void
}

export const UploadModal: React.FC<UploadModalProps> = (props) => {
  const { show, onUploaded, onCloseClick } = props
  const { Text } = Typography
  //modal visibility
  const [visibie, setVisible] = React.useState(false)
  //file upload data
  const [data, setData] = React.useState<any>()
  const [fileName, setFileName] = React.useState('')

  //Upload input
  const fileInput = useRef<any>(null)

  useEffect(() => {
    setVisible(show)
  }, [show])

  const onClearAttachment = () => {
    fileInput.current.value = ''
  }

  const handleOk = () => {
    console.log('data:', data)

    axios
      .post('http://ec2-3-220-205-197.compute-1.amazonaws.com:9871/createTag', JSON.stringify(data), {
        headers: {
          'Content-Type': `application/json`,
        },
      })
      .then((response) => {
        // console.log('resp:', response)
        if (response.status === 200) {
          alert('success')
          onUploaded(true)
          onCloseClick()
        }
      })
      .catch((error) => error('failed'))
    setVisible(false)
  }

  const buttons = [
    {
      id: 'progressSaveBtn',
      click: handleOk,
      buttonModel: {
        content: 'Save',
        isPrimary: true,
      },
    },
  ]

  const progressButton: ProgressButton = new ProgressButton({
    content: 'SAVE',
    enableProgress: true,
    animationSettings: { effect: 'SlideRight' },
    spinSettings: { position: 'Center' },
    cssClass: 'e-outline e-success',
  })
  progressButton.appendTo('#progressSaveBtn')

  const handleClick = () => {
    fileInput.current.click()
  }

  const handleChange = async (e: any) => {
    // console.log('e:', e)
    const file = e.target.files[0]
    const data = await file.arrayBuffer()
    const extension = file.name.slice(-4)
    const allowedExtensions = ['xlsx', '.xls', '.csv']

    if (allowedExtensions.indexOf(extension) === -1) {
      alert('.xls(x), .csv 파일만 가능합니다')
    } else {
      setFileName(file.name)
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

  function dialogClose() {
    setVisible(false)
    onClearAttachment()
    setData([])
    setFileName('')
  }

  function dialogOpen() {
    setVisible(true)
  }

  return (
    <div>
      <DialogComponent
        id="defaultdialog"
        showCloseIcon={true}
        //animationSettings={animationSettings}
        width="700px"
        target={'#targetElement'}
        header="TagList Upload"
        height="800px"
        visible={visibie}
        buttons={buttons}
        open={dialogOpen}
        close={dialogClose}
      >
        <div>
          {/* <Upload {...uProps}> */}
          <Button icon={<UploadOutlined />} onClick={handleClick}>
            Click to upload
          </Button>
          {/* </Upload> */}
          <div>{fileName}</div>
          <input
            ref={fileInput}
            type="file"
            name="upload"
            id="upload"
            hidden
            accept=".xls,.xlsx,.csv"
            onChange={handleChange}
          ></input>
          <br />
          <Text type="secondary">Allowed file extensions : .xls(x), .csv</Text>

          <br />
          <GridComponent dataSource={data} allowPaging={true} pageSettings={{ pageSize: 5, pageSizes: true }}>
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="TagName" textAlign="Center"></ColumnDirective>
              <ColumnDirective field="unit" headerText="Units" textAlign="Center"></ColumnDirective>
              <ColumnDirective field="description" headerText="Description" textAlign="Left"></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent>
        </div>
      </DialogComponent>
    </div>
  )
}

export default UploadModal
