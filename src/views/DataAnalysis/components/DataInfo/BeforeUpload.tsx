import { message } from 'antd'
import Banner from 'components/card/Banner'
import Uploader from 'components/uploader/Uploader'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { uploadedDataState } from 'views/DataAnalysis/store/dataset/atom'

const BeforeUpload = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const [dataArray, setDataArray] = useState([])
  const resetUploadFileState = useResetRecoilState(uploadedDataState)

  useEffect(() => {
    console.log('uploaded data:', uploadedData)
  }, [uploadedData])

  //컴포넌트 unmounted 상태로 바뀌면서 실행 타이밍 늦어짐
  // const readFile = (file: any) => {
  //   console.log('readfile:', file)
  //   // console.log('type:', file.name.split('.', 2)[1])

  //   const fileReader = new FileReader()

  //   const fileFormat = file.name.split('.', 2)[1]
  //   const acceptedFormats = ['csv', 'xls', 'xlsx']

  //   if (file.name) {
  //     if (acceptedFormats.includes(fileFormat)) {
  //       fileReader.onload = function (event: any) {
  //         const text = event.target.result

  //         const content = csvFileToArray(file.name, file.size, text)
  //         console.log('111:', content)
  //         console.log('222:', uploadedData)
  //         // setUploadedData({ ...uploadedData, content: content })
  //       }
  //       console.log('read as text')
  //       fileReader.readAsText(file)
  //     } else {
  //       message.open({
  //         type: 'error',
  //         content: '지원하지 않는 파일 유형입니다.',
  //         duration: 1,
  //         style: {
  //           margin: 'auto',
  //         },
  //       })
  //     }
  //   }
  // }

  // const csvFileToArray = (name: string, size: number, string: string) => {
  //   const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
  //   const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')

  //   const array = csvRows.map((item) => {
  //     if (item != '') {
  //       const values = item.split(',')
  //       const obj = csvHeader.reduce((object: any, header, index) => {
  //         object[header] = values[index]
  //         return object
  //       }, {})
  //       return obj
  //     }
  //   })

  //   // setDataArray(array)
  //   // console.log('return:', array.splice(array.length - 1))
  //   return array.splice(array.length - 1) //split하면서 마지막 행에 빈 값 들어있어서 자름

  //   // setUploadedData({ ...uploadedData, content: array.splice(array.length - 1) })
  //   // console.log('array:', array)
  // }

  const handleSelectedFile = (file: any) => {
    console.log('handleSelectedFile:', file)

    if (file) {
      if (file.size <= 209715200) {
        setUploadedData({ ...uploadedData, file: file, name: file.name, content: [] })
        // readFile(file)
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
  }

  const handleCancelClick = () => {
    // console.log('param:', param)
    resetUploadFileState()
  }

  return (
    <>
      <Uploader onSelectedFile={handleSelectedFile} onCancelClick={handleCancelClick} />
      <Banner />
    </>
  )
}

export default BeforeUpload
