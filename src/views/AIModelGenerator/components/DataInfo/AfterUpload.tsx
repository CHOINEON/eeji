import { message } from 'antd'
import thumbnailImg from 'assets/img/dataAnalysis/thumbnail_circle.svg'
import ProgressbarSimple from 'components/progressbar/ProgressbarSimple'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { styled } from 'styled-components'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import DataProperties from './DataProperties'
import DataSummary from './DataSummary'

const AfterUpload = () => {
  const [modal, setModal] = useRecoilState(modalState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const progress = useRecoilValue(ProgressState)

  useEffect(() => {
    readFile(uploadedData.file)
  }, [])

  const readFile = (file: any) => {
    const fileReader = new FileReader()
    const fileFormat = file.name.split('.').pop()
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file.name) {
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result
          csvFileToArray(text)
        }

        fileReader.readAsText(file)
      } else {
        message.open({
          type: 'error',
          content: '지원하지 않는 파일 유형입니다.',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

    //Prepare iteration to classify numeric/non-numeric column list
    const sampleCnt = 10
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
  }

  const handleProgressComplete = () => {
    setTimeout(() => setModal(null), 1000)
  }

  return (
    <>
      <DatasetImageContainer>
        <div
          style={{
            position: 'absolute',
            width: '352px',
            marginTop: '10px',
          }}
        >
          <img src={thumbnailImg} style={{ margin: '0 auto' }} />
          <div>
            <DatasetName>{uploadedData.file?.name}</DatasetName>
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
    </>
  )
}

export default AfterUpload

const DatasetImageContainer = styled.div`
  // border: 1px solid grey;
  position: relative;
  width: 100%;
  height: 170px;
`

const DatasetName = styled.p`
  color: #002d65;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  margin-top: 10px;
`
