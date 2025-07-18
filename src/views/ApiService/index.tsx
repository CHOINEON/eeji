import XaiApi from 'apis/XaiApi'
import { useEffect, useState } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { MenuTitle } from 'views/AIModelGenerator/components/Input/Text'
import ApiSyntax from './ApiSyntax'
import SavedModelList from './PublishableModelList'

const ApiService = () => {
  const { t } = useTranslation()
  const [selectedRow, setSelectedRow] = useState()
  const [data, setData] = useState([])

  const { mutate: mutateGetModelList } = useMutation(XaiApi.getSavedModelList, {
    onSuccess: (result: any) => {
      // console.log('mutateGetModelList:', result)
      setData(result.data)
    },
    onError: (error: any, query: any) => {
      //
    },
  })

  useEffect(() => {
    mutateGetModelList({ user_id: localStorage.getItem('userId') })

    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/api-service',
        pageTitle: 'REST Api Service',
        user_id: localStorage.getItem('userId'),
      },
    }
    TagManager.dataLayer(args)
  }, [])

  const handleSelect = (param: any) => {
    setSelectedRow(param)
  }

  return (
    <>
      <div className="mx-[30px] pt-5">
        <MenuTitle>{t('API Generator')}</MenuTitle>
      </div>
      <div className="mx-5">
        <SavedModelList data={data} onSelect={handleSelect} />
        <ApiSyntax />
      </div>
    </>
  )
}
export default ApiService
