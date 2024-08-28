import styled from '@emotion/styled'
import XaiApi from 'apis/XaiApi'
import { useEffect, useState } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
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

  const handleClick = () => {
    console.log('click')
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title style={{ marginLeft: '30px', marginBottom: 10 }}>{t('API Generator')}</Title>
      </div>
      <SavedModelList data={data} onSelect={handleSelect} />
      <ApiSyntax />
    </>
  )
}
export default ApiService

const Title = styled.div`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: #002d65;
  font-size: 32px;
  display: flex;
  float: left;
`
