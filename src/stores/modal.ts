import { atom } from 'recoil'
import { MODAL_TYPES } from 'views/DataAnalysis/components/Modal/GlobalModal'

export type XAIUploadModal = {
  modalType: typeof MODAL_TYPES.ModelImport
  modalTitle?: string
  modalProps: any
}

export type DatasetUploadModal = {
  modalType: typeof MODAL_TYPES.DataImport
  modalTitle?: string
  modalProps: any
}

export type ModalType = XAIUploadModal | DatasetUploadModal

export const modalState = atom<ModalType | null>({
  key: 'modalState',
  default: null,
})
