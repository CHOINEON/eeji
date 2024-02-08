import React, { useEffect, useState } from 'react'
import logo_xs from 'assets/img/ineeji/logo_xs.svg'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import UserModelImport from '../../views/XAI-simulator/components/UserModelImport'
import { Modal } from 'antd'
import SendFeedback from '../../views/Main/SendFeedback'
import DataImportModal from '../../views/DataAnalysis/components/DataInfo/DataImportModal'
import SavedModelImport from '../../views/XAI-simulator/components/SavedModelImport'

export const MODAL_TYPES = {
  UserModelImport: 'UserModelImport',
  SavedModelImport: 'SavedModelImport',
  DataImport: 'DataImport',
  SendFeedback: 'SendFeedback',
}

const ModalComponents: any = {
  [MODAL_TYPES.DataImport]: DataImportModal,
  [MODAL_TYPES.UserModelImport]: UserModelImport,
  [MODAL_TYPES.SavedModelImport]: SavedModelImport,
  [MODAL_TYPES.SendFeedback]: SendFeedback,
}

const GlobalModal = () => {
  const [modal, setModal] = useRecoilState(modalState)
  const { modalType, modalProps, modalTitle } = modal || {}

  // useEffect(() => {
  //   console.log('GlobalModal:', modal)
  // }, [modal])

  const renderComponent = () => {
    // console.log('modalType:', modalType)

    if (!modalType) {
      return null
    }
    const ModalComponent = ModalComponents[modalType]

    return (
      <Modal
        className="rounded-corners"
        width="400px"
        open={true}
        onCancel={() => setModal(null)}
        title={
          <>
            <img style={{ margin: '10px 0 5px 0' }} src={logo_xs} />
            <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: 30 }}>{modalTitle}</p>
          </>
        }
        footer={null}
      >
        {ModalComponent && <ModalComponent {...modalProps} />}
      </Modal>
    )
  }

  return <>{renderComponent()}</>
}

export default GlobalModal

// const Modal = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 9;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

// const Overlay = styled.div`
//   background-color: rgba(0, 0, 0, 0.8);
//   /* -webkit-backdrop-filter: blur(5px);
//   backdrop-filter: blur(5px); */
//   position: absolute;
//   width: 100%;
//   height: 100%;
// `

// const Container = styled.div`
//   z-index: 10;
//   width: 100%;
//   max-width: 400px;
//   margin: 36px;
//   height: 360px;
//   background-color: white;
//   border-radius: 8px;

//   box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.25);
// `
