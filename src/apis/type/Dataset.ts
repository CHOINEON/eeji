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

export interface IDataUploadReq {
  user_id: string
  is_classification: number
  formData: FormData
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
  user_id: string
  formData: FormData
}

export interface ISignedUrlRes {
  surl: string
  uuid: string
  blob_name: string
}

//to upload to GCS with Signed Url
export interface IUploadFileReq {
  signedUrl: string
  fileType: string
  file: File
}
