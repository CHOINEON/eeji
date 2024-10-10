export interface ModelOptionReq {
  user_id: string
  algo_type: string
  controller: any
}

export interface ModelGetReq {
  algo_type: string
  payload: ModelOptionReq
  controller: AbortController
}

export interface ModelGetRes {
  modelaccuracy?: string
  mae?: string
  mse?: string
  rmse?: string
}

export interface PerformanceModel {
  [key: string]: PerformanceModelType
}
export type PerformanceModelType = {
  f1_score?: number | string
  accuracy?: number | string
  mae?: number | string
  mse?: number | string
  rmse?: number | string
  mape?: number | string
  r2: number | string
}
