import { Button, message } from 'antd'
import useModal from 'hooks/useModal'
import CustomerService from './../icons/CustomerService.png'

const Feedback = () => {
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    message.info('서비스 점검 중입니다.')
    // openModal({
    //   modalTitle: "We'd love your feedback!",
    //   modalType: 'SendFeedback',
    //   modalProps: {
    //     onClick: () => {
    //       closeModal()
    //     },
    //   },
    // })
  }

  return (
    <div className="flex justify-center items-center">
      <Button
        onClick={handleClick}
        style={{
          width: '82px',
          height: '30px',
          backgroundImage: `url(${CustomerService})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></Button>
    </div>
  )
}

export default Feedback
