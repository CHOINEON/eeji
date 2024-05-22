import { message } from 'antd'
import thumbnailImg from 'assets/img/dataAnalysis/thumbnail_circle.svg'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState } from 'stores/modal'
import { ProgressState } from 'stores/progress'
import { styled } from 'styled-components'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import DataSummary from './DataSummary'

const AfterUpload = () => {
  const [modal, setModal] = useRecoilState(modalState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const progress = useRecoilValue(ProgressState)

  useEffect(() => {
    //처음 로드할 때 안에 content 파싱해서 넣음
    if (uploadedData.file) {
      if (uploadedData.file.size <= 209715200) {
        setUploadedData({ ...uploadedData, file: uploadedData.file, name: uploadedData.file.name, content: [] })
        readFile(uploadedData.file)
      } else {
        message.open({
          type: 'error',
          content: '업로드 가능 파일용량 초과(최대 200MB)',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }, [])

  const readFile = (file: any) => {
    const fileReader = new FileReader()
    const fileFormat = file.name.split('.').pop()
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file.name) {
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result
          csvFileToArray(file.name, file.size, text)
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

  const csvFileToArray = (name: string, size: number, string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

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
    setUploadedData({ ...uploadedData, content: array.slice(0, -1) })
  }

  const handleProgressComplete = () => {
    setTimeout(() => setModal(null), 2000)
  }

  return (
    <>
      <DatasetImageContainer>
        <div className="absolute w-[352px] mt-[10px]">
          <img src={thumbnailImg} style={{ margin: '0 auto' }} />
          <div>
            <DatasetName>{uploadedData.file?.name}</DatasetName>
            <p className="text-center text-gray-600 text-[12px]">{Math.round(uploadedData.file?.size / 1024)} KB</p>
          </div>
        </div>
      </DatasetImageContainer>
      <DataSummary />
      {/* {progress.percent === 0 ? (
        <DataProperties />
      ) : (
        <ProgressbarSimple currentValue={progress.percent} maxValue={100} onCompleted={handleProgressComplete} />
      )} */}
    </>
  )
}

export default AfterUpload

const DatasetImageContainer = styled.div`
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
