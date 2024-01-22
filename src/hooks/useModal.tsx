import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState, ModalType } from 'stores/modal'
import styled from 'styled-components'

const useModal = () => {
  const [modal, setModal] = useRecoilState(modalState)

  const openModal = ({ modalType, modalProps, modalTitle }: ModalType) => {
    setModal({ modalType, modalProps, modalTitle })
  }

  const closeModal = () => {
    setModal(null)
  }

  return { openModal, closeModal }
}

export default useModal
