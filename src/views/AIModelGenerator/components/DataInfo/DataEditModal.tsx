import { App, Input, Modal, Row, Space, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import DatasetApi from 'apis/DatasetApi'
import { useApiError } from 'hooks/useApiError'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilState } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { datasetEditModalState } from 'views/AIModelGenerator/store/modal/atom'
const { Text } = Typography

const DataEditModal = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [modalState, setModalState] = useRecoilState(datasetEditModalState)
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)
  const [inputData, setInputData] = useState({ name: '', desc: '' })

  //API
  const { handleError } = useApiError()
  const { mutate: mutateEdit } = useMutation(DatasetApi.editDataset, {
    onSuccess: (response: any) => {
      message.success(response?.message)
      //refetching
      queryClient.invalidateQueries('datasets')
      setModalState(false)
    },
    onError: (error: any) => {
      console.log('DataProperties/ onError :', error)
      handleError(error)
    },
  })

  useEffect(() => {
    setOpen(modalState)

    if (modalState) {
      //기존 데이터 바인딩
      setInputData({ name: selectedData.name, desc: selectedData.descr })
    }
  }, [modalState])

  const handleOk = () => {
    const param = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      ds_id: selectedData.ds_id,
      ds_name: inputData.name,
      ds_desc: inputData.desc,
    }
    mutateEdit(param)
  }

  const handleCancel = () => {
    setModalState(false)
  }

  return (
    <>
      <Modal title="Edit Dataset" open={open} onOk={handleOk} onCancel={handleCancel}>
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
          <Row>
            <Text type="danger">* </Text>
            <span> {t('Dataset Name')}</span>
            <Input
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              placeholder={t('Dataset Name')}
              maxLength={20}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              value={inputData.name}
              allowClear
            />
          </Row>
          <Row>
            {' '}
            <span> {t('Description')}</span>
            <TextArea
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              value={inputData.desc}
              onChange={(e) => setInputData({ ...inputData, desc: e.target.value })}
              placeholder={t('Description')}
              maxLength={50}
              allowClear
              autoSize={{ minRows: 2, maxRows: 2 }}
            />
          </Row>
        </Space>
      </Modal>
    </>
  )
}

export default DataEditModal
