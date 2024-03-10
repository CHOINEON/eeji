import React from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import useModal from 'hooks/useModal'
import { Button } from 'antd'
import CustomerService from './../icons/CustomerService.png'

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

  return (
    <Button
      onClick={handleClick}
      style={{
        top: '17px',
        left: '1609px',
        width: '82px',
        height: '30px',
        backgroundImage: `url(${CustomerService})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    ></Button>
  )
}

export default Feedback
