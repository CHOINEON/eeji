import { axiosPrivate } from './axios'
import {
  IGlobalFeatureImportance,
  ILeadingIndicatorResponse,
  ILocalAttributionResponse,
  IMetrics,
  IPredictionDataResponse,
  IRawDataResponse,
  ISymbolList,
} from './type/IndexResponse'

const IndexApi = {
  //유저별 종목 리스트
  getSymbolList: async (): Promise<ISymbolList> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/get_symbol_info_v2`)
    return data
  },

  //전체 raw data
  getRawData: async (symbol: string): Promise<IRawDataResponse> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/rawdata_v2/${symbol}`)
    return data.data
  },

  //특정 symbol의 예측값 가져오기
  getPredictionData: async (symbol: string, horizon: number): Promise<IPredictionDataResponse> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/prediction_v2/${symbol}?horizon=${horizon}`)
    return data.data
  },

  //symbol의 global explanation
  getGlobalExplanation: async (symbol: string, horizon: number): Promise<IGlobalFeatureImportance> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/global_feature_importance/${symbol}?horizon=${horizon}`)

    return data.data?.[0]
  },

  //symbol의 local attribution by date
  getLocalAttributionByDate: async (
    symbol: string,
    horizon: number,
    date: string,
    isPredDate: number,
    isSorted: number
  ): Promise<ILocalAttributionResponse> => {
    const { data } = await axiosPrivate.get(
      `api/v2/economy/local_attribution_by_date/${symbol}?horizon=${horizon}&date=${date}&is_pred_date=${isPredDate}&is_sorted=${isSorted}`
    )
    return data.data
  },

  //symbol의 metrics
  getMetrics: async (symbol: string, horizon: number): Promise<IMetrics> => {
    const { data } = await axiosPrivate.get(`api/v2/economy/get_prediction_metric/${symbol}?horizon=${horizon}`)
    return data.data
  },

  //에측값의 신뢰구간 데이터 가져오기
  // getPredictionConfidenceInterval: async (
  //   symbol: string,
  //   horizon: string
  // ): Promise<IPredictionConfidenceIntervalResponse> => {
  //   const { data } = await axiosPrivate.get(
  //     `api/v2/economy/get_prediction_confidence_interval/${symbol}?horizon=${horizon}`
  //   )
  //   return data.data
  // },

  //symbol의 leading indicator
  getLeadingIndicator: async (symbol: string, horizon: number): Promise<ILeadingIndicatorResponse> => {
    const { data } = await axiosPrivate.get(
      `api/v2/economy/get_explanation_leading_indicator/${symbol}?horizon=${horizon}`
    )
    return data.data
  },
}

export default IndexApi
