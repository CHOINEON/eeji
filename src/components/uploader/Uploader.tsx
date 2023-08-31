import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import ico_upload_button from 'assets/img/ineeji/ico_upload_button.png'
import { Button } from 'antd'
import { useRecoilValue } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import Title from 'antd/es/typography/Title'

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
  const dragRef = useRef<HTMLButtonElement>(null)
  const importOpen = useRecoilValue(importModalAtom)
  // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useEffect(() => {
    if (!importOpen) {
      setFile(null)
    }
  }, [importOpen])

  useEffect(() => {
    //내보내기
    if (file) onSelectedFile(file)
  }, [file])

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer!.files) {
      setIsDragging(true)
    }
  }, [])

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    // console.log('handle drop:', e)

    //button에 drop해서 생긴 이벤트를 input의 onchange 이벤트로 전달해준
    handleChange(e)
    setIsDragging(false)
  }

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn)
      dragRef.current.addEventListener('dragleave', handleDragOut)
      dragRef.current.addEventListener('dragover', handleDragOver)
      dragRef.current.addEventListener('drop', handleDrop)
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop])

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn)
      dragRef.current.removeEventListener('dragleave', handleDragOut)
      dragRef.current.removeEventListener('dragover', handleDragOver)
      dragRef.current.removeEventListener('drop', handleDrop)
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop])

  useEffect(() => {
    initDragEvents()

    return () => resetDragEvents()
  }, [initDragEvents, resetDragEvents])

  const handleChange = (e: any) => {
    // console.log('handleChange', e)

    e.preventDefault()
    e.stopPropagation()
    setFile(e.target.files[0])
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
            <UploadButton ref={dragRef} style={{ float: 'left' }} onClick={handleUploadClick} />
          </div>
          <div style={{ padding: '10px', width: '70%', float: 'left' }}>
            <Title level={4} style={{ color: '#002D65' }}>
              Upload Dataset
            </Title>
            {/* <p style={{ color: '#002D65', fontSize: '18px', float: 'left', width: '100%' }}>Upload Dataset</p> */}
            {file && renderFileList()}
          </div>
        </div>
      </UploadComponentWrapper>
      {/* </form> */}
    </div>
  )
}

export default Uploader
