import { ModelOptionReq, ModelGetRes } from './type/ModelPerformanceOption'
import axios from 'axios'

const ModelPerformanceApi = async (params: ModelOptionReq): Promise<ModelGetRes> => {
  try {
    let responseData = {}
    if (params.algo_type === '1') {
      const response = await axios.get(
        process.env.REACT_APP_NEW_API_SERVER_URL + `/api/index_predict?user_id=${params.user_id}`
      )
      responseData = { modelaccuracy: response.data.modelaccuracy }
    } else if (params.algo_type === '0') {
      const response = await axios.get(
        process.env.REACT_APP_NEW_API_SERVER_URL + `/api/index_predict?user_id=${params.user_id}`
      )
      responseData = { mae: response.data.mae, mse: response.data.mse, rmse: response.data.rmse }
    }
    return responseData
    // return { mae: '123', mse: '123123', rmse: '1213' }
  } catch (error) {
    console.error('error:', error)
    throw error
  }
}
export default ModelPerformanceApi
