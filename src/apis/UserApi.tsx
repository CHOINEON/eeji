import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { ICompanyList, IUserLoginReq } from './type/User'

const UserApi = {
  login: async (payload: IUserLoginReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/user/info`, payload)
    return data
  },

  getCompanyList: async (): Promise<TResponseType<ICompanyList>> => {
    console.log('getCompanyList api call')
    const { data } = await axiosPrivate.get(`api/company`)
    return data
  },
}

export default UserApi
