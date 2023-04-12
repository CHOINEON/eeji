import React, { useState, useRef, useEffect } from 'react'
import { Modal, Row, Button, Typography, Upload, message } from 'antd'
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids'
import {
  DialogComponent,
  ButtonPropsModel,
  AnimationSettingsModel,
  createSpinner,
  showSpinner,
  hideSpinner,
} from '@syncfusion/ej2-react-popups'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { InboxOutlined, LeftCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { ProgressButton } from '@syncfusion/ej2-react-splitbuttons'
import { UploaderComponent } from '@syncfusion/ej2-react-inputs'
import { FileInfo, SelectedEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs'
import '../style/uploader.css'
import { detach, isNullOrUndefined, createElement, EventHandler, Browser } from '@syncfusion/ej2-base'
import Test from './test'

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
  //Browse file
  const aRef = useRef<HTMLAnchorElement>(null)

  // Uploader component
  let uploadObj: UploaderComponent
  let parentElement: HTMLElement
  let proxy: any
  let progressbarContainer: HTMLElement
  let filesDetails: FileInfo[] = []
  const filesList: HTMLElement[] = []
  let dropElement: HTMLElement
  let asyncSettings: object
  let spinnerRef
  let dropRef = null

  let dropContainerRef = null
  let dropContainerEle: any
  let dropAreaEle: HTMLElement
  let spinnerElement: HTMLElement

  dropAreaEle = null
  dropContainerEle = null
  dropRef = (element: any) => {
    dropAreaEle = element
  }
  dropContainerRef = (element: any) => {
    dropContainerEle = element
  }
  // asyncSettings = {
  //   saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
  //   removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  // }

  useEffect(() => {
    console.log('didMount')
    renderComplete()
  })

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
      .then(
        (response) => {
          // console.log('resp:', response)
          if (response.status === 200) {
            alert('success')
            onUploaded(true)
            onCloseClick()
          }
        },
        (error) => {
          error('failed')
        }
      )
    // .catch((error) => error('failed')) // 실제 버그로 인해 발생한 예외를 놓치지 않으려면 cathc보다 여기서 에러 핸들링
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

  const handleClick = (e: any) => {
    // console.log('e:', e)
    e.preventDefault()
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

  function formSelectedData(selectedFiles: FileInfo, proxy: any): void {
    const liEle: HTMLElement = createElement('li', {
      className: 'file-lists',
      attrs: { 'data-file-name': selectedFiles.name },
    })
    liEle.appendChild(createElement('span', { className: 'file-name ', innerHTML: selectedFiles.name }))
    liEle.appendChild(
      createElement('span', { className: 'file-size ', innerHTML: uploadObj.bytesToSize(selectedFiles.size) })
    )
    if (selectedFiles.statusCode === '1') {
      progressbarContainer = createElement('span', { className: 'progress-bar-container' })
      progressbarContainer.appendChild(
        createElement('progress', { className: 'progress', attrs: { value: '0', max: '100' } })
      )
      liEle.appendChild(progressbarContainer)
    } else {
      liEle.querySelector('.file-name').classList.add('upload-fails')
    }
    const closeIconContainer: HTMLElement = createElement('span', { className: 'e-icons close-icon-container' })
    // EventHandler.add(closeIconContainer, 'click', removeFiles, proxy)
    liEle.appendChild(closeIconContainer)
    document.querySelector('.ul-element').appendChild(liEle)
    filesList.push(liEle)
  }

  const onFileSelect = (args: any) => {
    // console.log('dropAreaEle:', dropAreaEle)
    if (isNullOrUndefined(dropAreaEle.querySelector('.upload-list-root'))) {
      parentElement = createElement('div', { className: 'upload-list-root' })
      parentElement.appendChild(createElement('ul', { className: 'ul-element' }))
      dropAreaEle.appendChild(parentElement)
    }
    for (let i = 0; i < args.filesData.length; i++) {
      formSelectedData(args.filesData[i], this) // create the LI element for each file Data
    }
    filesDetails = filesDetails.concat(args.filesData)
    uploadObj.upload(args.filesData, true)
    args.cancel = true
  }

  const onSuccess = (args: any) => {
    const spinnerElement: HTMLElement = dropAreaEle
    const li: HTMLElement = dropAreaEle.querySelector('[data-file-name="' + args.file.name + '"]')
    if (args.operation === 'upload') {
      const progressBar: HTMLElement = li.getElementsByTagName('progress')[0]
      li.querySelector('.close-icon-container').classList.add('delete-icon')
      detach(li.getElementsByTagName('progress')[0])
      ;(li.querySelector('.file-size') as HTMLElement).style.display = 'inline-block'
      ;(li.querySelector('.file-name') as HTMLElement).style.color = 'green'
      ;(li.querySelector('.e-icons') as HTMLElement).onclick = () => {
        // createSpinner({ target: spinnerElement, width: '25px' })
        // showSpinner(spinnerElement)
      }
      ;(li.querySelector('.close-icon-container') as HTMLElement).onkeydown = (e: any) => {
        if (e.keyCode === 13) {
          createSpinner({ target: spinnerElement, width: '25px' })
          showSpinner(spinnerElement)
        }
      }
    } else {
      filesDetails.splice(filesList.indexOf(li), 1)
      filesList.splice(filesList.indexOf(li), 1)
      uploadObj.element.value = ''
      detach(li)
      hideSpinner(spinnerElement)
      detach(spinnerElement.querySelector('.e-spinner-pane'))
    }
    // EventHandler.add(li.querySelector('.close-icon-container'), 'click', removeFiles, this)
  }

  const handleBrowse = (e: any) => {
    e.preventDefault()
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click()
    return false
  }

  const renderComplete = () => {
    console.log('useRef:', aRef)
    console.log('queryselector:', document.getElementById('browse'))

    // aRef.current &&
    //   aRef.current.addEventListener('onClick', () => {
    //     aRef.current.prevent
    //     document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click()
    //     return false
    //   })

    document.getElementById('browse').onclick = () => {
      document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click()
      return false
    }

    dropElement = dropContainerEle

    console.log('uploadObj:', uploadObj)
    // uploadObj.element.setAttribute('name', 'UploadFiles')
    // uploadObj.dropArea = dropElement
    // uploadObj.dataBind()
    // if (Browser.isDevice) {
    //   ;(uploadObj.dropArea.querySelector('drop') as HTMLElement).style.padding = '4% 13%'
    // }
  }

  return (
    <div className="control-section col-lg-12 defaultDialog dialog-target">
      <Modal title="Upload" open={visibie} closable onCancel={() => setVisible(false)}>
        <div>
          {/* <Test /> */}
          {/* Render Uploader */}
          <div id="dropArea" className="dropArea" ref={dropRef}>
            <span id="drop" className="file-name-span drop">
              {' '}
              Drop files here or{' '}
              <a href="" id="browse" onClick={handleBrowse}>
                <u>Browse</u>
              </a>{' '}
            </span>
            <UploaderComponent
              id="fileUpload"
              type="file"
              ref={(scope) => (uploadObj = scope)}
              asyncSettings={asyncSettings}
              selected={onFileSelect}
              success={onSuccess}
              dropArea={dropElement}
            ></UploaderComponent>
          </div>

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
          {/* <GridComponent dataSource={data} allowPaging={true} pageSettings={{ pageSize: 5, pageSizes: true }}>
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="TagName" textAlign="Center"></ColumnDirective>
              <ColumnDirective field="unit" headerText="Units" textAlign="Center"></ColumnDirective>
              <ColumnDirective field="description" headerText="Description" textAlign="Left"></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent> */}
        </div>
      </Modal>
    </div>
  )
}

export default UploadModal
