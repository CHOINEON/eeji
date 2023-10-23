import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelOptionReq, IModelOptionRes } from './type/ModelOption'

const ModelApi = {
  //모델 옵션 설정해서 실행하기
  postModelOption: async (payload: IModelOptionReq): Promise<TResponseType<IModelOptionRes>> => {
    const { data } = await axiosPrivate.post(`api/get_model_option/${payload.user_id}`, payload)

    return data
  },
}

export default ModelApi
