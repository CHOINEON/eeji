import { message } from 'antd'
import Banner from 'components/card/Banner'
import Uploader from 'components/uploader/Uploader'
import languageEncoding from 'detect-file-encoding-and-language'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

const BeforeUpload = () => {
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const resetUploadFileState = useResetRecoilState(uploadedDataState)

  const handleSelectedFile = (file: File) => {
    if (file) {
      languageEncoding(file).then((fileInfo) => setUploadedData({ encoding: fileInfo.encoding }))

      //현재 업로드 용량 제한 400MB로 설정(FileReader에서 contents를 읽는 최대 사이즈가 512MB이고, 400MB를 넘는 경우 브라우저 부하에 따라 멈추는 경우가 있어 400으로 제한 / 24-07-08)
      if (file.size <= 419430400) {
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
