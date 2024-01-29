import React from 'react'
import { CustomerServiceOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import useModal from 'hooks/useModal'
import { FloatButton } from 'antd'

const Feedback = () => {
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    openModal({
      modalTitle: "We'd love your feedback!",
      modalType: 'SendFeedback',
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  return <FloatButton icon={<CustomerServiceOutlined />} onClick={handleClick} style={{ right: 24 }} />
}

export default Feedback
