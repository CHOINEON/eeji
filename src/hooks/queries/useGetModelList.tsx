import ModelApi from 'apis/ModelApi'
import { IModelList } from 'apis/type/Model'
import { TResponseType } from 'apis/type/commonResponse'
import { useQuery } from 'react-query'

const useGetModelList = (user_id: string) => {
  const { status, data } = useQuery<TResponseType<IModelList>, unknown>(
    ['models'],
    () => ModelApi.getModelStatusList(user_id),
    {
      refetchOnWindowFocus: true,
      retry: true,
      refetchIntervalInBackground: true,
    }
  )
  return { status, data }
}

export default useGetModelList
