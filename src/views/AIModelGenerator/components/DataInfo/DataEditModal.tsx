import { Input, Modal, Row, Space, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { datasetEditModalState } from 'views/AIModelGenerator/store/modal/atom'
const { Text } = Typography

export interface IDataInfo {
  ds_id: string
  ds_name: string
  ds_desc: string
}

interface DatasetEditProps {
  onSave: (payload: IDataInfo) => void
}

const DataEditModal = ({ onSave }: DatasetEditProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [modalState, setModalState] = useRecoilState(datasetEditModalState)
  const selectedData = useRecoilValue(selectedDataState)
  const [inputData, setInputData] = useState({ name: '', desc: '' })

  useEffect(() => {
    setOpen(modalState)

    if (modalState) {
      setInputData({ name: selectedData.name, desc: selectedData.descr })
    }
  }, [modalState])

  const handleOk = () => {
    const param: IDataInfo = {
      ds_id: selectedData.ds_id,
      ds_name: inputData.name,
      ds_desc: inputData.desc,
    }
    onSave(param)
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
              placeholder={t('The dataset name can be up to 100 characters long.')}
              maxLength={20}
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              value={inputData.name}
              allowClear
            />
          </Row>
          <Row>
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
