import { Icon } from '@chakra-ui/react'
import { Tooltip } from 'antd'

interface InfoCircleProps {
  content: string
  styleClass?: string
}

const InfoCircle = ({ content, styleClass }: InfoCircleProps) => {
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
