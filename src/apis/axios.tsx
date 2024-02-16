import axios from 'axios'
import useAxiosInterceptor from 'hooks/useAxiosInterceptor'
import { useSetRecoilState } from 'recoil'
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

export const axiosProgress = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
