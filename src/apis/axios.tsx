import axios from 'axios'

const BASE_URL = 'https://ineeji-solution-tf.du.r.appspot.com'

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
