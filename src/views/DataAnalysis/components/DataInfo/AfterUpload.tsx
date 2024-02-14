import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import DataProperties from './DataProperties'
import DataSummary from './DataSummary'
import thumbnailImg from 'assets/img/dataAnalysis/thumbnail_circle.svg'
import { useRecoilState, useRecoilValue } from 'recoil'
import { uploadedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { message, Spin } from 'antd'
import languageEncoding from 'detect-file-encoding-and-language'
import jschardet from 'jschardet'
import { ProgressState } from 'stores/progress'

const AfterUpload = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const [encoding, setEncoding] = useState('UTF-8')
  const progress = useRecoilValue(ProgressState)

  useEffect(() => {
    // console.log('after upload:', uploadedData)
    //처음 로드할 때 안에 content 파싱해서 넣음
    if (uploadedData.file) {
      if (uploadedData.file.size <= 209715200) {
        setUploadedData({ ...uploadedData, file: uploadedData.file, name: uploadedData.file.name, content: [] })
        onDetectEncoding(uploadedData.file)
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

  useEffect(() => {
    console.log('After upload progress:', progress)
  }, [progress])

  async function getEncoding(file: any) {
    const fileInfo = await languageEncoding(file)
    console.log('fileinfo', fileInfo)
    setEncoding(fileInfo.encoding)
    return fileInfo.encoding
  }

  const onDetectEncoding = (file: any) => {
    const fileReader = new FileReader()

    if (file.name) {
      fileReader.onload = (e: any) => {
        const csvResult = e.target.result.split('/\r|\n|\r\n/')[0]
        // console.log('csvResult', csvResult)
        // console.log('result:', jschardet.detect(csvResult))
      }
    }
    fileReader.readAsBinaryString(file)
  }

  const readFile = (file: any) => {
    const fileReader = new FileReader()
    const fileFormat = file.name.split('.').pop()
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file.name) {
      // const encodingOption = async () => {
      //   const encoding = await getEncoding()
      //   console.log('encoding:', encoding)
      // }
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result

          csvFileToArray(file.name, file.size, text)
          // console.log('content:', content)
          // setUploadedData({ ...uploadedData, content: content })
        }
        // const encoding = getEncoding(file)
        // console.log('encoding:', encoding)

        // console.log('encoding:', fileInfo ? fileInfo : 'utf8')
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
    // const decoder = new TextDecoder('utf-8')

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

    // setDataArray(array)
    // console.log('content update:', array.slice(0, -1))
    // return array.splice(array.length - 1) //split하면서 마지막 행에 빈 값 들어있어서 자름

    setUploadedData({ ...uploadedData, content: array.slice(0, -1) })
  }

  return (
    <>
      <DatasetImageContainer>
        <div
          style={{
            // border: '1px solid red',
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
      <DataProperties />
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
