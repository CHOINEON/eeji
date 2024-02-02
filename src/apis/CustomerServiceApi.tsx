import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IFeedbackDataReq, IFeedbackRes } from './type/CustomerService'

const CustomerServiceApi = {
  postCustomerFeedback: async (payload: IFeedbackDataReq): Promise<TResponseType<IFeedbackRes>> => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    }

    const { data } = await axiosPrivate.post(`/api/customer/feedback`, payload, config)
    return data
  },
}

export default CustomerServiceApi
