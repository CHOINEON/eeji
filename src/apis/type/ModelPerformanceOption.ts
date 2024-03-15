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
  [key: string]: PerformanceModelTyeps
}
export type PerformanceModelTyeps = {
  f1_score?: number
  accuracy?: number
  mae?: number
  mse?: number
  rmse?: number
}
