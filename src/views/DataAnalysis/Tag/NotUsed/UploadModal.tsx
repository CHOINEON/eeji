import React, { useState, useRef, useEffect } from 'react'
import { Modal, Typography } from 'antd'
import axios from 'axios'
import { UploaderComponent, UploadingEventArgs } from '@syncfusion/ej2-react-inputs'
import { FileInfo, SelectedEventArgs, RemovingEventArgs } from '@syncfusion/ej2-inputs'

interface UploadModalProps {
  show: boolean
  onUploaded: (isUploaded: boolean) => void
  onCloseClick: () => void
}

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
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/uploadfile', formData, {
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
