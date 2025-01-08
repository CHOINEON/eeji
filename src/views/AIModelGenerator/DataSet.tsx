import { UploadOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import DatasetApi from 'apis/DatasetApi'
import ModelApi from 'apis/ModelApi'
import axios from 'axios'
import { useApiError } from 'hooks/useApiError'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import DataEditModal, { IDataInfo } from './components/DataInfo/DataEditModal'
import { MenuTitle } from './components/Input/Text'
import DatasetList from './DatasetList'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { datasetEditModalState } from './store/modal/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DataSet = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { handleError } = useApiError()

  const [loading, setLoading] = useState(false)

  const selectedData = useRecoilState(selectedDataState)
  const setUserInfo = useSetRecoilState(userInfoState)
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)
  const setModalState = useSetRecoilState(datasetEditModalState)
  const { openModal, closeModal } = useModal()

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: () => {
      message.success(t('The model training has been successfully requested.'))
      queryClient.invalidateQueries('models')
      setLoading(false)
    },
    onError: () => {
      message.error(t('The request has failed. Please try again later.'))
    },
  })

  const { mutate: mutateEdit } = useMutation(DatasetApi.editDataset, {
    onSuccess: () => {
      message.success(t('Successfully saved'))
      queryClient.invalidateQueries('datasets')
      setModalState(false)
    },
    onError: (error: unknown) => {
      console.log('DataProperties/ onError :', error)

      // Check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        handleError(error)
      } else {
        console.error('An unknown error occurred:', error)
      }
    },
  })

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  const handleGenerateModel = () => {
    const payload = {
      set_auto: true,
      user_id: localStorage.getItem('userId'),
      com_id: localStorage.getItem('companyId') || 'google',
      dataset_id: selectedData[0].ds_id,
      date_col: selectedData[0].dateCol,
      start_date: selectedData[0].startDate,
      end_date: selectedData[0].endDate,
      y_value: selectedData[0].targetY || '',
      if_classification: selectedData[0].isClassification,
    }
    mutateRunning({ type: 'request', payload: payload })
    setLoading(true)
  }

  const handleEdit = (param: IDataInfo) => {
    const payload = {
      ...param,
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
    }
    mutateEdit(payload)
  }

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
    <div className="p-10">
      <div>
        <MenuTitle className="ml-[25px] float-left">{t('Dataset')}</MenuTitle>
        <Button className="ml-5 m-2" type="primary" onClick={handleAddClick} icon={<UploadOutlined />}>
          {t('Upload')}
        </Button>
      </div>
      <div className="mt-5 ml-5">
        <DatasetList />
        <Button
          type="primary"
          className="w-100 float-right h-[46px] rounded-lg bg-[#4338F7] font-medium "
          disabled={!selectedData[0].ds_id}
          onClick={handleGenerateModel}
          loading={loading}
        >
          {t('Generate Model')}
        </Button>
      </div>
      <DataEditModal onSave={handleEdit} />
    </div>
  )
}

export default DataSet
