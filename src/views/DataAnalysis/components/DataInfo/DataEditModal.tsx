import React, { useEffect, useState } from 'react'
import { Button, Empty, Input, Modal, Row, Space, Typography } from 'antd'
import { useRecoilState } from 'recoil'
import { datasetEditModalState } from 'views/DataAnalysis/store/modal/atom'
import TextArea from 'antd/es/input/TextArea'
import { selectedDataState } from 'views/DataAnalysis/store/base/atom'
const { Text } = Typography

const DataEditModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)
  const [modalState, setModalState] = useRecoilState(datasetEditModalState)

  useEffect(() => {
    setOpen(modalState)

    if (modalState) {
      //기존 데이터 바인딩
    }
  }, [modalState])

  const handleOk = () => {
    setModalState(false)
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
            <span> Dataset Name</span>
            <Input
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              placeholder="Dataset Name"
              maxLength={20}
              //   onChange={handleChange}
              value={selectedData.name}
              allowClear
            />
          </Row>
          <Row>
            {' '}
            <span> Description(Optional)</span>
            <TextArea
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              value={selectedData.descr === 'null' ? '' : selectedData.descr}
              // onChange={(e) => setInputOption({ ...inputOption, desc: e.target.value })}
              placeholder="Description"
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
