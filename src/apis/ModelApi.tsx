import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelOptionReq, IModelOptionRes, IModelPostReq } from './type/ModelOption'

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
}

export default ModelApi
