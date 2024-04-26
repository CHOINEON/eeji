import { AxiosInstance } from 'axios'
import { useEffect } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { ProgressState } from 'stores/progress'

const useAxiosInterceptor = (instance: AxiosInstance) => {
  const [progress, setProgress] = useRecoilState(ProgressState)
  const resetProgress = useResetRecoilState(ProgressState)

  let progressValue = 0 // 0 ~ 100, request percent
  let timerId: NodeJS.Timeout | null = null // timer id

  const timer = (): void => {
    if (progressValue < 100) {
      const diff = 100 - progressValue
      const inc = diff / (10 + progressValue * (1 + progressValue / 100)) // increment
      progressValue += inc

      setProgress({ percent: Math.round(progressValue), isLoading: progressValue < 100 })
    }
    timerId = setTimeout(timer, 50) // 50 ms
  }

  const handleRequest = (config: any) => {
    resetProgress()
    timer()
    return config
  }

  const handleResponse = (response: any) => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
    setProgress({ percent: 100, isLoading: false })
    return response
  }

  const handleError = (error: any) => {
    return Promise.reject(error)
  }

  //Set up interceptors
  const setupInterceptors = () => {
    const requestInterceptor = instance.interceptors.request.use(handleRequest, handleError)
    const responseInterceptor = instance.interceptors.response.use(handleResponse, handleError)

    return { requestInterceptor, responseInterceptor }
  }

  //Remove interceptors
  const ejectInterceptors = (requestInterceptor: any, responseInterceptor: any) => {
    instance.interceptors.request.eject(requestInterceptor)
    instance.interceptors.response.eject(responseInterceptor)
  }

  useEffect(() => {
    const { requestInterceptor, responseInterceptor } = setupInterceptors()

    return () => {
      ejectInterceptors(requestInterceptor, responseInterceptor)
      resetProgress()
    }
  }, [])
}

export default useAxiosInterceptor
