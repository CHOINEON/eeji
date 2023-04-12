import React, { useState, useRef, useEffect } from 'react'
import { Modal, Row, Button, Typography, Upload, message } from 'antd'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { ProgressButton } from '@syncfusion/ej2-react-splitbuttons'
import { UploaderComponent, UploadingEventArgs } from '@syncfusion/ej2-react-inputs'
import { FileInfo, SelectedEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs'
import { CircularProgress, Theme, createStyles } from '@mui/material'
// import { makeStyles } from '@mui/styles'

// import { green } from '@material-ui/core/colors'

interface UploadModalProps {
  show: boolean
  onUploaded: (isUploaded: boolean) => void
  onCloseClick: () => void
}

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       display: 'flex',
//       alignItems: 'center',
//     },
//     wrapper: {
//       margin: theme.spacing(1),
//       position: 'relative',
//     },
//     // buttonSuccess: {
//     //   backgroundColor: green[500],
//     //   '&:hover': {
//     //     backgroundColor: green[700],
//     //   },
//     // },
//     // fabProgress: {
//     //   color: green[500],
//     //   position: 'absolute',
//     //   top: -6,
//     //   left: -6,
//     //   zIndex: 1,
//     // },
//     // buttonProgress: {
//     //   color: green[500],
//     //   position: 'absolute',
//     //   top: '50%',
//     //   left: '50%',
//     //   marginTop: -12,
//     //   marginLeft: -12,
//     // },
//   })
// )

export const UploadModal: React.FC<UploadModalProps> = (props) => {
  // const classes = useStyles()
  const { show } = props
  const { Text } = Typography
  //modal visibility
  const [visibie, setVisible] = React.useState(false)
  //file upload data
  const [loading, setLoading] = useState(false)
  const [tagList, setTagList] = useState<Array<string>>([])

  //Upload input
  const fileInput = useRef<any>(null)

  const uploadObj = useRef<UploaderComponent>(null)

  // Uploader component
  let dropContainerEle: HTMLElement = null
  const dropContainerRef = (element: HTMLElement) => {
    dropContainerEle = element
  }
  const asyncSettings: object = {
    chunkSize: 100000000, // set chunk size for enable the chunk upload
  }

  useEffect(() => {
    setVisible(show)
  }, [show])

  // const progressButton: ProgressButton = new ProgressButton({
  //   content: 'SAVE',
  //   enableProgress: true,
  //   animationSettings: { effect: 'SlideRight' },
  //   spinSettings: { position: 'Center' },
  //   cssClass: 'e-outline e-success',
  // })
  // progressButton.appendTo('#progressSaveBtn')

  // excel file parsing
  // const handleChange = async (e: any) => {
  //   // console.log('e:', e)
  //   const file = e.target.files[0]
  //   const data = await file.arrayBuffer()
  //   const extension = file.name.slice(-4)
  //   const allowedExtensions = ['xlsx', '.xls', '.csv']

  //   if (allowedExtensions.indexOf(extension) === -1) {
  //     alert('.xls(x), .csv 파일만 가능합니다')
  //   } else {
  //     setFileName(file.name)
  //     const wb = XLSX.read(data)
  //     const ws = wb.Sheets[wb.SheetNames[0]]

  //     if (extension === 'xlsx' || extension === '.xls') {
  //       const EXCEL_JSON = XLSX.utils.sheet_to_json(wb.Sheets['tag_description'], {
  //         raw: false,
  //         blankrows: false,
  //       })
  //       setData(EXCEL_JSON)
  //     } else if (extension === '.csv') {
  //       const CSV_JSON = XLSX.utils.sheet_to_json(ws)
  //       setData(CSV_JSON)
  //     }
  //   }
  // }

  function renderComplete(): void {
    //useEffect에서 호출 시 DOM rendering 전임..이유 모름..
    // console.log('uploadobj:', uploadObj)
    // uploadObj.dropArea = dropContainerEle
    // uploadObj.element.setAttribute('name', 'UploadFiles')
    // uploadObj.dataBind()
  }

  function onRemoveFile(args: RemovingEventArgs): void {
    args.postRawFile = false
  }

  const handleSubmit = async () => {
    // console.log('uploadObj:', uploadObj.current.getFilesData())

    //Progress show
    setLoading(true)

    const formData = new FormData()
    const uploadFiles = uploadObj.current.getFilesData()

    for (const i in uploadFiles) {
      formData.append('files', uploadFiles[i].rawFile)
    }

    axios
      .post('http://34.64.197.87:5001/api/tag/uploadfile', formData, {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      })
      .then(
        (response) => {
          console.log('RESP:', response)
          setLoading(false)
          if (response.status === 200) {
            setVisible(false)

            //To Parent(response.data.tagList)
            if (response.data) {
              setTagList(response.data.tagList)
            }
          }
        },
        (error) => {
          console.log('error:', error)
          alert(error)
          setLoading(false)
        }
      )
  }

  const handleClose = () => {
    setVisible(false)
  }

  const onBeforeUpload = (args: UploadingEventArgs) => {
    console.log('onBeforeUpload:', args)
    // get the file size in bytes
    // const sizeInBytes: number = args.fileData.size
    // get the file size in standard format
    // alert('File size is: ' + this.uploadObj.bytesToSize(sizeInBytes))
  }

  const chunkUploading = (e: any) => {
    console.log('chunkUploading:', e)
  }
  return (
    <div className="control-section col-lg-12 defaultDialog dialog-target">
      <Modal title="Upload" open={visibie} closable onCancel={handleClose} onOk={handleSubmit}>
        <div>
          {/* <Test /> */}
          {/* Render Uploader */}
          <div className="control-pane" ref={dropContainerRef}>
            <div className="control-section row uploadpreview">
              <div className="col-lg-9">
                <div className="upload_wrapper">
                  {/* Render Uploader */}
                  <UploaderComponent
                    id="fileUpload"
                    type="file"
                    ref={uploadObj}
                    //asyncSettings={asyncSettings}
                    autoUpload={true}
                    // beforeUpload={onBeforeUpload}
                    chunkUploading={chunkUploading}
                    allowedExtensions=".xls,.xlsx,.csv"
                    removing={onRemoveFile.bind(this)}
                    asyncSettings={asyncSettings}
                    maxFileSize={100000000} //100MB
                  ></UploaderComponent>
                  {/* {loading && <CircularProgress size={24} />} */}
                  <Text type="secondary">Allowed file extensions : .xls(x), .csv</Text>
                </div>
              </div>
            </div>
          </div>
          {/* </Upload> */}
          {/* <div>{fileName}</div>
          <input
            ref={fileInput}
            type="file"
            name="upload"
            id="upload"
            hidden
            accept=".xls,.xlsx,.csv"
            onChange={handleChange}
          ></input>
          <br /> */}

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
