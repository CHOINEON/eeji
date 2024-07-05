import { axiosPrivate } from './axios'
import { IFeedbackDataReq, IFeedbackRes } from './type/CustomerService'
import { TResponseType } from './type/commonResponse'

const CustomerServiceApi = {
  postCustomerFeedback: async (payload: IFeedbackDataReq): Promise<TResponseType<IFeedbackRes>> => {
    const { data } = await axiosPrivate.post(`/api/customer/feedback`, payload)
    return data
  },
}

export default CustomerServiceApi
