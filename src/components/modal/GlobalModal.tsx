import React, { useEffect, useState } from 'react'
import logo_xs from 'assets/img/ineeji/logo_xs.svg'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import UserModelImport from '../../views/XAI-simulator/components/UserModelImport'
import { Modal } from 'antd'
import SendFeedback from '../../views/Main/SendFeedback'
import DataImportModal from '../../views/AIModelGenerator/components/DataInfo/DataImportModal'
import SavedModelImport from '../../views/XAI-simulator/components/SavedModelImport'
import ModelSaveModal from 'views/AIModelGenerator/components/Modal/ModelSaveModal'

export const MODAL_TYPES = {
  UserModelImport: 'UserModelImport',
  SavedModelImport: 'SavedModelImport',
  DataImport: 'DataImport',
  SendFeedback: 'SendFeedback',
  ModelSave: 'SaveModel',
}

const ModalComponents: any = {
  [MODAL_TYPES.DataImport]: DataImportModal,
  [MODAL_TYPES.UserModelImport]: UserModelImport,
  [MODAL_TYPES.SavedModelImport]: SavedModelImport,
  [MODAL_TYPES.SendFeedback]: SendFeedback,
  [MODAL_TYPES.ModelSave]: ModelSaveModal,
}

const GlobalModal = () => {
  const [modal, setModal] = useRecoilState(modalState)
  const { modalType, modalProps, modalTitle } = modal || {}

  // useEffect(() => {
  //   console.log('GlobalModal:', modalProps)
  // }, [modalProps])

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
