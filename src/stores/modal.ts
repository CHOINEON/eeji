import { atom } from 'recoil'
import { MODAL_TYPES } from 'components/modal/GlobalModal'

export type XAIUserModelUploadModal = {
  modalType: typeof MODAL_TYPES.UserModelImport
  modalTitle?: string
  modalProps: any
}

export type XAISavedModelUploadModal = {
  modalType: typeof MODAL_TYPES.SavedModelImport
  modalTitle?: string
  modalProps: any
}

export type DatasetUploadModal = {
  modalType: typeof MODAL_TYPES.DataImport
  modalTitle?: string
  modalProps: any
}

export type ModalType = XAIUserModelUploadModal | XAISavedModelUploadModal | DatasetUploadModal

export const modalState = atom<ModalType | null>({
  key: 'modalState',
  default: null,
})
