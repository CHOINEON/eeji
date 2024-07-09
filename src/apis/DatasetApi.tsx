import axios from 'axios'
import { axiosPrivate, axiosProgress } from './axios'
import {
  IDataUploadReq,
  IDatasetEditReq,
  IDatasetList,
  IDatasetReq,
  IModelDataSaveReq,
  ISignedUrlReq,
  ISignedUrlRes,
  IUploadFileReq,
} from './type/Dataset'
import { TResponseType } from './type/commonResponse'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPrivate.post(`/api/dataset_list/${user_id}?user_id=${user_id}`)
    return data
  },

  //request Google signed URL with object name
  getSignedUrl: async (payload: ISignedUrlReq): Promise<TResponseType<ISignedUrlRes>> => {
    const config = {
      headers: {
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
      },
    }
    const { data } = await axiosPrivate.get(`/api/v1/get_signed_url/${payload.object_name}`, config)
    return data
  },

  //upload to GCS with Signed URL
  uploadFileToGcs: async (payload: IUploadFileReq): Promise<any> => {
    const axiosInstance = axios.create({
      baseURL: payload.signedUrl,
    })

    const config = {
      headers: {
        'Content-Type': payload.file.type,
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
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
        'object-size': payload.object_size,
      },
    }

    const state = payload.status
    const { data } = await axiosPrivate.post(
      `/api/v1/notify_upload/${payload.object_name}?status=${payload.status}`,
      {},
      config
    )
    return { data, state }
  },

  // Save metadata to generate AI model
  saveModelData: async (payload: IModelDataSaveReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'company-id': localStorage.getItem('companyId'),
        'user-id': localStorage.getItem('userId'),
      },
    }
    const { data } = await axiosProgress.post(`/api/v1/save_new/${payload.object_name}`, payload.data, config)
    return data
  },

  editDataset: async (payload: IDatasetEditReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPrivate.patch(
      `/api/edit_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}&ds_name=${payload.ds_name}&ds_desc=${payload.ds_desc}`
    )
    return data
  },

  deleteDataset: async (payload: IDatasetReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPrivate.delete(
      `/api/delete_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}`
    )
    return data
  },
}

export default DatasetApi
