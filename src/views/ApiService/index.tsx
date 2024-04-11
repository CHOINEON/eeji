import styled from '@emotion/styled'
import XaiApi from 'apis/XaiApi'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import ApiSyntax from './ApiSyntax'
import SavedModelList from './PublishableModelList'

const ApiService = () => {
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
  }, [])

  const handleSelect = (param: any) => {
    console.log('param:', param)
    setSelectedRow(param)
  }

  const handleClick = () => {
    console.log('click')
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Title style={{ marginLeft: '30px', marginBottom: 10 }}>API Generator</Title>
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
