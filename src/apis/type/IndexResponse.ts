export interface ISymbol {
  symbol_id: string
  period: string
  horizons: string //서버에서 string으로 받아 Array로 parsing해 사용
  selectedHorizon: number
  unit: string
  features: IRawDataResponse
}

export interface ISymbolList {
  symbols: Array<ISymbol>
}

export interface ISelectedFilter {
  selectedDate?: string //yyyy-mm-dd
  selectedFeatures?: string[]
}

export interface IFeatureImportance {
  feature_name: string
  importance: number
}

export interface IGlobalFeatureImportance {
  dt: string
  feature_importance: Array<IFeatureImportance>
  horizon: number
  name: string
}

export interface ILocalAttribution {
  feature_impact: Array<{ feature_name: string; impact: number }>
  name: string
  horizon: number
  date: string
  is_pred_date: number //1: 예측날짜, 0:기준날짜
  date_pred: string //예측 결과 날짜
  dt: string //데이터 생성일
}

export type Prediction = {
  date_pred: string
  ground_truth: number | null
  pred: number
}

export interface IHorizonData {
  [horizon: number]: Prediction[]
}

export interface IPredictionDataResponse {
  data: {
    name: string
    horizon: IHorizonData
  }
}

export interface IRawDataResponse {
  [feature: string]: Array<IRawData>
}

export interface IRawData {
  date: string
  value: number
}
