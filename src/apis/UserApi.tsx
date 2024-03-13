import { axiosPublic } from './axios'
import { TResponseType } from './type/commonResponse'
import { ICompanyList, IUserLoginReq } from './type/User'

const UserApi = {
  login: async (payload: IUserLoginReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPublic.post(`api/user/info`, payload)
    return data
  },

  getCompanyList: async (): Promise<TResponseType<ICompanyList>> => {
    const { data } = await axiosPublic.get(`api/company`)
    console.log('getCompanyList api call and response is::', data)
    return data
  },
}

export default UserApi
