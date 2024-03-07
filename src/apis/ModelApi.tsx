import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelOptionReq, IModelOptionRes, IModelPostReq, IModelDataReq } from './type/ModelOption'

const controller = new AbortController()
const signal = controller.signal

const ModelApi = {
  //모델 옵션 설정해서 실행하기
  postModelwithOption: async (params: IModelPostReq): Promise<IModelOptionRes> => {
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    const { data } = await axiosPrivate.post(`api/get_model_option`, params.payload, config)

    return data
  },

  cancelPostModel: async (): Promise<any> => {
    controller.abort()
  },

  //모델 저장
  saveModelwithColumns: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_custom_model_new/${params.user_id}`, params.payload)
    return data
  },
}

export default ModelApi
