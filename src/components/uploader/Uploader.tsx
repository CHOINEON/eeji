import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import ico_upload_button from 'assets/img/ineeji/ico_upload_button.png'
import { useRecoilValue } from 'recoil'
import { importModalAtom } from 'views/DataAnalysis/store/modal/atom'
import Title from 'antd/es/typography/Title'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const UploadComponentWrapper = styled.div`
  // background: transparent url('img/사각형 2439.png') 0% 0% no-repeat padding-box;
  box-shadow: 0px 5px 20px #4338f733;
  border-radius: 18px;
  opacity: 1;
  padding: 1vw;
  margin-top: 1vw;
`

const UploadButton = styled.button`
  // top: 278px;
  // left: 703px;
  width: 150px;
  height: 150px;
  background: transparent url(${ico_upload_button}) 0% 0% no-repeat padding-box;
  background-size: cover;
  opacity: 1;
`

/**https://www.filestack.com/fileschool/react/react-file-upload/ */
const Uploader = (props: any) => {
  const { onSelectedFile, onCancelClick } = props

  const inputRef = useRef(null)
  const dragRef = useRef(null)

  const [file, setFile] = useState<File>(null)
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
    onSelectedFile(file)
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

  //triggers when file is dropped
  const handleDrop = (e: DragEvent): void => {
    // console.log('handle drop:', e)
    e.preventDefault()
    e.stopPropagation()

    //button에 drop해서 생긴 이벤트를 input의 onchange 이벤트로 전달해
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
    // console.log('handle Change:', e)

    if (e.type === 'drop') {
      e.preventDefault()
      e.stopPropagation()

      setFile(e.dataTransfer.files[0])
    } else if (e.type === 'change') {
      setFile(e.target.files[0])
    }
  }

  //triggers when file is selected with click
  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const handleCancel = () => {
    onCancelClick()
    setFile(null)
  }

  const renderFileList = () => {
    return (
      <>
        <div>
          파일명 : {file.name} <CloseOutlined onClick={handleCancel} />
        </div>
        <div>
          크기 :{' '}
          {file.size / 1024 < 1024 ? Math.round(file.size / 1024) + ' KB' : Math.round(file.size / 1024 / 1024) + ' MB'}
        </div>
      </>
    )
  }

  return (
    <div className="App">
      <UploadComponentWrapper>
        <input
          style={{ display: 'none' }}
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept=".csv, .xls, .xlsx"
          id="input-file-upload"
        />
        <div className="flex-container">
          <div style={{ flex: 1 }}>
            <label htmlFor="input-file-upload" ref={dragRef}>
              <UploadButton onClick={handleUploadClick} />
            </label>
          </div>
          <div style={{ padding: '10px', width: '70%', float: 'left' }}>
            <Title level={4} style={{ color: '#002D65' }}>
              Upload Dataset
            </Title>
            {file && renderFileList()}
          </div>
        </div>
      </UploadComponentWrapper>
    </div>
  )
}

export default Uploader
