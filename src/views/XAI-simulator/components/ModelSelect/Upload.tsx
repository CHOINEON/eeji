import { CloseOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Label, UploadBtn, Wrapper } from 'components/fields/Wrapper'
import React, { useState, useRef, useEffect } from 'react'

interface ModelUploadProps {
  hidden?: boolean
  selectedFile: string
  label: string
  onChange?: any
  required?: boolean
}

const ModelUpload = (props: ModelUploadProps) => {
  const { selectedFile, label, onChange, required, hidden } = props
  const [file, setFile] = useState() //input 리렌더용(key값으로 사용)
  const inputRef = useRef(null)

  const handleChange = (e: any) => {
    setFile(e.target.files[0])
    onChange(e.target.files[0])
  }

  //triggers when file is selected with click
  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const handleRemove = () => {
    console.log('remove')
    onChange(undefined)
  }

  // useEffect(() => console.log('props:', props), [props])

  return (
    <>
      <Wrapper style={{ display: hidden ? 'none' : 'block' }}>
        <Label hasFileName={selectedFile ? true : false}>
          <span className={required ? 'text-red-500' : 'hidden'}>* </span>
          <span>{label}</span>
          <FileNameLabel hasFileName={selectedFile ? true : false}>
            <div>
              <span> {selectedFile} </span>
              <span role="button" onClick={handleRemove}>
                <CloseOutlined />
              </span>
            </div>
          </FileNameLabel>
        </Label>

        <label htmlFor="input-file">
          <UploadBtn onClick={handleUploadClick}>파일선택</UploadBtn>
        </label>
        <input
          key={file}
          style={{ display: 'none' }}
          ref={inputRef}
          type="file"
          onChange={handleChange}
          id="input-file"
        />
      </Wrapper>
    </>
  )
}

export default ModelUpload

const FileNameLabel = styled.div<{ hasFileName: boolean }>`
  display: ${(props: any) => (props.hasFileName ? 'block' : 'none')};
  font-size: 15px;
  color: #002d65;
  font-weight: bold;
  width: 100%;
`

const CloseButton = styled.button<{ hasFileName: boolean }>`
  //   display: ${(props: any) => (props.hasFileName ? 'block' : 'none')};
`
