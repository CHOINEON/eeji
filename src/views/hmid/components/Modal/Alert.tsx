import React from 'react'
import styled from '@emotion/styled'
import { Button, Modal } from 'antd'

const BlackBox = styled.div<{ view: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${(props: any) => (props.view ? 'block' : 'none')};
`

interface AlertProps {
  message: string
  ShowModal: boolean
  getCloseModal: (e: boolean) => void
}

export const Alert: React.FC<AlertProps> = (props: any) => {
  const [showModal, setShowModal] = React.useState(false)
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    setShowModal(props.ShowModal)
  }, [props.ShowModal])

  React.useEffect(() => {
    setMessage(props.message)
  }, [props.message])

  const hideModal = () => {
    setShowModal(false)
    props.getCloseModal(false)
  }

  return (
    <div>
      <BlackBox id="yunhee" view={showModal} />
      <Modal
        style={{ top: '6vw' }}
        title="알람"
        open={showModal}
        footer={[
          <Button key="OK" onClick={hideModal} style={{ backgroundColor: '#4338f7', color: 'white' }}>
            OK
          </Button>,
        ]}
      >
        <p>{message}</p>
      </Modal>
    </div>
  )
}
