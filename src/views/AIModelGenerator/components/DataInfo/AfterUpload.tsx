import { App, Spin } from 'antd'
import thumbnailImg from 'assets/img/dataAnalysis/thumbnail_circle.svg'
import close_blue_icon from 'assets/img/icons/common/close_blue.png'
import ProgressbarSimple from 'components/progressbar/ProgressbarSimple'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { styled } from 'styled-components'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import * as XLSX from 'xlsx'
import DataProperties from './DataProperties'
import DataSummary from './DataSummary'

interface ILoadingState {
  isLoading: boolean
  message?: string
}

const AfterUpload = () => {
  const { message } = App.useApp()
  const progress = useRecoilValue(ProgressState)
  const setModal = useSetRecoilState(modalState)
  const resetUpload = useResetRecoilState(uploadedDataState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const [loading, setLoading] = useState<ILoadingState>({ isLoading: false, message: '' })

  useEffect(() => {
    readFile(uploadedData.file)
  }, [])

  const readFile = (file: any) => {
    setLoading({ isLoading: true, message: t('Loading data...') })

    const fileReader = new FileReader()
    const fileFormat: string = file.name.split('.').pop()

    if (file.name) {
      if (fileFormat.toLowerCase() === 'csv') {
        fileReader.onload = function (event: any) {
          const text = event.target.result

          if (text.length === 0) message.error(t('Failed to load data.'))
          else {
            if (new TextEncoder().encode(text).length > Number(process.env.REACT_APP_MAX_FILE_SIZE)) {
              message.info(t('The data is too large (maximum 400MB)'))
              setLoading({ isLoading: false })
            } else {
              csvFileToArray(text)
            }
          }
        }
        fileReader.readAsText(file)
      } else if (fileFormat.toLowerCase().includes('xls')) {
        fileReader.onload = (e) => {
          setLoading({ isLoading: false })

          const data = new Uint8Array(e.target?.result as ArrayBuffer) // Read as array buffer
          const workbook = XLSX.read(data, { type: 'array' })

          const sheetName = workbook.SheetNames[0] // Get first sheet
          const worksheet = workbook.Sheets[sheetName]

          const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 })
          xlsFileParser(jsonData)
        }

        fileReader.readAsArrayBuffer(file) // Read file as ArrayBuffer
      } else {
        message.open({
          type: 'error',
          content: t('The file type is not supported.'),
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
        setLoading({ isLoading: false })
      }
    }
  }

  // 24.07.10 업로드 파일 유효성 검증 부분 비활성화(엔진에서 처리 후 에러 반환하는 것으로 변경)
  // function fileValidationCheck(dataLength: number, headerLength: number) {
  //   if (dataLength < 100) {
  //     message.error(t('The data is too small. (Minimum 100 items)'))
  //     return false
  //   }

  //   if (dataLength > 100000) {
  //     message.error(t('The data is too large. (Maximum 100,000 items)'))
  //     return false
  //   }

  //   if (headerLength > 50) {
  //     message.error(t('There are too many variables. (Maximum 50 variables)'))
  //     return false
  //   }
  //   return true
  // }

  const xlsFileParser = (data: string[][]) => {
    const csvHeader = data[0]
    const csvRows = data.slice(1)

    //전체 데이터의 top10 샘플링하여 iteration to classify numeric/non-nuemric column list
    const sampleCnt = 10
    const sampleRows = csvRows.slice(0, sampleCnt)
    const numericColums = []
    const nonNumericColumns = []

    for (let i = 0; i < csvHeader.length; i++) {
      let isNumber = false

      for (let j = 0; j < sampleCnt; j++) {
        const selectedData = Number(sampleRows[j][i])

        if (isNaN(selectedData)) isNumber = false
        else isNumber = true
      }

      if (isNumber) numericColums.push(csvHeader[i])
      else nonNumericColumns.push(csvHeader[i])
    }

    type CsvObject = { [key: string]: string }

    const contentObjArray = csvRows.map((item) => {
      if (item.length > 0) {
        const obj = csvHeader.reduce((object: CsvObject, header, index) => {
          object[header] = item[index]
          return object
        }, {})
        return obj
      }
    })

    setUploadedData({
      ...uploadedData,
      columns: csvHeader,
      numericCols: numericColums,
      nonNumericCols: nonNumericColumns,
      content: contentObjArray,
      rowCount: data.length,
      colCount: csvHeader.length,
    })
  }

  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    //Prepare iteration to classify numeric/non-numeric column list
    const sampleCnt = 10 //only 10rows are tested
    const sampleRows = csvRows.slice(0, sampleCnt)
    const numericColums = []
    const nonNumericColumns = []

    for (let i = 0; i < csvHeader.length; i++) {
      let isNumber = false

      for (let j = 0; j < sampleRows.length; j++) {
        const selectedData = Number(sampleRows[j].split(',')[i])

        //테스트 추출한 row 돌면서 isNumber 결과 값 업데이트
        if (isNaN(selectedData)) isNumber = false
        else isNumber = true
      }

      if (isNumber) numericColums.push(csvHeader[i])
      else nonNumericColumns.push(csvHeader[i])
    }

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

    setUploadedData({
      ...uploadedData,
      columns: csvHeader,
      numericCols: numericColums,
      nonNumericCols: nonNumericColumns,
      content: array.slice(0, -1),
      rowCount: array.length,
      colCount: csvHeader.length,
    })

    setLoading({ isLoading: false })
  }

  const handleProgressComplete = () => {
    setTimeout(() => setModal(null), 1000)
  }

  const handleClose = () => {
    resetUpload()
  }

  return (
    <>
      <Spin tip={loading?.message} spinning={loading?.isLoading} style={{ marginTop: '80px' }}>
        <DatasetImageContainer>
          <div className="absolute w-100 mt-[10px]">
            <img src={thumbnailImg} style={{ margin: '0 auto' }} />
            <div className="mt-3">
              <div className="text-center">
                <DatasetName>{uploadedData.file?.name}</DatasetName>
                <button className="mx-1" onClick={handleClose}>
                  <img src={close_blue_icon} />
                </button>
              </div>
              <p className="text-center text-gray-600 text-[12px]">{Math.round(uploadedData.file?.size / 1024)} KB</p>
            </div>
          </div>
        </DatasetImageContainer>
        <DataSummary />
        {progress.percent === 0 ? (
          <DataProperties />
        ) : (
          <ProgressbarSimple currentValue={progress.percent} maxValue={100} onCompleted={handleProgressComplete} />
        )}
      </Spin>
    </>
  )
}

export default AfterUpload

const DatasetImageContainer = styled.div`
  // border: 1px solid grey;
  position: relative;
  width: 100%;
  height: 160px;
`

const DatasetName = styled.span`
  color: #002d65;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  margin-top: 10px;
`
