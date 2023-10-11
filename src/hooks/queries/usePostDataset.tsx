import { useQuery } from 'react-query'
import DatasetApi from 'apis/DatasetApi'
import { AxiosError } from 'axios'
import { IDatasetList, IDataUploadReq } from 'apis/type/Dataset'
import { TResponseType } from 'apis/type/commonResponse'

const usePostDataset = (payload: IDataUploadReq) => {
  const { status, data } = useQuery<TResponseType<unknown>, unknown>(
    ['datasets'],
    () => DatasetApi.uploadDataset(payload),
    {
      refetchOnWindowFocus: false,
      retry: false,
      refetchIntervalInBackground: false,
    }
  )

  return { status, data }
}

export default usePostDataset
