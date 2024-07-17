import { axiosPrivate } from './axios'
import { IModelDataReq, IModelReqParam } from './type/ModelOption'
import { TResponseType } from './type/commonResponse'

const XaiApi = {
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

  //XAI - 저장된 모델 실행해서 XAI 결과 리턴
  postModelForXaiResult: async (params: IModelReqParam): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/get_xai_result/${params.user_id}`, params)
    return data
  },

  //XAI - 서버에 저장된 모델 가져오기
  getSavedModelList: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/model_list/${params.user_id}`)
    return data
  },
}

export default XaiApi
