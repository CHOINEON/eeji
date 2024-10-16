import { axiosPrivate } from './axios'

const IndexApi = {
  //테스트용(실제값, 예측값)
  getPredictiondata: async (symbol: string): Promise<any> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/prediction/${symbol}`)
    return data
  },
}

export default IndexApi
