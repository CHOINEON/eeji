import React from 'react'
import { useRecoilState } from 'recoil'

const useModal = () => {
  //   const [modal, setModal] = useRecoilState(modalState)
  //   const openModal = ({ modalType, modalProps }: ModalType) => {
  //     setModal({ modalType, modalProps })
  //   }

  //   const closeModal = () => {
  //     setModal(null)
  //   }

  const openModal = () => alert('open modal')

  const closeModal = () => alert('close modal')

  return { openModal, closeModal }
}

export default useModal
