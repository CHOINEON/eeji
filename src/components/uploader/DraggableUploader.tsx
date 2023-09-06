import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import ico_upload_button from 'assets/img/ineeji/ico_upload_button.png'
import styled from '@emotion/styled'

const UploadButton = styled.div`
  top: 278px;
  left: 703px;
  width: 176px;
  height: 176px;
  background: transparent url(${ico_upload_button}) 0% 0% no-repeat padding-box;
  opacity: 1;
`
interface IFileTypes {
  id: number // 파일들의 고유값 id
  object: File
}

const DraggableUploader = () => {
  const inputRef = useRef(null)
  const dragRef = useRef(null)

  const [isDragging, setIsDragging] = useState<boolean>()
  const [files, setFiles] = useState<IFileTypes[]>([])

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      //test
    },
    [files]
  )

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

  const handleDrop = useCallback(
    (e: any): void => {
      e.preventDefault()
      e.stopPropagation()

      console.log('e::', e)
      onChangeFiles(e)
      setIsDragging(false)
    },
    [onChangeFiles]
  )

  const initDragEvents = useCallback((): void => {
    // 앞서 말했던 4개의 이벤트에 Listener를 등록합니다. (마운트 될때)

    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn)
      dragRef.current.addEventListener('dragleave', handleDragOut)
      dragRef.current.addEventListener('dragover', handleDragOver)
      dragRef.current.addEventListener('drop', handleDrop)
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop])

  const resetDragEvents = useCallback((): void => {
    // 앞서 말했던 4개의 이벤트에 Listener를 삭제합니다. (언마운트 될때)

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

  return (
    <>
      <input ref={inputRef} id="file-input" type="file" accept=".csv, .xls, .xlsx" hidden />
      <label ref={dragRef} htmlFor="file-input" onDrop={handleDrop}>
        <div>
          <span>Drag and drop your file here</span>
        </div>
        <div>
          <span>or</span>
        </div>
      </label>
    </>
  )
}

export default DraggableUploader
