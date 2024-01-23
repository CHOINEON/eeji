import { CloseCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button } from 'antd'
import { Label, UploadBtn, Wrapper } from 'components/fields/Wrapper'
import React, { useState, useRef, useEffect } from 'react'

interface ModelUploadProps {
  selectedFile: string
  label: string
  onChange?: any
}

const ModelUpload = (props: ModelUploadProps) => {
  const { selectedFile, label, onChange } = props
  const inputRef = useRef(null)

  const handleChange = (e: any) => {
    onChange(e.target.files[0])
  }

  //triggers when file is selected with click
  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const handleRemove = () => {
    //
  }

  // useEffect(() => console.log('props:', props), [props])

  return (
    <>
      <Wrapper>
        <Label hasFileName={selectedFile ? true : false}>
          {label}
          <FileNameLabel hasFileName={selectedFile ? true : false}>
            <div>
              <span> {selectedFile} </span>
              <span onClick={handleRemove}>
                <CloseCircleOutlined />
              </span>
            </div>
          </FileNameLabel>
        </Label>

        <label htmlFor="input-file">
          <UploadBtn onClick={handleUploadClick}>파일선택</UploadBtn>
        </label>
        <input
          style={{ display: 'none' }}
          ref={inputRef}
          type="file"
          onChange={handleChange}
          // accept=".pickle,.py"
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
