import React, { useCallback } from 'react'
import { createStandaloneToast } from '@chakra-ui/react'
import useErrorModal from 'apis/error/useErrorModal'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { App } from 'antd'

//https://9yujin.tistory.com/59

//custom hook
export const useApiError = () => {
  const { message } = App.useApp()
  const history = useHistory()
  // const { openErrorModal } = useErrorModal()

  const defaultHandler = (error: any) => {
    console.error(error)
  }

  const handle404 = () => {
    console.log('history:', history)
    // history.push('/404')
  }

  const handle500 = () => {
    alert('error code: 500')
  }

  const handleError = useCallback((axiosError: AxiosError) => {
    console.log('useApiError / handleError ::', axiosError)
    const errorResponse = axiosError.response?.data
    const error = axiosError?.name
    const status = axiosError.response?.status

    switch (status) {
      //BadReqeustException | ValidationError
      case 400:
        message.error('Bad request!')
        break
      case 404:
        handle404()
        break
      // 과도한 요청을 보낼 시
      case 429:
        // openErrorModal(error)
        break
      // API 요청 실패
      case 500:
        alert('500')
        handle500()
        break
      default:
        defaultHandler(error)
        break
    }
  }, [])

  return { handleError } as const
}
