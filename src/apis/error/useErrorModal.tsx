import React, { useEffect, useState } from 'react'
import { App, Button, Space } from 'antd'
import useModal from 'hooks/useModal'
import toast from 'react-hot-toast'

export type TErrorCode = 'Auth-0000' | 'Auth-0001' | 'Auth-9000' | 'Auth-5000' | 'Auth-0002'

const errorMessage = {
  'Auth-0000': '인증번호의 기한이 만료되었어요',
  'Auth-0001': '인증번호가 일치하지 않습니다',
  'Auth-9000': '잠시 뒤에 다시 시도해주세요',
  'Auth-5000': '문자 발송에 실패했어요\n카카오 채널로 문의주세요',
  'Auth-0002': '이미 가입된 번호입니다',
}

const useErrorModal = (props?: any) => {
  useEffect(() => console.log('useErrorModal props:', props), [props])

  const { openModal, closeModal } = useModal()
  const openErrorModal = (error: any) => {
    //console.log('show !!:', openErrorModal)
    toast('Something went wrong')
  }

  return { openErrorModal } as const
}

export default useErrorModal
