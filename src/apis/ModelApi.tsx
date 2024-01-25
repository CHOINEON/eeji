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

  //모델 및 데이터셋 파일 업로드 => 컬럼 리턴(column file 업로드 한 경우만)
  uploadModelwithData: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    const { data } = await axiosPrivate.post(`api/upload_custom_model_new/${params.user_id}`, params.formData, config)
    return data
  },

  //모델 저장
  saveModelwithColumns: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_custom_model_new/${params.user_id}`, params.payload)
    return data
  },
}

export default ModelApi
