import { Button } from '@mui/material'
import React from 'react'

const NewFileUploader = () => {
  const handleChange = () => {
    //file uploaded
  }

  const handleClick = () => {
    //upload
  }

  return (
    <>
      <div style={{ display: 'block', border: '1px solid gray', width: '100px', height: '20px' }}>
        <input type="file" onChange={handleChange} />
        <Button onClick={handleClick} />
      </div>
    </>
  )
}

export default NewFileUploader
