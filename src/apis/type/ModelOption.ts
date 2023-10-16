export interface IModelOptionReq {
  set_auto: boolean
  user_id: string
  com_id: string
  dataset_id: string
  date_col: string
  start_date: string
  end_date: string
  x_value: Array<string>
  y_value: string
  type_missing: string
  number_missing: number
  type_outlier: string
  number_std: number
  number_perc: number
  type_scaling: string
  number_ma: number
  type_model: string
  number_epoch: number
  number_beyssian: number
}

export interface IModelOptionRes {
  num_columns: number
  preprocessing_graphs: Array<any>
}
