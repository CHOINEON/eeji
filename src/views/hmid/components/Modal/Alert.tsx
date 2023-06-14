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
  z-index: 9998;
  display: ${(props: any) => (props.view ? 'block' : 'none')};
`

import { useRecoilState, useRecoilValue } from 'recoil'
import { AlertModalState, AlertMessageState } from 'views/hmid_config/recoil/config/atoms'

export const Alert: React.FC = () => {
  const [showAlertModal, setShowAlertModal] = useRecoilState(AlertModalState)
  const alertMessage = useRecoilValue(AlertMessageState)

  const hideModal = () => {
    setShowAlertModal(false)
  }

  return (
    <div>
      <BlackBox id="yunhee" view={showAlertModal} />
      <Modal
        style={{ top: '6vw' }}
        title="알람"
        open={showAlertModal}
        footer={[
          <Button key="OK" onClick={hideModal} style={{ backgroundColor: '#4338f7', color: 'white' }}>
            OK
          </Button>,
        ]}
      >
        <p>{alertMessage}</p>
      </Modal>
    </div>
  )
}
