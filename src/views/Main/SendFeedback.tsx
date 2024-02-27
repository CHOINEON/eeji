import React, { useState } from 'react'
import { Input, Rate } from 'antd'
import { CustomButton } from '../AIModelGenerator/components/DataInfo/DataImportModal'
import styled from '@emotion/styled'
import ColumnLabel from 'components/fields/ColumnLabel'
import CustomerServiceApi from 'apis/CustomerServiceApi'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { modalState } from 'stores/modal'

const SendFeedback = () => {
  const { TextArea } = Input
  const [rate, setRate] = useState(2.5)
  const [contents, setContents] = useState({ email: '', text: '' })
  const [modal, setModal] = useRecoilState(modalState)

  const { mutate: mutateSend } = useMutation(CustomerServiceApi.postCustomerFeedback, {
    onSuccess: (response: any) => {
      console.log('mutateSend;', response)
      alert('성공!')
      setModal(null)
    },
    onError: (error: any, query: any) => {
      console.error(error)
      alert('관리자에게 문의하세요')
    },
  })
  const handleClick = () => {
    const param = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      rate: rate,
      email: contents.email || '',
      feedback: contents.text || '',
    }

    mutateSend(param)
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <InputLabel>Rate your experience</InputLabel>
        <Rate allowHalf onChange={setRate} value={rate} />
      </div>
      <div style={{ marginTop: '30px' }}>
        <ColumnLabel required={true} label="Email Address" />
        <Input
          placeholder="Enter your Email"
          onChange={(e: any) => setContents({ ...contents, email: e.target.value })}
        />

        <ColumnLabel required={true} label="Message" />
        <TextArea
          style={{ height: 120, resize: 'none' }}
          // allowClear
          rows={5}
          onChange={(e: any) => setContents({ ...contents, text: e.target.value })}
          placeholder="If you have any additional feedback, please type it in here..."
        />
      </div>
      <div style={{ marginTop: '40px' }}>
        <CustomButton visible={true} onClick={handleClick}>
          Send
        </CustomButton>
      </div>
    </>
  )
}

export default SendFeedback

const InputLabel = styled.div`
  color: #002d65;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  margin: 5px 3px;
`
