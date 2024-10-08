import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'

interface InfoCircleProps {
  content: string | unknown
  styleClass?: string
  placement?: string
}

const InfoCircle = ({ content, styleClass, placement }: InfoCircleProps) => {
  const defaultClass = `mx-1 text-[14px]`

  return (
    <>
      <Tooltip title={content} placement={placement as TooltipPlacement}>
        <QuestionCircleOutlined className={`${defaultClass} ${styleClass || ''}`} />
      </Tooltip>
    </>
  )
}

export default InfoCircle
