import { axiosPrivate } from './axios'
import { IModelDataReq, IModelReqParam, IPaginatedReq } from './type/ModelOption'
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

  //initial pagination 처리를 위한 총 row count 가져오기
  getTotalXaiRows: async (param: { model_id: string }): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
      },
    }
    const { data } = await axiosPrivate.get(`/api/v1/xai_result/count/${param.model_id}`, config)
    return data
  },

  //pagination 처리한 XAI결과
  getPaginatedXaiResult: async (params: IPaginatedReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
      },
    }

    const { data } = await axiosPrivate.get(
      `/api/v1/xai_result/${params.model_id}?offset=${params.offset}&limit=${params.limit}`,
      config
    )
    return data
  },
}

export default XaiApi
