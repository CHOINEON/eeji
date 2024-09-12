import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import NewDatasetList from './NewDatasetList'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DatasetList = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { openModal, closeModal } = useModal()

  const setUserInfo = useSetRecoilState(userInfoState)
  const setSelectedData = useSetRecoilState(selectedDataState)
  // const setUsedVariable = useSetRecoilState(usedVariableStore)

  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)

  const { data } = useGetDatasets(localStorage.getItem('userId'))
  const [dataArr, setDataArr] = useState([])

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
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
      setLoading(false)
    } else setLoading(true)
  }, [data])

  const handleAddClick = () => {
    openModal({
      modalTitle: t('Data Upload'),
      modalType: 'DataImport',
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  return (
    <>
      <div className="text-right">
        <Button type="text" onClick={handleAddClick} icon={<UploadOutlined />}>
          {t('Upload')}
        </Button>
      </div>
      <NewDatasetList data={dataArr} />
    </>
  )
}

export default DatasetList
