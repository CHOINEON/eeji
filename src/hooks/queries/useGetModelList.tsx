import ModelApi from 'apis/ModelApi'
import { IModelList } from 'apis/type/Model'
import { TResponseType } from 'apis/type/commonResponse'
import { useQuery } from 'react-query'

const useGetModelList = (user_id: string) => {
  const { status, data } = useQuery<TResponseType<IModelList>, unknown>(
    ['models'],
    () => ModelApi.getModelStatusList(user_id),
    {
      retry: 10, //오류 표시하기 전에 실패한 요청을 10번 재시도
      refetchOnWindowFocus: true, //윈도우가 포커싱 될 때마다 refetch
      refetchInterval: 60000, //1분 주기
    }
  )
  return { status, data }
}

export default useGetModelList
