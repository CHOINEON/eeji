import DatasetApi from 'apis/DatasetApi'
import { TResponseType } from 'apis/type/commonResponse'
import { IDatasetList } from 'apis/type/Dataset'
import { useQuery } from 'react-query'

const useGetDatasets = (user_id: string) => {
  const { status, data } = useQuery<TResponseType<IDatasetList>, unknown>(
    ['datasets'],
    () => DatasetApi.getDatasetList(user_id),
    {
      refetchOnWindowFocus: false,
      retry: true,
      refetchIntervalInBackground: false,
    }
  )
  return { status, data }
}

export default useGetDatasets
