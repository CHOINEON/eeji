import { axiosPrivate, axiosPublic } from './axios'
import { IModelList } from './type/Model'
import {
  IGetSurlReq,
  IModelApiGeneratorParam,
  IModelDataReq,
  IModelOptionRes,
  IModelPostReq,
  IModelSaveReqParam,
} from './type/ModelOption'
import { TResponseType } from './type/commonResponse'

const controller = new AbortController()

const ModelApi = {
  getModelStatusList: async (user_id: string): Promise<TResponseType<IModelList>> => {
    const config = {
      headers: {
        'user-id': user_id,
        // 'EEJI-Test-Code': 'MOCK_DATA',
      },
    }

    const { data } = await axiosPrivate.get('api/v1/list_model', config)
    return data
  },

  //google signed url로 클라우드에 저장된 결과 데이터(json) 받아오기
  getJsonResult: async (signed_url: string): Promise<any> => {
    const { data } = await axiosPublic.get(signed_url)
    return data
  },

  //모델 학습 결과 다운로드(signed url)
  getTrainingResultUrl: async (param: IGetSurlReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
        isxai: param.is_xai,
      },
    }
    const { data } = await axiosPrivate.get(`api/v1/get_model_download_url/${param.model_id}`, config)
    return data
  },

  //모델 옵션 설정해서 실행하기
  postModelwithOption: async (params: IModelPostReq): Promise<IModelOptionRes> => {
    const { data } = await axiosPrivate.post(`api/get_model_option`, params.payload)
    return data
  },

  cancelPostModel: async (): Promise<any> => {
    controller.abort()
  },

  //Model Generator결과 페이지에서 모델 저장
  saveGeneratedModel: async (params: IModelSaveReqParam): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_model/${params.user_id}`, params)
    return data
  },

  //사용자가 갖고 있는 모델 파일 직접업로드(XAI)
  saveModelwithColumns: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_custom_model_new/${params.user_id}`, params.payload)
    return data
  },

  //api페이지 publish (API Generator)
  publishModelAPI: async (params: IModelApiGeneratorParam): Promise<TResponseType<object>> => {
    // const { data } = await axiosPrivate.post(`/api/generate_api_key/`, params)
    const { data } = await axiosPrivate.post(
      `/api/generate_api_key?com_id=${params.com_id}&user_id=${params.user_id}&model_id=${params.model_id}`
    )

    return data
  },

  //특정 유저를 위해 모델 리스트를 db에서 갖고옴
  // postModelList: async (user_id: string): Promise<TResponseType<object>> => {
  //   const { data } = await axiosPrivate.post(`/api/model_list/${user_id}`)
  //   return data
  // },
}

export default ModelApi
