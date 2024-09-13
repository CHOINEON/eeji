import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

const InfoCircle = ({ content, styleClass }: any) => {
  const defaultClass = `mx-2 text-[15px]`

  return (
    <>
      <Tooltip title={content}>
        <QuestionCircleOutlined className={`${defaultClass} ${styleClass || ''}`} />
      </Tooltip>
    </>
  )
}

export default InfoCircle
