import { Icon } from '@chakra-ui/react'
import { Tooltip } from 'antd'
import React from 'react'

const InfoCircle = ({ content }: any) => {
  return (
    <>
      <Tooltip title={content}>
        <Icon type="info-circle-o" style={{ margin: '0 10px', fontSize: '15px', color: 'grey' }} />
      </Tooltip>
    </>
  )
}

export default InfoCircle
