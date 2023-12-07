import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import DataProperties from './DataProperties'
import DataSummary from './DataSummary'
import thumbnailImg from 'assets/img/dataAnalysis/thumbnail_circle.svg'
import { useRecoilState } from 'recoil'
import { uploadedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { message, Spin } from 'antd'

const AfterUpload = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

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
    const fileFormat = file.name.split('.', 2)[1]
    const acceptedFormats = ['csv', 'xls', 'xlsx']

    if (file.name) {
      if (acceptedFormats.includes(fileFormat)) {
        fileReader.onload = function (event: any) {
          const text = event.target.result

          const content = csvFileToArray(file.name, file.size, text)
          console.log('content:', content)
          // setUploadedData({ ...uploadedData, content: content })
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
