import styled from '@emotion/styled'
import { App, Input, Radio, RadioChangeEvent, Row, Select, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import DatasetApi from 'apis/DatasetApi'
import ColumnLabel from 'components/fields/ColumnLabel'
import { useApiError } from 'hooks/useApiError'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { dateTimeToString, isValidDatetimeFormat } from 'utils/DateFunction'
import { dataPropertyState, signedUrlState, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

interface Option {
  value: string
  label: string
  disabled: boolean
}

const DataProperties = () => {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const [signedUrl, setSignedUrl] = useRecoilState(signedUrlState)
  const [targetOptions, setTargetOptions] = useState(Array<Option>)
  const [dateColOptions, setDateColOptions] = useState(Array<Option>)

  const { handleError } = useApiError()

  const { mutate: mutateSignedUrl } = useMutation(DatasetApi.signedUrl, {
    onSuccess: (response: any) => {
      setUploading(false)
      setSignedUrl(response)
    },
    onError: (error: any) => {
      handleError(error)
    },
  })

  useEffect(() => {
    clearInputs()
    getSignedUrl()
    setInputOption({
      ...inputOption,
      name: uploadedData.file?.name.split('.', 2)[0],
      target_y: '',
    })
  }, [])

  useEffect(() => {
    generateOptions(uploadedData)
  }, [uploadedData, inputOption.algo_type])

  const getSignedUrl = () => {
    setUploading(true)

    const formData = new FormData()
    formData.append('com_id', localStorage.getItem('companyId'))
    const user_id = localStorage.getItem('userId').toString()

    mutateSignedUrl({ user_id, formData })
  }

  function generateOptions(data: any) {
    const col_list = data['columns']
    const non_numeric_cols = data['nonNumericCols']
    const numeric_cols = data['numericCols']

    const targetArr: Array<any> = []
    const timestampArr: Array<any> = []

    if (inputOption.algo_type === 0) {
      //regression 과 classification 타입에 따라 선택 가능한 컬럼 바인딩
      col_list.map((value: string) => {
        if (numeric_cols.includes(value)) {
          targetArr.push({ value: value, label: value })
        } else if (non_numeric_cols.includes(value)) {
          targetArr.push({ value: value, label: `${value} (non-numeric column)`, disabled: true })
        }
      })
      setTargetOptions(targetArr)
    } else if (inputOption.algo_type === 1) {
      //classification(numeric 무관함)
      col_list.map((value: string) => targetArr.push({ value: value, label: value }))
      setTargetOptions(targetArr)
    }

    //Generate datetime column options
    col_list.map((value: string) => timestampArr.push({ value: value, label: value }))
    setDateColOptions(timestampArr)
  }

  const validateDatetime = (columnLabel: string, data: Array<any>) => {
    let result: boolean
    const sample = data.slice(0, 10)
    for (let i = 0; i < 10; i++) {
      result = isValidDatetimeFormat(sample[i][columnLabel])
    }

    return result
  }

  const clearInputs = () => {
    setTargetOptions([{ value: '', label: '', disabled: false }])
    setInputOption({ algo_type: 0, date_format: '', name: '', date_col: '', target_y: '', desc: '' })
  }

  const handleSelectDateCol = (param: any) => {
    //날짜 컬럼 유효한지 검증
    const isValid = validateDatetime(param, uploadedData.content)

    if (isValid) setInputOption({ ...inputOption, date_col: param })
    else message.error('처리할 수 없는 날짜 형식입니다.')

    //시작 종료일 찾기
    searchStartEndDate(param, uploadedData.content)
  }

  const searchStartEndDate = (colName: string, array: Array<any>) => {
    //min & max datetime 찾기
    const newArr = array.map((obj) => {
      return { ...obj, dateTime: new Date(obj[colName]) }
    })
    console.log('test:"', newArr[0].dateTime.getTime())

    if (!newArr[0].dateTime.getTime()) {
      alert('날짜 컬럼이 아닙니다.')
    }

    console.log('newArr[0].dateTime:', newArr[0].dateTime)
    // console.log('test:', isValidDate(newArr[0].dateTime))

    //Sort in Ascending order(low to high)
    //https://bobbyhadz.com/blog/javascript-sort-array-of-objects-by-date-property
    const sortedAsc = newArr.sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
    // console.log('sortedAsc:', sortedAsc)

    // console.log('-----test:', Object.prototype.toString.call(sortedAsc[0].dateTime))

    const summary = []
    const lengthOfArray = array.length

    const start = sortedAsc[0].dateTime
    const end = sortedAsc[lengthOfArray - 1].dateTime
    // console.log('start:', dateTimeToString(start).length)
    // console.log('end:', typeof end)

    setUploadedData({
      ...uploadedData,
      startDate: dateTimeToString(start).length === 19 ? dateTimeToString(start) : '-',
      endDate: dateTimeToString(end).length === 19 ? dateTimeToString(end) : '-',
    })
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
            <Radio value={0}>Regression</Radio>
            <Radio value={1}>Classification</Radio>
          </Radio.Group>
        </Row>
        <Row>
          <ColumnLabel required={true} label=" Target Variable" />
          <Select
            style={{
              width: '100%',
            }}
            value={inputOption.target_y}
            placeholder="Target Variable"
            options={targetOptions}
            onSelect={handleSelectY}
          />
        </Row>
        <Row style={{ display: inputOption.algo_type === 0 ? 'block' : 'none' }}>
          <ColumnLabel required={true} label="Timestamp" />
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
            autoSize={{ minRows: 2, maxRows: 2 }}
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
