import { App } from 'antd'
import Banner from 'components/card/Banner'
import Uploader from 'components/uploader/Uploader'
import languageEncoding from 'detect-file-encoding-and-language'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

const BeforeUpload = () => {
  const { message } = App.useApp()
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const resetUploadFileState = useResetRecoilState(uploadedDataState)

  const handleSelectedFile = (file: File) => {
    if (file) {
      const fileFormat: string = file.name.split('.').pop()

      if (fileFormat.toLowerCase() === 'csv') {
        //현재 업로드 용량 제한 400MB로 설정(FileReader에서 contents를 읽는 최대 사이즈가 512MB이고, 400MB를 넘는 경우 브라우저 부하에 따라 멈추는 경우가 있어 400으로 제한 / 24-07-08)
        if (file.size <= Number(process.env.REACT_APP_MAX_FILE_SIZE)) {
          languageEncoding(file).then((fileInfo) => {
            if (fileInfo.encoding === 'UTF-8') {
              setUploadedData({
                ...uploadedData,
                file: file,
                objectName: generateObjectName(file.name),
                encoding: fileInfo.encoding,
              })
            } else {
              message.error(`UTF-8 형식의 파일만 처리 가능합니다. EEJI 업로드 가이드를 참고하세요.`)
            }
          })
        }
      } else if (fileFormat.toLowerCase().includes('xls')) {
        setUploadedData({
          ...uploadedData,
          file: file,
          objectName: generateObjectName(file.name),
          encoding: undefined,
        })
      } else {
        message.open({
          type: 'error',
          content: '업로드 가능 파일용량 초과(최대 400MB)',
          duration: 1,
          style: {
            margin: 'auto',
          },
        })
      }
    }
  }

  function generateObjectName(fileName: string) {
    const objName = `${localStorage.getItem('userId').toString()}_${fileName}_${Math.floor(
      new Date().getTime() / 1000
    )}`
    //Object Name Requirements (https://download.huihoo.com/google/gdgdevkit/DVD1/developers.google.com/storage/docs/bucketnaming.html)
    const reg = /[\[\]\t\n\r\#*/?]/gi

    return objName.replace(reg, '')
  }

  const handleCancelClick = () => {
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
