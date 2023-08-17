import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import ico_upload_button from 'assets/img/ineeji/ico_upload_button.png'
import { Button } from 'antd'
import { useRecoilValue } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'

const UploadComponentWrapper = styled.div`
  // background: transparent url('img/사각형 2439.png') 0% 0% no-repeat padding-box;
  box-shadow: 0px 5px 20px #4338f733;
  border-radius: 18px;
  opacity: 1;
  padding: 1vw;
  margin-top: 1vw;
`

const UploadButton = styled.button`
  top: 278px;
  left: 703px;
  width: 176px;
  height: 176px;
  background: transparent url(${ico_upload_button}) 0% 0% no-repeat padding-box;
  opacity: 1;
`

/**https://www.filestack.com/fileschool/react/react-file-upload/ */
const Uploader = (props: any) => {
  const { onSelectedFile } = props
  const inputRef = useRef(null)
  const [file, setFile] = useState<File>(null)
  const importOpen = useRecoilValue(importModalAtom)

  useEffect(() => {
    if (!importOpen) {
      setFile(null)
    }
  }, [importOpen])

  useEffect(() => {
    //내보내기
    if (file) onSelectedFile(file)
  }, [file])

  const handleChange = (event: any) => {
    // console.log('handleChange', event)
    setFile(event.target.files[0])
  }

  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const renderFileList = () => {
    return (
      <>
        <div>파일명 : {file.name}</div>
        <div>
          크기 :{' '}
          {file.size / 1024 < 1024 ? Math.round(file.size / 1024) + ' KB' : Math.round(file.size / 1024 / 1024) + ' MB'}
        </div>
      </>
    )
  }

  return (
    <div className="App">
      {/* <form onSubmit={handleSubmit}> */}
      <UploadComponentWrapper>
        <input
          style={{ display: 'none' }}
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept=".csv, .xls, .xlsx"
        />
        <div className="flex-container">
          <div style={{ flex: 1 }}>
            <UploadButton style={{ float: 'left' }} onClick={handleUploadClick} />
          </div>
          <div style={{ padding: '10px', width: '70%', float: 'left' }}>
            <p style={{ color: '#002D65', fontSize: '20px', fontWeight: 'bold', float: 'left', width: '100%' }}>
              Upload Dataset
            </p>
            {file && renderFileList()}
          </div>
        </div>
      </UploadComponentWrapper>
      {/* </form> */}
    </div>
  )
}

export default Uploader
