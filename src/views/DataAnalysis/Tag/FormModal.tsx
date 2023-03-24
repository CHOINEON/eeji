import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Modal, Select, Row, Divider, Space } from 'antd'
import type { InputRef } from 'antd'
import axios from 'axios'

interface FormModalProps {
  show: any
  type: string
  onSaveClick: () => void
  onCloseClick: () => void
  selectedData: FieldData
  onRowEditted: () => void
}

interface FieldData {
  id?: number
  name: string
  unit: string
  description: string
}

interface CustomizedFormProps {
  onChange: (fields: FieldData) => void
  fields: FieldData[]
}

const CustomizedForm: React.FC<CustomizedFormProps> = ({ onChange, fields }) => (
  <Form
    name="test"
    layout="inline"
    fields={fields}
    onFieldsChange={(_: any, allFields: any) => {
      onChange(allFields)
    }}
  >
    <Form.Item name="name" label="TagName" required>
      <Input />
    </Form.Item>
    <Form.Item name="unit" label="Units">
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input />
    </Form.Item>
  </Form>
)

export const FormModal: React.FC<FormModalProps> = (props) => {
  const { show, type, onSaveClick, onCloseClick, selectedData, onRowEditted } = props
  const [modalTitle, setModalTitle] = useState('태그 등록')
  const [visible, setVisible] = React.useState(show)
  const [items, setItems] = React.useState(['%', 'kg'])
  const [name, setName] = React.useState('')
  const inputRef = useRef<InputRef>(null)

  const [newFieldData, setNewFieldData] = useState({})
  const [fields, setFields] = useState<FieldData[]>([{ id: 0, name: '', unit: '', description: '' }])

  useEffect(() => {
    // console.log(props)
    if (type === 'add') {
      setModalTitle('태그 등록')
    } else if (type === 'update') {
      setModalTitle('태그 수정')

      // const tempArray: Array<FieldData> = [{ id: 0, name: '', unit: '', description: '' }]
      // console.log('tempArray:', tempArray)
      // //tempArray.push(selectedData)
      // setFields(tempArray)
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
    handleSave()
    onSaveClick()
  }

  const handleSave = () => {
    if (type === 'add') {
      console.log('add:::', JSON.stringify(newFieldData))
      axios
        .post('http://ec2-3-220-205-197.compute-1.amazonaws.com:9871/createTag', JSON.stringify(newFieldData), {
          headers: {
            'Content-Type': `application/json`,
          },
        })
        .then((response) => {
          console.log('resp:', response)
          if (response.status == 200) {
            alert('success')
            //let parent know something's changed
            onRowEditted()
            //clear form
            setNewFieldData({ name: '', unit: '', description: '' })
          }
        })
        .catch((error) => error('failed'))
    } else if (type === 'update') {
      // console.log('update::', fields)
      axios
        .put('http://ec2-3-220-205-197.compute-1.amazonaws.com:9871/updateTag', fields)
        // axios({
        //   method: 'put',
        //   url: 'http://ec2-3-220-205-197.compute-1.amazonaws.com:9871/updateTag',
        //   params: {
        //     id: '3',
        //     unit: '%',
        //     name: '?',
        //     desc: 'idk',
        //   },
        // })
        .then((response) => {
          console.log('resp:', response)
          if (response.status == 200) {
            //let parent know something's changed
            onRowEditted()
          }
        })
        .catch((error) => error('failed'))
    }
  }

  const handleCancel = () => {
    setVisible(false)
    onCloseClick()
  }

  const handleChange = (newFields: any) => {
    // console.log('newFields:', newFields)
    // setFields(newFields)

    const newFieldData: FieldData = {
      name: newFields[0].value,
      unit: newFields[1].value,
      description: newFields[2].value,
    }

    setNewFieldData([newFieldData])
    // console.log('------newFieldData:', newFieldData)
    // setFields(newFieldData)
  }

  return (
    <Modal
      title={modalTitle}
      open={visible}
      closable
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={300}
    >
      <Row>
        <CustomizedForm fields={fields} onChange={handleChange}></CustomizedForm>
      </Row>
    </Modal>
  )
}

export default FormModal
