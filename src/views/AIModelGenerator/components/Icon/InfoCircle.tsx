import { Icon } from '@chakra-ui/react'
import { Tooltip } from 'antd'

const InfoCircle = ({ content, styleClass }: any) => {
  const defaultClass = `mx-2 text-[15px]`

  return (
    <>
      <Tooltip title={content}>
        <Icon type="info-circle-o" className={`${defaultClass} ${styleClass || ''}`} />
      </Tooltip>
    </>
  )
}

export default InfoCircle
