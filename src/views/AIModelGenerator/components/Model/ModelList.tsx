import { IModelInfo, IModelList } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import ModelStateList from './ModelStateRow'

const ModelList = () => {
  const { data } = useGetModelList(localStorage.getItem('userId'))
  const [list, setList] = useState<IModelInfo[] | undefined>([])

  useEffect(() => {
    if (typeof data === 'object') {
      setList(data as IModelList)
    }
  }, [data])

  return (
    <div className="max-h-[76vh] p-10 flex flex-wrap overflow-y-scroll ">
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">Model List</p>
      <ModelStateList data={list} />
    </div>
  )
}

export default ModelList
