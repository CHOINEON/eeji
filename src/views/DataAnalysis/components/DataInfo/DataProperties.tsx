import { Col, Input, Row, Select, Typography, message } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { dataPropertyState, uploadedDataState, userInfoState } from 'views/DataAnalysis/store/dataset/atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from '@emotion/styled'
import { QueryClient, useMutation, useQueryClient } from 'react-query'
import DatasetApi from 'apis/DatasetApi'
import { useApiError } from 'hooks/useApiError'
import { useToast } from 'hooks/useToast'

const { Text } = Typography

const DataPropertiesContainer = styled.div`
  margin-top: 30px;
`

const DataProperties = () => {
  const { fireToast } = useToast()
  const userInfo = useRecoilValue(userInfoState)

  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const [options, setOptions] = useState([{ value: '', label: '' }])

  const { handleError } = useApiError()
  const { mutate } = useMutation(DatasetApi.uploadDataset, {
    onSuccess: (response: any) => {
      console.log('uploadDataset success:', response)
      // setSummaryFetch('completed')
      fireToast('request success')
      saveDataSummary(response['1'])
    },
    onError: (error: any) => {
      console.log('DataProperties/ onError :', error)
      handleError(error)
    },
  })

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
    if (uploadedData.file && date_col !== '') {
      const formData = new FormData()

      formData.append('com_id', userInfo.com_id)
      formData.append('date_col', date_col)
      formData.append('files', uploadedData.file)

      const user_id = localStorage.getItem('userId').toString()
      mutate({ user_id, formData })
    }
  }

  const saveDataSummary = (data: any) => {
    // console.log('saveDataSummary:', data)

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
    </>
  )
}

export default DataProperties
