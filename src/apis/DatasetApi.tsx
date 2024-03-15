import { axiosPublic, axiosProgress } from './axios'
import { IDatasetList, IDataUploadReq, IDatasetReq, IDatasetEditReq } from './type/Dataset'
import { TResponseType } from './type/commonResponse'
import useAxiosInterceptor from 'hooks/useAxiosInterceptor'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPublic.post(`/api/dataset_list/${user_id}?user_id=${user_id}`)
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
      // onUploadProgress: (e: any) => {
      //   const percentCompleted = Math.round((e.loaded / e.total) * 100)
      //   // setProgressValue({ progress: percentCompleted, isLoading: percentCompleted ? true : false })
      // },
    }

    const { data } = await axiosProgress.post(
      `/api/save_new/${payload.user_id}?user_id=${payload.user_id}`,
      payload.formData,
      config
    )

    return data
  },

  //데이터셋 수정하기(edit)  --- 24.01.25 백엔드 요청에 따라 QueryString으로 변경함
  // editDataset: async (payload: IDatasetEditReq): Promise<TResponseType<string>> => {
  //   const { data } = await axiosPrivate.patch(`/api/edit_data/${payload.user_id}`, payload)
  //   return data
  // },'

  editDataset: async (payload: IDatasetEditReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPublic.patch(
      `/api/edit_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}&ds_name=${payload.ds_name}&ds_desc=${payload.ds_desc}`
    )
    return data
  },

  //데이터셋 삭제하기(delete) --- 24.01.25 백엔드 요청에 따라 QueryString으로 변경함
  // deleteDataset: async (payload: IDatasetReq): Promise<TResponseType<string>> => {
  //   const { data } = await axiosPrivate.delete(`/api/delete_data/${payload.user_id}`, { data: payload })
  //   return data
  // },

  deleteDataset: async (payload: IDatasetReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPublic.delete(
      `/api/delete_data/${payload.user_id}?com_id=${payload.com_id}&ds_id=${payload.ds_id}`
    )
    return data
  },
}

export default DatasetApi
