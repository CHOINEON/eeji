import { useTranslation } from 'react-i18next'
import { MenuTitle } from '../Input/Text'
import ModelListTable from './ModelListTable'

const ModelList = () => {
  const { t } = useTranslation()

  return (
    <div className="p-10 flex flex-wrap overflow-y-scroll ">
      <MenuTitle>{t('Model List')}</MenuTitle>
      <div className="mt-[35px]">
        <ModelListTable />
      </div>
    </div>
  )
}

export default ModelList
