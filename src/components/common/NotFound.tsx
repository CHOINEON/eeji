import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'
import { Box } from '@chakra-ui/react'

const NotFound = () => {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </Box>
  )
}

export default NotFound
