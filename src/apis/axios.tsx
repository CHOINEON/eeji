import axios from 'axios'

export const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosProgress = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
})
