export interface IDatasetRes {
  col_list: string
  com_id: string
  create_date: string
  date_col: string
  descr: string
  ds_id: string
  end_date: string
  loc: string
  name: string
  size: number
  start_date: string
  update_date: string
  user_id: string
}

export interface IDatasetReq {
  user_id: string
}

export type IDatasetList = Array<IDatasetRes>
