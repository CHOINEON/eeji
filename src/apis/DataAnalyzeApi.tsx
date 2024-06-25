import { axiosPrivate } from './axios'
import { ICorrDataReq, ICorrDataRes } from './type/DataAnalyze'
import { TResponseType } from './type/commonResponse'

const DataAnalyzeApi = {
  postCorrData: async (payload: ICorrDataReq): Promise<TResponseType<ICorrDataRes>> => {
    const { data } = await axiosPrivate.post(`/api/send_data/${payload.user_id}`, payload)

    return data
  },
}

export default DataAnalyzeApi
