import { PeriodType } from 'utils/TextTranslator'

export interface ISymbol {
  symbol_id: string
  period: PeriodType
  horizons: string //서버에서 string으로 받아 Array로 parsing해 사용
  selectedHorizon?: number
  unit: string
  features: IRawDataFeatures
  description: string
  source: string
  dates: string[] //전체 날짜 리스트
  category: string
}

export interface ISymbolList {
  categories: string[]
  symbols: Array<ISymbol>
}

export interface ISelectedFilter {
  selectedDate?: string //yyyy-mm-dd
  selectedFeatures?: string[]
  has_ci?: boolean
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

export interface IFeatureImpact {
  feature_name: string
  impact: number
  input_value_delta: number
  input_value_delta_percentage: number
  type?: string //positive, negative
}

export interface ILocalAttributionResponse {
  feature_impact: { positive: Array<IFeatureImpact>; negative: Array<IFeatureImpact> }
  name: string
  horizon: number
  is_pred_date: number //1: 예측날짜, 0:기준날짜
  date_pred: string //예측 결과 날짜
  dt: string //데이터 생성일
  date: string //음영구간(입력 데이터 구간) 종료일
  date_input: string //음영구간(입력 데이터 구간) 시작일
}

export interface ILocalAttribution {
  feature_impact: Array<IFeatureImpact>
  name: string
  horizon: number
  is_pred_date: number //1: 예측날짜, 0:기준날짜
  date_pred: string //예측 결과 날짜
  dt: string //데이터 생성일
  date: string //음영구간(입력 데이터 구간) 종료일
  date_input: string //음영구간(입력 데이터 구간) 시작일
}

export interface IPrediction {
  date: string | null //예측 기준 날짜
  date_pred: string //예측 결과 날짜
  ground_truth: number | null //실제값
  pred: number | null //예측값
  lower_bound: number | null
  upper_bound: number | null
}

export interface IPredictionDataResponse {
  name: string
  horizon: number
  dt: string
  prediction: IPrediction[]
  is_ci: boolean
}

export interface IRawDataResponse {
  dt: string
  features: IRawDataFeatures
  name: string
}

export interface IRawDataFeatures {
  [feature: string]: Array<IRawData>
}

export interface IRawData {
  date: string
  value: number
}

export interface IMetricInformation {
  metric_name: string
  score: number
}

export interface IMetrics {
  name: string
  horizon: number
  dt: string
  metric_information: Array<IMetricInformation>
}

export interface IPredictionConfidenceInterval {
  date_pred: string
  ground_truth: number | null
  lower_bound: number
  upper_bound: number
}

export interface IPredictionConfidenceIntervalResponse {
  name: string
  dt: string
  horizon: number
  confidence_interval: IPredictionConfidenceInterval[]
}

export interface ILeadingIndicator {
  feature_name: string
  leading_period: number
  correlation: number
  description: string
  source: string
}

export interface ILeadingIndicatorResponse {
  name: string
  horizon: number
  dt: string
  leading_indicator: Array<ILeadingIndicator>
}

export interface IFeatureDescriptionResponse {
  data: Array<IFeatureDescription>
}

export interface IFeatureDescription {
  feature_name: string
  description: string
  causal_relationship: string
  source: string
  unit: string
}
