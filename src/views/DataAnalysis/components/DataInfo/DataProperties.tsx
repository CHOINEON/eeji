import { Col, Input, Row, Select, Typography, message } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import {
  dataPropertyState,
  summaryFetchState,
  uploadedDataState,
  userInfoState,
} from 'views/DataAnalysis/store/base/atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from '@emotion/styled'
import axios from 'axios'

const { Text } = Typography

const DataPropertiesContainer = styled.div`
  margin-top: 30px;
`

const DataProperties = () => {
  const userInfo = useRecoilValue(userInfoState)
  const [summaryFetch, setSummaryFetch] = useRecoilState(summaryFetchState)

  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const [messageApi, contextHolder] = message.useMessage()

  const [options, setOptions] = useState([{ value: '', label: '' }])

  // useEffect(() => {
  //   console.log('inputOption:', inputOption)
  // }, [inputOption])

  useEffect(() => {
    if (uploadedData && uploadedData.content.length > 0) {
      const defaultName = uploadedData.file?.name.split('.', 2)[0]
      setInputOption({ ...inputOption, name: defaultName })

      const ObjectFormatter = function (param: string) {
        return { value: param, label: param }
      }
      setOptions(Object.keys(uploadedData.content[0]).map(ObjectFormatter))
    } else {
      clearInputs()
    }
  }, [uploadedData])

  const clearInputs = () => {
    setOptions([{ value: '', label: '' }])
    setInputOption({ name: '', date_col: '', desc: '' })
  }

  const handleSelect = (param: any) => {
    setInputOption({ ...inputOption, date_col: param })
    getFileDescription(param)
  }

  const getFileDescription = (date_col: string) => {
    const url = process.env.REACT_APP_NEW_API_SERVER_URL + `/api/upload/${userInfo.user_id}?user_id=${userInfo.user_id}`
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    if (uploadedData.file && date_col !== '') {
      const formData = new FormData()

      formData.append('com_id', userInfo.com_id)
      formData.append('date_col', date_col)
      formData.append('files', uploadedData.file)

      // for (const [name, value] of formData) {
      //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
      // }
      setSummaryFetch('requested')

      axios
        .post(url, formData, config)
        .then((response) => {
          // console.log('response:', response)
          if (response.status === 200) {
            setSummaryFetch('completed')
            saveDataSummary(response.data['1'])
          }

          // setSaving(false)
        })
        .catch((error) => {
          // console.log('error:', error)
          setSummaryFetch('failed')

          if (error.response?.status === 400) {
            console.error(error.response)
            messageApi.open({
              type: 'error',
              content: error.response.data.detail,
              duration: 5,
              style: {
                margin: 'auto',
              },
            })
          } else {
            messageApi.open({
              type: 'error',
              content: error.name,
              duration: 5,
              style: {
                margin: 'auto',
              },
            })
          }
        })
    }
  }

  const saveDataSummary = (data: any) => {
    // console.log('saveDataSummary:', data)
    // console.log('before update:', uploadedData)

    setUploadedData({
      ...uploadedData,
      rowCount: data.row_count,
      colCount: data.column_count,
      startDate: data.start_date,
      endDate: data.end_date,
    })
  }

  const handleChange = (e: any) => {
    setInputOption({ ...inputOption, name: e.target.value })
  }

  return (
    <>
      <DataPropertiesContainer>
        <Title level={4} style={{ color: '#002D65' }}>
          Properties
        </Title>
        <Row justify="space-evenly" gutter={24}>
          <Col md={12}>
            {' '}
            <Text type="danger">* </Text>
            <span> Dataset Name</span>
            <Input
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              placeholder="Dataset Name"
              maxLength={20}
              onChange={handleChange}
              value={inputOption.name}
              allowClear
            />
          </Col>
          <Col md={12}>
            {' '}
            <Text type="danger">* </Text>
            <span> Timestamp Column</span>
            <Select
              style={{
                width: 120,
                backgroundColor: '#fff !important',
                border: '1px solid #A3AFCF',
                borderRadius: '10px',
              }}
              value={inputOption.date_col}
              placeholder="Timestamp Column"
              options={options}
              // defaultValue={options[0]}
              onSelect={handleSelect}
            />
          </Col>
        </Row>
        <Row>
          {' '}
          <span> Description(Optional)</span>
          <TextArea
            style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
            value={inputOption.desc}
            onChange={(e) => setInputOption({ ...inputOption, desc: e.target.value })}
            placeholder="Description"
            maxLength={50}
            allowClear
            autoSize={{ minRows: 2, maxRows: 2 }}
          />
        </Row>
      </DataPropertiesContainer>
      {contextHolder}
    </>
  )
}

export default DataProperties
