export interface IModelInfo {
  id?: string
  name?: string
  target?: string
  state?: string
  created_at?: string
  is_classification?: boolean
  is_canceled?: number
}

export interface IModelDetailInfo extends IModelInfo {
  dataset_name?: string
  updated_at?: string
  error_code?: number
}

export type IModelList = Array<IModelInfo>
