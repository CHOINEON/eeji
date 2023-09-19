import { Col, Input, Row, Select, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { optionListState, uploadDataAtom, uploadFileInfoAtom } from 'views/DataAnalysis/store/base/atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from '@emotion/styled'

const { Text } = Typography

const DataPropertiesContainer = styled.div`
  margin-top: 30px;
`

const DataProperties = () => {
  const uploadData = useRecoilValue(uploadDataAtom)
  const uploadFileInfo = useRecoilValue(uploadFileInfoAtom)
  const [inputOption, setInputOption] = useRecoilState(optionListState)

  const [options, setOptions] = useState([{ value: '', label: '' }])

  // useEffect(() => {
  //   console.log('inputOption:', inputOption)
  // }, [inputOption])

  useEffect(() => {
    if (uploadData && uploadData.length > 0) {
      const defaultName = uploadFileInfo?.name.split('.', 2)[0]
      setInputOption({ ...inputOption, name: defaultName })

      const ObjectFormatter = function (param: string) {
        return { value: param, label: param }
      }
      setOptions(Object.keys(uploadData[0]).map(ObjectFormatter))
    } else {
      clearInputs()
    }
  }, [uploadData])

  const clearInputs = () => {
    setOptions([{ value: '', label: '' }])
    setInputOption({ name: '', date_col: '', desc: '' })
  }

  const handleSelect = (param: any) => {
    setInputOption({ ...inputOption, date_col: param })
  }

  const handleChange = (e: any) => {
    setInputOption({ ...inputOption, name: e.target.value })
  }

  return (
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
  )
}

export default DataProperties
