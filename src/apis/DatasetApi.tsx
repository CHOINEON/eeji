import { axiosPrivate } from './axios'
import { IDatasetList, IDataUploadReq, IDatasetReq, IDatasetEditReq } from './type/Dataset'
import { TResponseType } from './type/commonResponse'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPrivate.post(`/api/dataset_list/${user_id}?user_id=${user_id}`)
    return data
  },

  //파일 업로드 후 description 내려받기
  uploadDataset: async (payload: IDataUploadReq): Promise<TResponseType<object>> => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const { data } = await axiosPrivate.post(
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
    const { data } = await axiosPrivate.post(
      `/api/save_new/${payload.user_id}?user_id=${payload.user_id}`,
      payload.formData,
      config
    )
    return data
  },

  //데이터셋 수정하기(edit)
  editDataset: async (payload: IDatasetEditReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPrivate.patch(`/api/edit_data/${payload.user_id}`, payload)
    return data
  },

  //데이터셋 삭제하기(delete)
  deleteDataset: async (payload: IDatasetReq): Promise<TResponseType<string>> => {
    const { data } = await axiosPrivate.delete(`/api/delete_data/${payload.user_id}`, { data: payload })
    return data
  },
}

export default DatasetApi
