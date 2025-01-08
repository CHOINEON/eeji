import useGetDatasets from 'hooks/queries/useGetDatasets'
import { useEffect, useState } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import DatasetListTable from './DatasetListTable'
import { userInfoState } from './store/dataset/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DatasetList = () => {
  const setUserInfo = useSetRecoilState(userInfoState)
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)

  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const [dataArr, setDataArr] = useState([])

  useEffect(() => {
    resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  useEffect(() => {
    if (data) {
      const updatedData = data.data.map((item, index) => ({
        ...item,
        key: index.toString(),
      }))

      setDataArr(updatedData)
    }
  }, [data])

  return (
    <>
      <DatasetListTable data={dataArr} />
    </>
  )
}

export default DatasetList
