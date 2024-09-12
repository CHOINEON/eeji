import { Button } from 'antd'
import useModal from 'hooks/useModal'
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
    <div className="flex justify-center items-center">
      <Button
        onClick={handleClick}
        style={{
          // position: 'absolute',
          // top: '17px',
          // left: '1609px',
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
