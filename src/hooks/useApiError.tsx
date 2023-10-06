import React, { useCallback } from 'react'
import { createStandaloneToast } from '@chakra-ui/react'
import useErrorModal from 'apis/error/useErrorModal'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'

//https://9yujin.tistory.com/59

//custom hook
export const useApiError = () => {
  const history = useHistory()
  const { openErrorModal } = useErrorModal()

  function handle404() {
    console.log('history:', history)
    // history.push('/404')
  }

  const handleError = useCallback((axiosError: AxiosError) => {
    console.log('handleError axiosError::', axiosError)
    const errorResponse = axiosError.response?.data
    const status = axiosError.response?.status
    const error = axiosError?.name

    switch (status) {
      //BadReqeustException | ValidationError
      case 405:
        handle404()
        break
      // 과도한 요청을 보낼 시

      case 429:
        openErrorModal(error)
        break
      // 문자메시지 발송 실패
      case 500:
        alert('500')
        // defaultHandler(error)
        break
      default:
        break
    }
  }, [])

  return { handleError } as const
}
