import axios from 'axios'
import { axiosProgress, axiosPublic } from './axios'
import { TResponseType } from './type/commonResponse'
import {
  IDatasetEditReq,
  IDatasetList,
  IDatasetReq,
  IDataUploadReq,
  ISignedUrlReq,
  ISignedUrlRes,
  IUploadFileReq,
} from './type/Dataset'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPublic.post(`/api/dataset_list/${user_id}?user_id=${user_id}`)
    return data
  },

  //get Google signed URL from backend
  signedUrl: async (payload: ISignedUrlReq): Promise<TResponseType<ISignedUrlRes>> => {
    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
    const { data } = await axiosPublic.post(`/api/get_surl/${payload.user_id}`, payload.formData, config)
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
    }

    const { data } = await axiosInstance.put(payload.signedUrl, payload.file, config)
    return data
  },

  //파일 업로드 후 description 내려받기
  uploadDataset: async (payload: IDataUploadReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const { data } = await axiosPublic.post(
      `/api/upload_new/${payload.user_id}?user_id=${payload.user_id}&is_classification=${payload.is_classification}`,
      payload.formData,
      config
    )
    return data
  },

  //파일을 저장하기(저장하기 버튼 클릭) => return { message: string }
  saveDataset: async (payload: IDataUploadReq): Promise<TResponseType<string>> => {
    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }

    const { data } = await axiosProgress.post(
      `/api/save_new/${payload.user_id}?user_id=${payload.user_id}`,
      payload.formData,
      config
    )

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
