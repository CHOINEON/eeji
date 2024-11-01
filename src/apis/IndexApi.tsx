import { axiosPrivate } from './axios'
import { IGlobalFeatureImportance, IHorizonData, ISymbolList } from './type/IndexResponse'

const IndexApi = {
  //유저별 종목 리스트
  getSymbolList: async (): Promise<ISymbolList> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/get_symbol_info`)
    return data
  },

  //전체 raw data
  getRawData: async (symbol: string): Promise<any> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/rawdata/${symbol}`)
    return data
  },

  //특정 symbol의 예측값 가져오기
  getPredictionData: async (symbol: string): Promise<IHorizonData> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/prediction/${symbol}`)
    return data.data.horizon
  },

  //symbol의 global explanation
  getGlobalExplanation: async (symbol: string, horizon: string): Promise<IGlobalFeatureImportance> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/global_feature_importance/${symbol}?horizon=${horizon}`)
    return data.data[0]
  },
}

export default IndexApi
