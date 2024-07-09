//for datasets
export type IDatasetReq = {
  user_id: string
  com_id: string
  ds_id: string
}

export interface IDatasetEditReq extends IDatasetReq {
  ds_name: string
  ds_desc: string
}

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

export type IDatasetList = Array<IDatasetRes>

export type UploadStateType = 'start' | 'cancel' | 'fail' | 'success'

export interface IDataUploadReq {
  object_name: string
  object_size: number
  status: UploadStateType
}

export interface IDescription {
  col_list: string
  column_count: number
  date_col: string
  start_date: string
  end_date: string
  file_name: string
  file_size: number
  filename: string //나중에 빼도됨
  row_count: number
}

export type IDescriptionRes = object

//to get signed url
export interface ISignedUrlReq {
  object_name: string
}

export interface ISignedUrlRes {
  signed_url: string
  expiration: string
  data_id: string
}

//to upload to GCS with Signed Url
export interface IUploadFileReq {
  signedUrl: string
  fileType?: string
  file: File
}

export interface IModelDataSaveReq {
  object_name: string
  data: object
}
