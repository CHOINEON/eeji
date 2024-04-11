import { axiosPublic } from './axios'
import { TResponseType } from './type/commonResponse'
import { ICorrDataReq, ICorrDataRes } from './type/DataAnalyze'

const DataAnalyzeApi = {
  postCorrData: async (payload: ICorrDataReq): Promise<TResponseType<ICorrDataRes>> => {
    const { data } = await axiosPublic.post(`/api/send_data/${payload.user_id}`, payload)

    return data
  },
}

export default DataAnalyzeApi
