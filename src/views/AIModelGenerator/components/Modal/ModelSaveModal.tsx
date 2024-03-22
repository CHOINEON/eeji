import styled from '@emotion/styled'
import { Input, App, Row, Spin, Typography } from 'antd'
import useModal from 'hooks/useModal'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { dataPropertyState } from 'views/AIModelGenerator/store/dataset/atom'
import { CustomButton } from '../DataInfo/DataImportModal'
import { getNowDateTime } from 'utils/DateFunction'
import { useMutation } from 'react-query'
import ModelApi from 'apis/ModelApi'
import TextArea from 'antd/es/input/TextArea'

const ModelSaveModal = (props: any) => {
  // console.log('ModelSaveModal modal:', props)
  const { message } = App.useApp()
  const { openModal, closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(`Model_`)
  const [description, setDescription] = useState('')

  const dataProperty = useRecoilValue(dataPropertyState)
  const { mutate: mutateSaveModel } = useMutation(ModelApi.saveGeneratedModel, {
    onSuccess: (response: any) => {
      console.log('save response:', response)
      setLoading(false)
      message.success(response.message)
      closeModal()
    },
    onError: (error: any, query: any) => {
      // console.error(error)
    },
  })

  useEffect(() => {
    setName(`Model_${dataProperty.name}_${getNowDateTime()}`)
  }, [])

  const handleClick = () => {
    setLoading(true)

    const userId = localStorage.getItem('userId')
    const companyId = localStorage.getItem('companyId')

    const payload = {
      user_id: userId,
      com_id: companyId,
      uuid: props.payload.uuid,
      model_name: name,
      target_y: props.payload.target_y,
      is_classification: 0,
      descr: description,
    }
    // console.log('save payload:', payload)
    mutateSaveModel(payload)
  }

  return (
    <Spin tip="Loading" size="large" spinning={loading}>
      <div>
        <Row>
          {/* <Text type="danger">* </Text>
        <SubText> Model Name</SubText> */}
          <Input
            style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
            placeholder="Type model name here..."
            // maxLength={30}
            onChange={(e) => setName(e.target.value)}
            value={name}
            allowClear
          />
        </Row>
        <Row className="mt-4">
          <TextArea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Description"
            autoSize={{ minRows: 3, maxRows: 2 }}
            maxLength={50}
          />
        </Row>
        <CustomButton
          visible={true}
          style={{ height: 40, marginTop: '30px', fontSize: 15, fontWeight: 'bold' }}
          onClick={handleClick}
        >
          Save
        </CustomButton>
      </div>
    </Spin>
  )
}

export default ModelSaveModal

const MainText = styled.p`
  font-family: '본고딕';
  font-weight: bold;
  color: #002d65;
  font-size: 20px;
`
const SubText = styled.p`
  font-family: '본고딕';
  color: #002d65;
  font-size: 13px;
`
