import React, { useEffect, useState } from 'react'
import { Button, Modal, Input, Select, Space } from 'antd'

const SetValueModal = (props: any) => {
  const { visible, onClose, onGetValue } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    console.log('visible::', visible)
    setIsModalOpen(visible)
  }, [visible])

  //   const showModal = () => {
  //     setIsModalOpen(true)
  //   }

  const handleOk = () => {
    onGetValue(inputValue)
    setIsModalOpen(false)
    setInputValue('')
    onClose(false)
  }

  const handleCancel = () => {
    // console.log('close')
    onClose(false)
    setIsModalOpen(false)
    setInputValue('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('Change:', e.target.value)
    setInputValue(e.target.value)
  }

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal title="Set Threshold" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Space direction="vertical" size="middle">
          <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue="" type="number" onChange={onChange} value={inputValue} />
            {/* <Button type="primary">Save</Button> */}
          </Space.Compact>
        </Space>
      </Modal>
    </>
  )
}

export default SetValueModal
