import axios from 'axios'
import { axiosPublic } from './axios'
import {
  IDataUploadReq,
  IDatasetEditReq,
  IDatasetList,
  IDatasetReq,
  ISignedUrlReq,
  ISignedUrlRes,
  IUploadFileReq,
} from './type/Dataset'
import { TResponseType } from './type/commonResponse'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPublic.post(`/api/dataset_list/${user_id}?user_id=${user_id}`)
    return data
  },

  //request Google signed URL with object name
  getSignedUrl: async (payload: ISignedUrlReq): Promise<TResponseType<ISignedUrlRes>> => {
    const { data } = await axiosPublic.post(`/api/v1/get_signed_url?object_name=${payload.object_name}`)
    return data
  },

  //upload to GCS with Signed URL
  uploadFileToGcs: async (payload: IUploadFileReq): Promise<any> => {
    const axiosInstance = axios.create({
      baseURL: payload.signedUrl,
    })

    const config = {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      withCredentials: false,
    }

    const { data } = await axiosInstance.put(payload.signedUrl, payload.file, config)
    return data
  },

  // After GCS upload start, notify backend to save metadata with status
  notifyWithState: async (payload: IDataUploadReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const { data } = await axiosPublic.post(`/api/notify/upload?state=${payload.state}`, payload.formData, config)
    return data
  },

  editDataset: async (payload: IDatasetEditReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPublic.patch(
      `/api/edit_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}&ds_name=${payload.ds_name}&ds_desc=${payload.ds_desc}`
    )
    return data
  },

  deleteDataset: async (payload: IDatasetReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPublic.delete(
      `/api/delete_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}`
    )
    return data
  },
}

export default DatasetApi
