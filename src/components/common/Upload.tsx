import React from 'react'
import { Button } from 'antd'
import Upload from './../icons/Upload.png'

const UploadModel = () => {
  const handleClick = () => {
    //
  }

  return (
    <Button
      onClick={handleClick}
      type="primary"
      icon={<Upload />}
      style={{
        width: '82px',
        height: '30px',
      }}
    ></Button>
  )
}

export default UploadModel
