import { axiosPrivate } from './axios'
import { IDatasetList } from './type/Dataset'
import { TResponseType } from './type/commonResponse'

const DatasetApi = {
  //전체 데이터셋 리스트 가져오기
  getDatasetList: async (user_id: string): Promise<TResponseType<IDatasetList>> => {
    const { data } = await axiosPrivate.get(`/api/dataset_list/${user_id}?user_id=${user_id}`)
    return data
  },
  //파일 업로드
}

export default DatasetApi
