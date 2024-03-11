import { Icon } from '@chakra-ui/react'
import { Tooltip } from 'antd'
import React from 'react'

const InfoCircle = ({ content, color }: any) => {
  const fontColor = color ? color : '#000000'

  return (
    <>
      <Tooltip title={content}>
        <Icon type="info-circle-o" style={{ margin: '0 10px', fontSize: '15px', color: fontColor }} />
      </Tooltip>
    </>
  )
}

export default InfoCircle
