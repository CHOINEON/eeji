import React, { useState, useRef, useEffect } from 'react'
import { RemovingEventArgs, UploaderComponent } from '@syncfusion/ej2-react-inputs'
import axios from 'axios'
import DataSummary from '../../views/DataAnalysis/components/DataInfo/DataSummary'
import styled from '@emotion/styled'
import ArrowDownward from 'assets/img/dataAnalysis/arrow_downward.png'
import { Button } from 'antd'

const DataSummaryDiv = styled.div<{ toggle: any }>`
  display: ${(props: any) => (props.toggle ? 'block' : 'none')};
`

const UploadWrapperDiv = styled.div<{ uploaded: any }>`
  width: 100%;
  float: left;
  margin: auto;
  display: ${(props: any) => (props.uploaded ? 'block' : 'none')};
`

const FileUploader = (props: any) => {
  const { onUploaded, refresh, onSaved, reqParams, type } = props

  const uploadObj = useRef<UploaderComponent>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(false)
  const [summaryResult, setSummaryResult] = useState([])

  useEffect(() => {
    // console.log('FileUploader props::', props)
    clearSelection()
  }, [refresh])

  // useEffect(() => {
  //   console.log('refresh:', refresh)
  //   if (refresh) {
  //     uploadObj.current.clearAll()
  //     setSelected(false)
  //     setSummaryResult([])
  //   }
  // }, [refresh])

  const clearSelection = () => {
    uploadObj.current.clearAll()
    setSelected(false)
    setSummaryResult([])
  }

  const asyncSettings: object = {
    chunkSize: 100000000, // set chunk size for enable the chunk upload
  }

  function onRemoveFile(args: RemovingEventArgs): void {
    args.postRawFile = false
  }

  const handleSelect = (event: any) => {
    // console.log('handleSelect:', event.filesData[0].rawFile)

    const readFile = (file: any) => {
      const fileReader = new FileReader()

      if (file) {
        fileReader.onload = function (event: any) {
          const text = event.target.result
          csvFileToArray(file.name, file.size, text)
        }

        fileReader.readAsText(file)
      }
    }

    readFile(event.filesData[0].rawFile)
  }

  const csvFileToArray = (name: string, size: number, string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    // console.log('csvRows:', csvRows)

    const array = csvRows.map((item) => {
      if (item != '') {
        const values = item.split(',')
        const obj = csvHeader.reduce((object: any, header, index) => {
          object[header] = values[index]
          return object
        }, {})
        return obj
      }
    })

    //split하면서 마지막 행에 빈 값 들어있어서 자름
    array.splice(array.length - 1)

    //min & max datetime 찾기
    const dateColumnName = Object.keys(array[0])[0]
    const newArr = array.map((obj) => {
      return { ...obj, dateTime: new Date(obj[dateColumnName]) } //0번째 컬럼 : 날짜
    })

    // console.log('newArr:', newArr)

    //Sort in Ascending order(low to high)
    //https://bobbyhadz.com/blog/javascript-sort-array-of-objects-by-date-property
    const sortedAsc = newArr.sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
    // console.log('sortedAsc:', sortedAsc)

    const summary = []
    const lengthOfArray = array.length

    summary.push({
      name: name,
      size: Math.round(size / 1024),
      rowCount: sortedAsc.length,
      colCount: Object.keys(sortedAsc[0]).length,
      startDate: dateTimeToString(sortedAsc[0].dateTime),
      endDate: dateTimeToString(sortedAsc[lengthOfArray - 1].dateTime),
    })

    // console.log('summary:', summary)
    setSummaryResult(summary)
    setSelected(true)
  }

  const dateTimeToString = (date: any) => {
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day : '0' + day
    hour = hour >= 10 ? hour : '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second : '0' + second

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }

  const handleSave = () => {
    if (uploadObj.current.getFilesData().length > 0) {
      setLoading(true)

      const formData = new FormData()
      const uploadFiles = uploadObj.current.getFilesData()

      // console.log('uploadFiles:', uploadFiles)
      // console.log('reqParams:', reqParams)
      if (type === 'TRAIN') {
        for (const i in uploadFiles) {
          formData.append('com_id', localStorage.getItem('companyId'))
          formData.append('name', uploadFiles[0].name)
          formData.append('files', uploadFiles[i].rawFile)
        }

        axios
          .post(process.env.REACT_APP_API_SERVER_URL + '/api/upload', formData, {
            headers: {
              'Content-Type': `multipart/form-data;`,
            },
          })
          .then(
            (response) => {
              // console.log('UPLOAD RESP :', response)
              setLoading(false)

              if (response.status === 200) {
                onSaved(summaryResult)
              }
            },
            (error) => {
              // console.log('error:', error)
              setLoading(false)
              alert(error)
            }
          )
      } else if (type === 'TEST') {
        // console.log('uploadFiles[0].rawFile:', uploadFiles[0].rawFile)

        // const modelArr = []
        // modelArr.push(reqParams.data.model_id)

        // const modelArr = new Array(reqParams.data.model_id.toString())

        // for (const i in modelArr) {
        //   formData.append('com_id', localStorage.getItem('companyId'))
        //   formData.append('model_id', modelArr[i])
        //   formData.append('file', uploadFiles[0].rawFile) //single file
        // }

        onSaved(uploadFiles[0].rawFile)

        // axios
        //   .post(process.env.REACT_APP_API_SERVER_URL + '/api/predict/model/chart', formData, {
        //     headers: {
        //       'Content-Type': `multipart/form-data;`,
        //     },
        //   })
        //   .then(
        //     (response) => {
        //       console.log('/api/predict/model/chart RESP :', response)

        //     },
        //     (error) => {
        //       setLoading(false)
        //       alert(error)
        //     }
        //   )
      }
    } else {
      alert('업로드할 파일이 없습니다')
      // setMessage('업로드할 파일이 없습니다')
      // setShowAlertModal(true)
    }
  }

  return (
    <div className="control-section col-lg-12 defaultDialog dialog-target">
      <div className="control-pane">
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
                selected={handleSelect}
              ></UploaderComponent>
              <p>Allowed file extensions : .xls(x), .csv</p>

              <div style={{ marginBottom: '30px' }}>
                <DataSummaryDiv toggle={summaryResult.length > 0 ? true : false}>
                  <>
                    <div style={{ marginTop: '30px' }}>
                      <DataSummary data={summaryResult} />
                    </div>
                  </>
                </DataSummaryDiv>
                <div>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    style={{ float: 'right', maxWidth: '400px', margin: 'auto', display: selected ? 'block' : 'none' }}
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Alert ShowModal={showAlertModal} message={message} getCloseModal={getCloseAlertModal} /> */}
    </div>
  )
}

export default FileUploader
