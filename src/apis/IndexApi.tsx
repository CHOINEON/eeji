import { axiosPrivate } from './axios'
import { ISymbolList } from './type/IndexResponse'

const IndexApi = {
  //실제값, 예측값
  getPredictiondata: async (symbol: string): Promise<any> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/prediction/${symbol}`)
    return data
  },

  //유저별 종목 리스트
  getSymbolList: async (): Promise<ISymbolList> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/get_symbol_info`)
    return data
  },
}

export default IndexApi
