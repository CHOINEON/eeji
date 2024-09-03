import axios from 'axios'

export const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  headers: {
    Authorization: localStorage.getItem('authToken'),
    'Content-Type': 'application/json',
    'company-id': localStorage.getItem('companyId'),
    'user-id': localStorage.getItem('userId'),
  },
})

export const axiosProgress = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL,
  headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('authToken') },
})
