import { App } from 'antd'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

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
      case 409:
        alert(axiosError.response?.data)
        break
      // API 요청 실패
      case 500:
        alert('Network error! 관리자에게 문의하세요.')
        handle500()
        break
      default:
        defaultHandler(error)
        break
    }
  }, [])

  return { handleError } as const
}
