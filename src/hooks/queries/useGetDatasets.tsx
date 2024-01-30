import { useQuery } from 'react-query'
import DatasetApi from 'apis/DatasetApi'
import { IDatasetList } from 'apis/type/Dataset'
import { TResponseType } from 'apis/type/commonResponse'

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
