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
      if (file.size <= 209715200) {
        setUploadedData({ ...uploadedData, file: file })
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
