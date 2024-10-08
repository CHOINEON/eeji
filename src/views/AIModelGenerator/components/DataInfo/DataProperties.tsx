import styled from '@emotion/styled'
import { App, Input, Radio, RadioChangeEvent, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import ColumnLabel from 'components/fields/ColumnLabel'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import { dateTimeToString } from 'utils/DateFunction'
import { dataPropertyState, UploadData, uploadedDataState } from 'views/AIModelGenerator/store/dataset/atom'

interface Option {
  value: string
  label: string
  disabled?: boolean
}

const DataProperties = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const [inputOption, setInputOption] = useRecoilState(dataPropertyState)
  const [uploadedData, setUploadedData] = useRecoilState(uploadedDataState)
  const [targetOptions, setTargetOptions] = useState(Array<Option>)
  const [dateColOptions, setDateColOptions] = useState(Array<Option>)

  useEffect(() => {
    clearInputs()
    setInputOption({
      ...inputOption,
      name: uploadedData.file?.name.split('.', 2)[0],
      target_y: '',
    })
  }, [])

  useEffect(() => {
    generateOptions(uploadedData)
  }, [uploadedData, inputOption.algo_type])

  function generateOptions(data: UploadData) {
    const col_list = data['columns'].filter(Boolean) //유효하지 않은 값(빈 값)제거 필터링

    const optionArr: Array<Option> = []

    //24.10.07 regression 과 classification 타입에 무관하게 타겟변수를 선택할 수 있는 제한을 해제함(엔진에서 처리)
    col_list.map((value: string) => optionArr.push({ value: value, label: value }))

    setTargetOptions(optionArr)
    setDateColOptions(optionArr)
  }

  const clearInputs = () => {
    setTargetOptions([{ value: '', label: '', disabled: false }])
    setInputOption({ algo_type: 0, date_format: '', name: '', date_col: '', target_y: '', desc: '' })
  }

  const handleSelectDateCol = (param: any) => {
    setInputOption({ ...inputOption, date_col: param })
    searchStartEndDate(param, uploadedData.content)

    // 24.09.25 날짜컬럼 유효성 검증 부분 삭제
    // //날짜 컬럼 유효한지 검증
    // const isValid = validateDatetime(param, uploadedData.content)

    // if (isValid) {
    //   setInputOption({ ...inputOption, date_col: param })

    //   //시작 종료일 찾기
    //   searchStartEndDate(param, uploadedData.content)
    // } else {
    //   message.error('처리할 수 없는 날짜 형식입니다. 데이터 업로드 가이드를 참고하세요')
    //   return false
    // }
  }

  const searchStartEndDate = (colName: string, array: Array<any>) => {
    //min & max datetime 찾기
    const newArr = array.map((obj) => {
      return { ...obj, dateTime: new Date(obj[colName]) }
    })

    if (!newArr[0].dateTime.getTime()) {
      message.error(t('Unable to confirm the start/end date for the relevant column.'))
      setUploadedData({
        ...uploadedData,
        startDate: 'N/A',
        endDate: 'N/A',
      })
    } else {
      //Sort in Ascending order(low to high)
      const sortedAsc = newArr.sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
      const lengthOfArray = array.length

      const start = sortedAsc[0].dateTime
      const end = sortedAsc[lengthOfArray - 1].dateTime

      setUploadedData({
        ...uploadedData,
        startDate: dateTimeToString(start).length === 19 ? dateTimeToString(start) : '-',
        endDate: dateTimeToString(end).length === 19 ? dateTimeToString(end) : '-',
      })
    }
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
    <DataPropertiesContainer>
      <Row>
        <ColumnLabel required={true} label={t('Dataset Name')} />
        <Input
          style={{ backgroundColor: '#fff', border: '1px solid #A3AFCF', borderRadius: '10px' }}
          placeholder={t('Dataset Name')}
          maxLength={100}
          onChange={handleChange}
          value={inputOption.name}
          allowClear
        />
      </Row>
      <Row>
        <ColumnLabel required={true} label={t('Model Type')} />
        <Radio.Group onChange={onChangeRadio} value={inputOption.algo_type}>
          <Radio value={0}>{t('Regression')}</Radio>
          <Radio value={1}>{t('Classification')}</Radio>
        </Radio.Group>
      </Row>
      <Row>
        <ColumnLabel required={true} label={t('Target Variable')} />
        <Select
          style={{
            width: '100%',
          }}
          value={inputOption.target_y}
          placeholder={t('Target Variable')}
          options={targetOptions}
          onSelect={handleSelectY}
        />
      </Row>
      <Row style={{ display: inputOption.algo_type === 0 ? 'block' : 'none' }}>
        <ColumnLabel required={true} label={t('Timestamp')} />
        <Select
          style={{
            width: '100%',
          }}
          value={inputOption.date_col}
          placeholder={t('Timestamp')}
          options={dateColOptions}
          onSelect={handleSelectDateCol}
        />
      </Row>
      <Row>
        <ColumnLabel required={false} label={`${t('Description')} (${t('Optional')})`} />
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
