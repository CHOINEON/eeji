import { Empty } from 'antd'
import { IModelInfo, IModelList } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuTitle } from '../Input/Text'
import ModelListTable from './ModelListTable'

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
    <div className="px-5 py-10 flex flex-wrap overflow-y-scroll ">
      <MenuTitle>{t('Model List')}</MenuTitle>
      <div>
        {list?.length > 0 ? (
          <div className="mt-10">
            <ModelListTable />
          </div>
        ) : (
          <div className="m-auto flex items-center min-h-[50vh]">
            <Empty />
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelList
