import { Col, Input, Row, Select, Typography, message, Spin, Radio, RadioChangeEvent } from 'antd'
import React, { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { dataPropertyState, uploadedDataState, userInfoState } from 'views/DataAnalysis/store/dataset/atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from '@emotion/styled'
import { QueryClient, useMutation, useQueryClient } from 'react-query'
import DatasetApi from 'apis/DatasetApi'
import { useApiError } from 'hooks/useApiError'
import { useToast } from 'hooks/useToast'
import ColumnLabel from 'components/fields/ColumnLabel'

const DataProperties = () => {
  const { fireToast } = useToast()
  const [uploading, setUploading] = useState(false)
  const userInfo = useRecoilValue(userInfoState)
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const [options, setOptions] = useState([{ value: '', label: '' }])

  const { handleError } = useApiError()
  const { mutate } = useMutation(DatasetApi.uploadDataset, {
    onSuccess: (response: any) => {
      console.log(' /api/upload/{user_id}', response)
      // setSummaryFetch('completed')
      fireToast('request success')
      saveDataSummary(response['1'])
      setUploading(false)
      setSummaryLoaded(true)
    },
    onError: (error: any) => {
      // console.log('DataProperties/ onError :', error)
      handleError(error)
    },
  })

  useEffect(() => {
    // console.log('------------Data property -------:', uploadedData)
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
    setInputOption({ algo_type: 1, date_format: '', name: '', date_col: '', target_y: '', desc: '' })
    setSummaryLoaded(false)
  }

  const handleSelectDateCol = (param: any) => {
    setInputOption({ ...inputOption, date_col: param })
  }

  const handleSelectY = (param: any) => {
    setInputOption({ ...inputOption, target_y: param })
  }

  useEffect(() => {
    // console.log('   inputOption::', inputOption)
    // console.log('   uploadedData::', uploadedData)
    // console.log('   summaryLoaded::', summaryLoaded)

    if (uploadedData.file && !summaryLoaded && Object.keys(inputOption).length > 0) {
      getFileDescription()
    }

    // if (inputOption.name.length > 0 && inputOption.date_col.length > 0 && inputOption.target_y.length > 0) {
    //   setUploading(true)
    // }
  }, [inputOption])

  const getFileDescription = () => {
    // console.log('uploadData:', uploadedData)
    // console.log('inputOption:', inputOption)

    if (uploadedData.file && inputOption.target_y !== '') {
      const formData = new FormData()

      formData.append('com_id', userInfo.com_id)
      formData.append('date_col', inputOption.date_col)
      // formData.append('is_classification', inputOption.algo_type.toString())
      formData.append('target_y', inputOption.target_y)
      formData.append('files', uploadedData.file)

      // for (const [name, value] of formData) {
      //   console.log(`${name} = ${value}`) // key1 = value1, then key2 = value2
      // }

      const user_id = localStorage.getItem('userId').toString()
      const is_classification = inputOption.algo_type
      mutate({ user_id, is_classification, formData })
    }
  }

  const saveDataSummary = (data: any) => {
    // console.log('saveDataSummary:', data)

    setUploadedData({
      ...uploadedData,
      rowCount: data.row_count,
      colCount: data.column_count,
      startDate: data.start_date !== 'null' ? data.start_date : '-',
      endDate: data.end_date !== 'null' ? data.end_date : '-',
    })
  }

  // useEffect(() => {
  //   console.log('inputOption::', inputOption)
  // }, [inputOption])

  const handleChange = (e: any) => {
    console.log('name changed:', e.target.value)
    setInputOption({ ...inputOption, name: e.target.value })
  }

  const onChangeRadio = (e: RadioChangeEvent) => {
    setInputOption({ ...inputOption, algo_type: e.target.value })
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputOption({ ...inputOption, date_format: e.target.value })
  }

  return (
    <Spin tip="업로드 파일 분석 중 ..." spinning={uploading} style={{ marginTop: '100px' }}>
      <DataPropertiesContainer>
        <Row gutter={[32, 4]}>
          <Col span={24}>
            <ColumnLabel required={true} label="Algorithm Type" />
            <Radio.Group onChange={onChangeRadio} value={inputOption.algo_type}>
              <Radio value={1}>Classification</Radio>
              <Radio value={0}>Regression</Radio>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <ColumnLabel required={true} label="Dataset Name" />
            <Input
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              placeholder="Dataset Name"
              maxLength={20}
              onChange={handleChange}
              value={inputOption.name}
              allowClear
            />
          </Col>

          <Col span={24} /*style={{ display: inputOption.algo_type == 2 ? 'block' : 'none' }} */>
            <ColumnLabel required={false} label="Timestamp" />
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
              onSelect={handleSelectDateCol}
            />
          </Col>

          {/* <Col span={24} style={{ display: inputOption.algo_type == 2 ? 'block' : 'none' }}>
            <ColumnLabel required={true} label="Timestamp Format" />
            <Input defaultValue="yyyy-mm-dd HH:MM:SS" onChange={onChangeInput} />
          </Col> */}

          <Col span={24}>
            <ColumnLabel required={true} label=" Target Variable" />
            <Select
              style={{
                width: 120,
                backgroundColor: '#fff !important',
                border: '1px solid #A3AFCF',
                borderRadius: '10px',
              }}
              value={inputOption.target_y}
              placeholder="Timestamp Column"
              options={options}
              // defaultValue={options[0]}
              onSelect={handleSelectY}
            />
          </Col>
          <Col span={24}>
            <ColumnLabel required={false} label=" Description(Optional)" />
            <TextArea
              style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
              value={inputOption.desc}
              onChange={(e) => setInputOption({ ...inputOption, desc: e.target.value })}
              placeholder="Description"
              maxLength={50}
              allowClear
              autoSize={{ minRows: 3, maxRows: 2 }}
            />
          </Col>
        </Row>
      </DataPropertiesContainer>
    </Spin>
  )
}

export default DataProperties

const DataPropertiesContainer = styled.div`
  // border: 1px solid red;
  display: block;
  float: left;
  margin-top: 20px;
  width: 100%;
`
