import styled from '@emotion/styled'
import { Input, Radio, RadioChangeEvent, Row, Select, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import DatasetApi from 'apis/DatasetApi'
import ColumnLabel from 'components/fields/ColumnLabel'
import { useApiError } from 'hooks/useApiError'
import { useToast } from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { dataPropertyState, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

interface Option {
  value: string
  label: string
  disabled: boolean
}

const DataProperties = () => {
  const { fireToast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)

  const [options, setOptions] = useState(Array<Option>)
  const [dateColOptions, setDateColOptions] = useState(Array<Option>)

  const { handleError } = useApiError()
  const { mutate } = useMutation(DatasetApi.uploadDataset, {
    onSuccess: (response: any) => {
      const summaryData = response['1']

      fireToast('request success')

      setUploadedData({
        ...uploadedData,
        rowCount: summaryData.row_count,
        colCount: summaryData.column_count,
        startDate: summaryData.start_date !== 'null' ? summaryData.start_date : '-',
        endDate: summaryData.end_date !== 'null' ? summaryData.end_date : '-',
      })

      //Select Box 옵션 데이터 바인딩
      generateOptions(summaryData)

      setUploading(false)
    },
    onError: (error: any) => {
      handleError(error)
    },
  })

  useEffect(() => {
    clearInputs()
    setInputOption({
      ...inputOption,
      name: uploadedData.file?.name.split('.', 2)[0],
      target_y: '',
    })
  }, [])

  useEffect(() => {
    if (inputOption.algo_type !== undefined) fetchFileDescription()
  }, [inputOption.algo_type])

  const fetchFileDescription = () => {
    setUploading(true)

    const formData = new FormData()
    formData.append('files', uploadedData.file)

    const user_id = localStorage.getItem('userId').toString()
    const is_classification = inputOption.algo_type

    mutate({ user_id, is_classification, formData })
  }

  function generateOptions(data: any) {
    // console.log('data:', data)

    const col_list = data['col_list']
    const non_numeric_cols = data['non_numeric_cols']
    const numeric_cols = data['numeric_cols']

    const newOption: Array<any> = []

    if (inputOption.algo_type === 0) {
      //regression 과 classification 타입에 따라 선택 가능한 컬럼 바인딩
      col_list.map((value: string) => {
        if (numeric_cols.includes(value)) {
          newOption.push({ value: value, label: value })
        } else if (non_numeric_cols.includes(value)) {
          newOption.push({ value: value, label: `${value} (non-numeric column)`, disabled: true })
        }
      })
    } else if (inputOption.algo_type === 1) {
      //classification(numeric 무관함)
      col_list.map((value: string) => newOption.push({ value: value, label: value }))
    }
    setOptions(newOption)

    //Generate datetime column options
    const timestampArr: Array<any> = []

    col_list.map((value: string) => timestampArr.push({ value: value, label: value }))
    setDateColOptions(timestampArr)
  }

  const clearInputs = () => {
    setOptions([{ value: '', label: '', disabled: false }])
    setInputOption({ algo_type: 1, date_format: '', name: '', date_col: '', target_y: '', desc: '' })
  }

  const handleSelectDateCol = (param: any) => {
    setInputOption({ ...inputOption, date_col: param })
  }

  const handleSelectY = (param: any) => {
    setInputOption({ ...inputOption, target_y: param })
  }

  const handleChange = (e: any) => {
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
        <Row>
          <ColumnLabel required={true} label="Dataset Name" />
          <Input
            style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
            placeholder="Dataset Name"
            maxLength={20}
            onChange={handleChange}
            value={inputOption.name}
            allowClear
          />
        </Row>
        <Row>
          <ColumnLabel required={true} label="Algorithm Type" />
          <Radio.Group onChange={onChangeRadio} value={inputOption.algo_type}>
            <Radio value={1}>Classification</Radio>
            <Radio value={0}>Regression</Radio>
          </Radio.Group>
        </Row>
        <Row>
          <ColumnLabel required={true} label=" Target Variable" />
          <Select
            style={{
              width: '100%',
            }}
            value={inputOption.target_y}
            placeholder="Timestamp Column"
            options={options}
            onSelect={handleSelectY}
          />
        </Row>
        <Row>
          <ColumnLabel required={false} label="Timestamp" />
          <Select
            style={{
              width: '100%',
            }}
            value={inputOption.date_col}
            placeholder="Timestamp Column"
            options={dateColOptions}
            onSelect={handleSelectDateCol}
          />
        </Row>
        <Row>
          <ColumnLabel required={false} label=" Description(Optional)" />
          <TextArea
            value={inputOption.desc}
            onChange={(e) => setInputOption({ ...inputOption, desc: e.target.value })}
            placeholder="Description"
            maxLength={50}
            allowClear
            autoSize={{ minRows: 3, maxRows: 2 }}
          />
        </Row>
      </DataPropertiesContainer>
    </Spin>
  )
}

export default DataProperties

const DataPropertiesContainer = styled.div`
  display: block;
  float: left;
  width: 100%;
  height: 276px;
  padding: 1em;
  overflow-y: scroll;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`
