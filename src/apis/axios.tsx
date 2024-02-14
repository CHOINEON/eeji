import axios, { AxiosInstance } from 'axios'
import ProgressManager from 'components/progressbar/ProgressManager'
import useProgress from 'hooks/useProgress'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ProgressState } from '../stores/progress'

const BASE_URL = 'https://ineeji-solution-tf.du.r.appspot.com'

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosProgress = (): AxiosInstance => {
  // const { setProgressValue } = useProgress()

  let progress = 0
  let timerId: any = null

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  })

  function setProgress(value: number) {
    // const [progressValue, setProgressValue] = useRecoilState(ProgressState)
    // setProgressValue({ progress: Math.round(value), isLoading: value < 100 })

    console.log('setProgress:', value)
    progress = value

    //시도1. component body 안에서 호출하려고 manager만들기
    ProgressManager(progress)
    //시도2. custom hook 만들어서 값 업데이트
    // setProgressValue(progress)
  }

  function timer() {
    if (progress < 98) {
      const diff = 100 - progress
      const inc = diff / (10 + progress * (1 + progress / 100)) //increment
      setProgress(progress + inc)
    }
    timerId = setTimeout(timer, 50) //50ms 단위로 timer 재귀 호출
  }

  axiosInstance.defaults.timeout = 3000

  const myInterceptor = axiosInstance.interceptors.request.use(
    function (config) {
      // 요청을 보내기 전에 수행할 일
      setProgress(0)
      timer()
      return config
    },
    function (error) {
      // 오류 요청을 보내기전 수행할 일
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    function (response) {
      // 응답 데이터를 가공
      if (timerId) {
        clearTimeout(timerId)
        timerId = null
      }
      setProgress(100)
      return response
    },
    function (error) {
      // 오류 응답을 처리
      // ...
      return Promise.reject(error)
    }
  )

  axios.interceptors.request.eject(myInterceptor)

  return axiosInstance
}

// export const axiosProgress = axios.create({
//   baseURL: BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// })

// let progress = 0
// let timerId: any = null

// function setProgress(value: number) {
//   const { setProgressValue } = useProgress()
//   // const [progressValue, setProgressValue] = useRecoilState(ProgressState)
//   // setProgressValue({ progress: Math.round(value), isLoading: value < 100 })

//   console.log('setProgress:', value)
//   progress = value

//   //시도1. component body 안에서 호출하려고 manager만들기
//   // ProgressManager(progress)
//   //시도2. custom hook 만들어서 값 업데이트
//   setProgressValue(progress)
// }

// function timer() {
//   if (progress < 98) {
//     const diff = 100 - progress
//     const inc = diff / (10 + progress * (1 + progress / 100)) //increment
//     setProgress(progress + inc)
//   }
//   timerId = setTimeout(timer, 50) //50ms 단위로 timer 재귀 호출
// }

// axiosProgress.defaults.timeout = 3000

// const myInterceptor = axiosProgress.interceptors.request.use(
//   function (config) {
//     // 요청을 보내기 전에 수행할 일
//     setProgress(0)
//     timer()
//     return config
//   },
//   function (error) {
//     // 오류 요청을 보내기전 수행할 일
//     return Promise.reject(error)
//   }
// )

// axiosProgress.interceptors.response.use(
//   function (response) {
//     // 응답 데이터를 가공
//     if (timerId) {
//       clearTimeout(timerId)
//       timerId = null
//     }
//     setProgress(100)
//     return response
//   },
//   function (error) {
//     // 오류 응답을 처리
//     // ...
//     return Promise.reject(error)
//   }
// )

// axios.interceptors.request.eject(myInterceptor)
