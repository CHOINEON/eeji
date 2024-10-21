import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'

const DemoApi = {
  getHRCInputList: async (): Promise<TResponseType<any>> => {
    const { data } = await axiosPrivate.get('api/v2/economy/hrc_input')

    return data
  },

  getHRCResultList: async (): Promise<TResponseType<any>> => {
    const { data } = await axiosPrivate.get('api/v2/economy/hrc_result')

    return data
  },
}

export default DemoApi
