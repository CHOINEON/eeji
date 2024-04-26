import { axiosPublic } from './axios'
import { TResponseType } from './type/commonResponse'
import { ICompanyList, IUserLoginReq, IUserLogoutReq } from './type/User'

const UserApi = {
  login: async (payload: IUserLoginReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPublic.post(`api/user/info`, payload)
    return data
  },

  logout: async (payload: IUserLogoutReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPublic.post(`api/user/logout`, payload)
    return data
  },

  getCompanyList: async (): Promise<TResponseType<ICompanyList>> => {
    const { data } = await axiosPublic.get(`api/company`)
    return data
  },
}

export default UserApi
