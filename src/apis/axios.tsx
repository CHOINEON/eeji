import axios from 'axios'

const BASE_URL = 'https://ineeji-solution-tf.du.r.appspot.com'
const DEV_SERVER_URL = 'http://34.64.98.129:8000'

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: DEV_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosProgress = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
