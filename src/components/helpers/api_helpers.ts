import axios from 'axios'
//import accessToken

//pass new generated access token here
// const token = accessToken

//apply base url for axios
// const API_URL = 'http://ec2-3-220-205-197.compute-1.amazonaws.com:9871'
const API_URL = 'http://220.94.157.27:59871/'

const axiosApi = axios.create({
  baseURL: API_URL,
})

// axiosApi.defaults.headers.common["Authorization"] = token;

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export async function get(url: string, config = {}) {
  return await axiosApi.get(url, { ...config }).then((response) => response.data)
}

export async function post(url: string, data: any, config = {}) {
  return axiosApi.post(url, { ...data }, { ...config }).then((response) => response.data)
}

export async function put(url: string, data: any, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config }).then((response) => response.data)
}

export async function del(url: string, config = {}) {
  return await axiosApi.delete(url, { ...config }).then((response) => response.data)
}
