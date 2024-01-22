import React, { useEffect, useState } from 'react'
import { App, Button, Space } from 'antd'
// import useModal from 'hooks/useModal'
import toast from 'react-hot-toast'

export type TErrorCode = 'Auth-0000' | 'Auth-0001' | 'Auth-9000' | 'Auth-5000' | 'Auth-0002'

const errorMessage = {
  'Auth-0000': '인증번호의 기한이 만료되었어요',
}

const useErrorModal = (props?: any) => {
  useEffect(() => console.log('useErrorModal props:', props), [props])

  // const { openModal, closeModal } = useModal()
  const openErrorModal = (error: any) => {
    //console.log('show !!:', openErrorModal)
    toast('Something went wrong')
  }

  return { openErrorModal } as const
}

export default useErrorModal
