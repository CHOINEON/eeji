import { message } from 'antd'
import Banner from 'components/card/Banner'
import Uploader from 'components/uploader/Uploader'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

const BeforeUpload = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const resetUploadFileState = useResetRecoilState(uploadedDataState)

  const handleSelectedFile = (file: File) => {
    if (file) {
      if (file.size <= Number(process.env.REACT_APP_MAX_FILE_SIZE)) {
        setUploadedData({ ...uploadedData, file: file, objectName: generateObjectName(file.name) })
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
