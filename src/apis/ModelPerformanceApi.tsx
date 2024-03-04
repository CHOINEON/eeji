import { axiosPrivate } from './axios'
import { ModelOptionRes, ModelPostReq } from './type/ModelPerformanceOption'

const controller = new AbortController()
// const signal = controller.signal
const ModelPerformanceApi = {
  postModelwithOption: async (params: ModelPostReq): Promise<ModelOptionRes> => {
    // postModelwithOption: async (params: any): Promise<any> => {
    let requestUrl = ''
    let payload = {}
    if (params.algo_type === '1') {
      requestUrl = `api/get_model_option/${params.payload.user_id}`
      payload = { modelaccuracy: params.payload.data }
    } else if (params.algo_type === '0') {
      requestUrl = `api/get_model_option/${params.payload.user_id}`
      payload = {
        mae: params.payload.mae,
        mse: params.payload.mse,
        rsme: params.payload.rsme,
      }
    }
    const { data } = await axiosPrivate.post(requestUrl, payload, {
      signal: params.controller.signal,
    })
    return data
  },
}
export default ModelPerformanceApi
