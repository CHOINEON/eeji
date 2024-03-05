import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelDataReq } from './type/ModelOption'

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
  //XAI - 서버에 저장된 모델 가져오기
  getXaiAnalysisResult: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/get_xai_result/${params.user_id}`, params.payload)
    return data
  },
}

export default XaiApi
