import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import DatasetListTable from './DatasetListTable'
import { userInfoState } from './store/dataset/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DatasetList = () => {
  const { t } = useTranslation()
  const { openModal, closeModal } = useModal()

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
      <DatasetListTable data={dataArr} />
    </>
  )
}

export default DatasetList
