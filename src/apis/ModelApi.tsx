import { axiosPrivate } from './axios'
import { TResponseType } from './type/commonResponse'
import { IModelDataReq, IModelOptionReq, IModelOptionRes, IModelPostReq } from './type/ModelOption'

const controller = new AbortController()
const signal = controller.signal

const ModelApi = {
  //모델 옵션 설정해서 실행하기
  postModelwithOption: async (params: IModelPostReq): Promise<IModelOptionRes> => {
    // console.log('params:', params)
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    const { data } = await axiosPrivate.post(`api/get_model_option`, params.payload, config)

    return data
  },

  cancelPostModel: async (): Promise<any> => {
    controller.abort()
  },

  //Model Generator결과 페이지에서 모델 저장
  saveGeneratedModel: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    console.log('params:', params)
    const { data } = await axiosPrivate.post(`api/save_model/${params.user_id}/`, params.payload)
    return data
  },


  //사용자가 갖고 있는 모델 파일 직접업로드(XAI)
  saveModelwithColumns: async (params: IModelDataReq): Promise<TResponseType<object>> => {
    const { data } = await axiosPrivate.post(`api/save_custom_model_new/${params.user_id}/`, params.payload)


  //특정 유저를 위해 모델 리스트를 db에서 갖고옴
  // postModelList: async (user_id: string): Promise<TResponseType<object>> => {
  //   const { data } = await axiosPrivate.post(`/api/model_list/${user_id}`)
  //   return data
  // },
}

export default ModelApi
