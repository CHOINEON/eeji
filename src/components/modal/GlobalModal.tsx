import { Modal } from 'antd'
import logo_xs from 'assets/img/ineeji/logo_xs.svg'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'
import ModelSaveModal from 'views/AIModelGenerator/components/Modal/ModelSaveModal'
import DataImportModal from '../../views/AIModelGenerator/components/Modal/DataImportModal'
import SendFeedback from '../../views/Main/SendFeedback'
import SavedModelImport from '../../views/XAI-simulator/components/SavedModelImport'
import UserModelImport from '../../views/XAI-simulator/components/UserModelImport'

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

  const renderComponent = () => {
    if (!modalType) {
      return null
    }
    const ModalComponent = ModalComponents[modalType]

    return (
      <Modal
        className="rounded-corners"
        width="420px"
        open={true}
        onCancel={() => setModal(null)}
        title={
          <>
            <img style={{ margin: '10px 0 5px 0' }} src={logo_xs} />
            <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: 30, color: '#002d65' }}>{modalTitle}</p>
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
