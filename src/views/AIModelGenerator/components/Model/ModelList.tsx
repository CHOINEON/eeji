import { Empty } from 'antd'
import { IModelInfo, IModelList } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModelStateList from './ModelStateRow'

const ModelList = () => {
  const { t } = useTranslation()
  const { data } = useGetModelList(localStorage.getItem('userId'))
  const [list, setList] = useState<IModelInfo[] | undefined>([])

  useEffect(() => {
    if (typeof data === 'object') {
      setList(data as IModelList)
    }
  }, [data])

  return (
    <div className="max-h-[76vh] p-10 flex flex-wrap overflow-y-scroll ">
      <p className="w-100 font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65]">{t('Model List')}</p>
      {list?.length > 0 ? (
        <ModelStateList data={list} />
      ) : (
        <div className="m-auto flex items-center min-h-[50vh]">
          <Empty />
        </div>
      )}
    </div>
  )
}

export default ModelList
