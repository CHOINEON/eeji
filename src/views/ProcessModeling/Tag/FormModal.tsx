import React, { useEffect, useState, useRef } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Row, Divider, Space } from 'antd'
import { isTemplateSpan } from 'typescript'
import type { InputRef } from 'antd'

interface FormModalProps {
  show: any
  type: string
  onSaveClick: () => void
  onCloseClick: () => void
}

const index: any = 0
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

export const FormModal: React.FC<FormModalProps> = (props) => {
  const { show, type, onSaveClick, onCloseClick } = props
  const [visible, setVisible] = React.useState(show)
  const [items, setItems] = React.useState(['%', 'kg'])
  const [name, setName] = React.useState('')
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (type === 'add') {
    } else if (type === 'update') {
    }
    setVisible(show)
  }, [props])

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()

    if (name.replace(/\s+/g, '') !== '') setItems([...items, name])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleOk = () => {
    setVisible(false)
    onSaveClick()
  }

  const handleCancel = () => {
    setVisible(false)
    onCloseClick()
  }

  return (
    <Modal
      title="태그 등록"
      open={visible}
      //   closable
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={300}
    >
      <Row>
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 40 }} style={{ maxWidth: 400 }}>
          <Form.Item label="Tag Name">
            <Input />
          </Form.Item>
          <Form.Item label="Units">
            <Select
              options={items.map((item) => ({ label: item, value: item }))}
              dropdownRender={(items) => (
                <>
                  {items}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input placeholder="Please enter units" value={name} onChange={onNameChange} />
                  </Space>
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add units
                  </Button>
                </>
              )}
            ></Select>
          </Form.Item>
          <Form.Item label="Description">
            <Input />
          </Form.Item>
          {/* <Form.Item {...tailLayout}>
            <Button htmlType="submit" type="primary">
              submit
            </Button>
          </Form.Item> */}
        </Form>
      </Row>
    </Modal>
  )
}

export default FormModal
