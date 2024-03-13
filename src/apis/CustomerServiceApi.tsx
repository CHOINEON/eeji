import { axiosPublic } from './axios'
import { TResponseType } from './type/commonResponse'
import { IFeedbackDataReq, IFeedbackRes } from './type/CustomerService'

const CustomerServiceApi = {
  postCustomerFeedback: async (payload: IFeedbackDataReq): Promise<TResponseType<IFeedbackRes>> => {
    const { data } = await axiosPublic.post(`/api/customer/feedback`, payload)
    return data
  },
}

export default CustomerServiceApi
