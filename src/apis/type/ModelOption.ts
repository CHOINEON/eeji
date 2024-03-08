import { URLSearchParams } from 'url'

export interface IModelOptionReq {
  set_auto: boolean
  user_id: string
  com_id: string
  dataset_id: string
  date_col: string
  start_date: string
  end_date: string
  x_value?: Array<string>
  y_value: string
  type_missing?: string
  number_missing?: number
  type_outlier?: string
  number_std?: number
  number_perc?: number
  type_scaling?: string
  number_ma?: number
  type_model?: string
  number_epoch?: number
  number_beyssian?: number
  is_classification?: boolean
}

export interface IModelPostReq {
  type: string
  payload?: IModelOptionReq
  controller?: AbortController
}

export interface IModelOptionRes {
  bestplot: object
  fig_2nd_coef: string
  fig_coef_1st_json: string
  fig_eval_json: string
  fig_json_combine: string
  fig_json_rfe: string
  fig_json_rfr: string
  fig_test_json: string
  lin_pred_fig_json: string
  num_columns: number
  preprocessing_graphs: Array<unknown>
  result_df: Array<unknown>
  sorted_results_df: string
  best_plot: string
}

export interface IModelVariablePostReq {
  user_id: string
  com_id: string
  uuid: string
  x_value: Array<string>
}

export interface IModelDataReq {
  user_id: string
  formData?: FormData
  params?: URLSearchParams
  payload?: IModelVariablePostReq | IModelSaveReqParams
}

export interface IModelReqParam {
  user_id: string
  com_id: string
  uuid: string
}

export interface IModelSaveReqParams {
  user_id: string
  com_id: string
  uuid: string
  model_name: string
  target_y: string
  is_classification: boolean
}
