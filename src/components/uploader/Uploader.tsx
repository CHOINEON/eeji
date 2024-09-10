import { ReadOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button } from 'antd'
import ico_upload_button from 'assets/img/dataAnalysis/upload_circle.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { importModalAtom } from 'views/AIModelGenerator/store/modal/atom'

/**https://www.filestack.com/fileschool/react/react-file-upload/ */
const Uploader = (props: any) => {
  const { t } = useTranslation()
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

    e.target.value = '' //실제 data가 변경될 경우에만 동작하기 때문에 발생하는 버그 방지
  }

  //triggers when file is selected with click
  const handleUploadClick = () => {
    inputRef.current.click()
  }

  return (
    <UploadIconContainer>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept=".csv, .xls, .xlsx"
        id="input-file-upload"
      />
      <div ref={dragRef} className="text-center h-[400px] relative">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <label htmlFor="input-file-upload" className="text-center mt-3">
            <UploadButton onClick={handleUploadClick} />
            <div className="float-left my-3 text-center m-auto w-100">
              <a href="https://recruitineeji.notion.site/2-1-38ce1b102d834abba0f9653df1d918f9?pvs=4" target="_blank">
                <Button type="dashed" icon={<ReadOutlined />}>
                  {t('EEJI Upload Guide')}
                </Button>
              </a>
            </div>
          </label>
        </div>

        {/* {file && renderFileList()} */}
      </div>
    </UploadIconContainer>
  )
}

export default Uploader

const UploadIconContainer = styled.div`
  width: 100%;
`

const UploadButton = styled.button`
  width: 150px;
  height: 150px;
  background: transparent url(${ico_upload_button}) 0% 0% no-repeat padding-box;
  background-size: cover;
  opacity: 1;
`

const InfoLink = styled.button`
  font-family: 'Helvetica Neue';
  color: #002d65;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: #4338f7;
  }
`
