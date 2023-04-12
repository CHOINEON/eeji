import React, { useRef } from 'react'
import { RemovingEventArgs, UploaderComponent } from '@syncfusion/ej2-react-inputs'

const FileUploader = () => {
  const uploadObj = useRef<UploaderComponent>(null)

  let dropContainerEle: HTMLElement = null
  const dropContainerRef = (element: HTMLElement) => {
    dropContainerEle = element
  }

  const asyncSettings: object = {
    chunkSize: 100000000, // set chunk size for enable the chunk upload
  }

  function onRemoveFile(args: RemovingEventArgs): void {
    args.postRawFile = false
  }

  return (
    <div className="control-section col-lg-12 defaultDialog dialog-target">
      <div className="control-pane" ref={dropContainerRef}>
        <div className="control-section row uploadpreview">
          <div className="col-lg-9">
            <div className="upload_wrapper">
              {/* Render Uploader */}
              <UploaderComponent
                id="fileUpload"
                type="file"
                ref={uploadObj}
                autoUpload={true}
                // beforeUpload={onBeforeUpload}
                //   chunkUploading={chunkUploading}
                allowedExtensions=".xls,.xlsx,.csv"
                removing={onRemoveFile.bind(this)}
                asyncSettings={asyncSettings}
                maxFileSize={100000000} //100MB
              ></UploaderComponent>
              {/* {loading && <CircularProgress size={24} />} */}
              <p>Allowed file extensions : .xls(x), .csv</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploader
