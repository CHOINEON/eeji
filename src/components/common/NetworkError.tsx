import { Button, Result } from 'antd'
import React from 'react'

const NetworkError = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={<Button type="primary">Back Home</Button>}
    />
  )
}

export default NetworkError
