import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelOptionReq, IModelOptionRes, IModelPostReq, IModelDataReq } from './type/ModelOption'

const controller = new AbortController()
const signal = controller.signal

const ModelApi = {
  //모델 옵션 설정해서 실행하기
  postModelwithOption: async (params: IModelPostReq): Promise<IModelOptionRes> => {
    if (params.type === 'request') {
      const { data } = await axiosPrivate.post(`api/get_model_option/${params.payload.user_id}`, params.payload, {
        signal: params.controller.signal,
      })
      return data
    } else if (params.type === 'cancel') {
      params.controller.abort()
    }
  },

  cancelPostModel: async (): Promise<any> => {
    controller.abort()
  },

  //모델 저장
  saveModelwithColumns: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_custom_model_new/${params.user_id}`, params.payload)
    return data
  },

  //특정 유저를 위해 모델 리스트를 db에서 갖고옴
  postModelList: async (user_id: string): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`/api/model_list/${user_id}`)
    return data
  },
}

export default ModelApi
