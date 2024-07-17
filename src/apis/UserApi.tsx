import { axiosPrivate } from './axios'
import { ICompanyList, IGooglesigninReq, IUserLoginReq, IUserLogoutReq } from './type/User'
import { TResponseType } from './type/commonResponse'

const UserApi = {
  login: async (payload: IUserLoginReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/user/info`, payload)
    return data
  },

  logout: async (payload: IUserLogoutReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/user/logout`, payload)
    return data
  },

  getCompanyList: async (): Promise<TResponseType<ICompanyList>> => {
    const { data } = await axiosPrivate.get(`api/company`)
    return data
  },

  signinWithgoogle: async (payload: IGooglesigninReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`login/google`, payload)
    return data
  },
}

export default UserApi
