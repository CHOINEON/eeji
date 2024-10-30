import { axiosPrivate } from './axios'
import { ISymbolList } from './type/IndexResponse'

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
  getPredictionData: async (symbol: string, horizons: string): Promise<any> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/prediction/${symbol}?horizons=${horizons}`)
    return data
  },
}

export default IndexApi
