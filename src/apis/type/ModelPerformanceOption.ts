import { URLSearchParams } from 'url'

export interface IModelOptionReq {
  user_id: string
  is_classification?: boolean
  data?: any
  mae?: any
  mse?: any
  rsme?: any
}

export interface ModelPostReq {
  type: string
  payload?: IModelOptionReq
  controller?: AbortController
  algo_type?: string
}
//return 되는 부분
export interface ModelOptionRes {
  mae: any
  mse: any
  rsme: any
}
