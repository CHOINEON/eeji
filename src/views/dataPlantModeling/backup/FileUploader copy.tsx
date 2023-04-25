import React, { useState, useRef, useEffect } from 'react'
import { createElement } from '@syncfusion/ej2-base'
import { RemovingEventArgs, UploaderComponent } from '@syncfusion/ej2-react-inputs'
import { Button } from '@chakra-ui/react'
import { CircularProgress } from '@chakra-ui/react'
import axios from 'axios'
import DataInfoGrid from '../components/DataSummary'
import DataSummary from '../components/DataSummary'

const FileUploader = (props: any) => {
  const uploadObj = useRef<UploaderComponent>(null)
  const [loading, setLoading] = useState(false)
  const { onClickNext, refresh } = props
  const [summaryResult, setSummaryResult] = useState([])

  let dropContainerEle: HTMLElement = null
  const dropContainerRef = (element: HTMLElement) => {
    dropContainerEle = element
  }

  useEffect(() => {
    uploadObj.current.clearAll()
  }, [refresh])

  const asyncSettings: object = {
    chunkSize: 100000000, // set chunk size for enable the chunk upload
  }

  function onRemoveFile(args: RemovingEventArgs): void {
    args.postRawFile = false
  }

  const handleConfirm = () => {
    //Tab1로 이동하고 결과값 렌더링
    onClickNext(1)
  }

  const handleUpload = () => {
    // console.log('uploadObj:', uploadObj.current.getFilesData())

    if (uploadObj.current.getFilesData().length > 0) {
      //Progress show
      setLoading(true)

      const formData = new FormData()
      const uploadFiles = uploadObj.current.getFilesData()

      for (const i in uploadFiles) {
        formData.append('files', uploadFiles[i].rawFile)
      }

      axios
        .post('http://220.94.157.27:59871' + '/api/tag/uploadfile', formData, {
          headers: {
            'Content-Type': `multipart/form-data;`,
          },
        })
        .then(
          (response) => {
            // console.log('uploadfile RESP:', response)
            setSummaryResult(response.data)
            console.log('summary data:', response.data)

            setLoading(false)
            if (response.status === 200) {
              if (response.data.length > 0) {
              }
            }
          },
          (error) => {
            console.log('error:', error)
            setLoading(false)
            alert(error)
          }
        )
    } else {
      alert('업로드할 파일이 없습니다')
    }
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
                // success={onSuccess}
                // progress={onFileUpload}
                allowedExtensions=".xls,.xlsx,.csv"
                removing={onRemoveFile.bind(this)}
                asyncSettings={asyncSettings}
                maxFileSize={100000000} //100MB
              ></UploaderComponent>
              <p>Allowed file extensions : .xls(x), .csv</p>
              <div style={{ textAlign: 'right' }}>
                {loading ? (
                  <CircularProgress isIndeterminate color="green.300" />
                ) : (
                  <Button colorScheme="teal" variant="ghost" onClick={handleUpload}>
                    Upload
                  </Button>
                )}
              </div>

              {summaryResult.length > 0 && (
                <div style={{ marginTop: '100px' }}>
                  {summaryResult.length > 0 && <DataSummary dataSource={summaryResult} />}

                  <div style={{ textAlign: 'right' }}>
                    {' '}
                    <Button colorScheme="teal" variant="ghost" onClick={handleConfirm}>
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploader
