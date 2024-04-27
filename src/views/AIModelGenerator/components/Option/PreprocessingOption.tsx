import styled from '@emotion/styled'
import { DatePicker, DatePickerProps, InputNumber, Row, Select, Space } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
// import { optionListState } from 'views/AIModelGenerator/store/base/atom'
import { inputOptionListState, userInputOptionState } from 'views/AIModelGenerator/store/userOption/atom'

const LabelBox = styled.div`
  //   text-align: center;
  // font-size: 15px;
  // color: #002d65;
  // font-weight: bold;
`

const PreprocessingOption = () => {
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const selectedData = useRecoilValue(selectedDataState)
  const [disabled, setDisabled] = useState(false)
  const [missingValueInputDisabled, setMissingValueInputDisabled] = useState(true)
  const [outlierValueInputDisabled, setOutlierValueInputDisabled] = useState(true)

  const [numberRange, setNumberRange] = useState([0.1, 3.5])
  const [missingValue, setMissingValue] = useState({ name: '', number: 0 })
  const [outlierValue, setOutlierValue] = useState({ name: '', number: 0 })

  // useEffect(() => {
  //   console.log(' 전처리 옵션 userInputOption:', userInputOption)
  // }, [userInputOption])

  //결측치
  const onMissingValueChange = (param: any) => {
    if (param === 'userset') {
      // setMissingValue({ name: param, number: numberRange[0] })
      setUserInputOption({ ...userInputOption, number_missing: numberRange[0] })

      setMissingValueInputDisabled(false)
    } else {
      // setMissingValue({ name: param, number: null })
      setUserInputOption({ ...userInputOption, number_missing: null })

      setMissingValueInputDisabled(true)
    }

    setUserInputOption({ ...userInputOption, type_missing: param })
  }

  const onOutlierValueChange = (param: any) => {
    // console.log('param:', param)

    if (param === 'std') {
      setNumberRange([0.1, 3.5])
      setOutlierValue({ name: param, number: 0.1 })

      setOutlierValueInputDisabled(false)
    } else if (param === 'perc') {
      setNumberRange([1, 49])
      setOutlierValue({ name: param, number: 1 })

      setOutlierValueInputDisabled(false)
    } else {
      setNumberRange([0, 1])
      setOutlierValue({ name: param, number: null })

      setOutlierValueInputDisabled(true)
    }
    setUserInputOption({ ...userInputOption, type_outlier: param })
  }

  const onNormalizationChange = (param: any) => {
    setUserInputOption({ ...userInputOption, type_scaling: param })
  }

  const missingInputChange = (param: any) => {
    // setMissingValue({ ...missingValue, number: param })
    setUserInputOption({ ...userInputOption, number_missing: param })
  }
  const outlierInputChange = (param: any) => {
    // setOutlierValue(param)

    // console.log('userInputOption::', userInputOption)
    setUserInputOption({ ...userInputOption, number_std: param })

    // console.log('outlierInputChange:', param)
  }

  const onStartDateChange = (value: DatePickerProps['value'] | RangePickerProps['value'], dateString: string) => {
    // console.log('dateString:', dateString)
    setUserInputOption({ ...userInputOption, start_date: dateString })
  }

  const onEndDateChange = (value: DatePickerProps['value'] | RangePickerProps['value'], dateString: string) => {
    setUserInputOption({ ...userInputOption, end_date: dateString })
  }

  // const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  //   console.log('onOk: ', value)
  // }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day')
  }

  const range = (start: number, end: number) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  })
  return (
    // <Collapse
    //   ghost
    //   size="small"
    //   collapsible="header"
    //   //   defaultActiveKey={['1']}
    //   items={[
    //     {
    //       key: '2',
    //       label: 'Preprocessing',
    //       children: (
    <Row gutter={[0, 16]}>
      <Row>
        <LabelBox>시작일</LabelBox>{' '}
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
          showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          onChange={onStartDateChange}
        />
      </Row>
      <Row>
        <LabelBox>종료일</LabelBox>
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
          showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          onChange={onEndDateChange}
        />
      </Row>
      <Row>
        <LabelBox>결측치 처리</LabelBox>
        <Space.Compact style={{ width: '100%' }}>
          <Select
            defaultValue="null"
            style={{ width: '70%' }}
            onChange={onMissingValueChange}
            options={[
              { value: 'null', label: '선택 안 함' },
              { value: 'userset', label: '치환' },
              { value: 'drop', label: '제거' },
              { value: 'bfill', label: 'bfill' },
              { value: 'ffill', label: 'fill' },
              { value: 'mean', label: '평균' },
              { value: 'mode', label: '최빈값' },
              { value: 'min', label: 'min' },
              { value: 'max', label: 'max' },
              { value: 'linear', label: '선형보간' },
              { value: 'cubics', label: '큐빅스플라인' },
              { value: 'seconds', label: '스플라인2차' },
              { value: 'zfill', label: '0으로 채우기' },
              { value: 'multir', label: '다중대체' },
              { value: 'knn', label: 'KNN' },
            ]}
          />
          <InputNumber
            min={0}
            // max={10}
            style={{ width: '30%' }}
            defaultValue={0}
            onChange={missingInputChange}
            disabled={missingValueInputDisabled}
            value={userInputOption.number_missing}
          />
        </Space.Compact>
      </Row>
      <Row>
        <LabelBox>이상치 처리</LabelBox>
        <Space.Compact style={{ width: '100%' }}>
          <Select
            defaultValue="null"
            style={{ width: '70%' }}
            onChange={onOutlierValueChange}
            options={[
              { value: 'null', label: '선택 안 함' },
              { value: 'std', label: '표준편차' },
              { value: 'perc', label: '백분위' },
              { value: 'iforest', label: 'IForest' },
              { value: 'ransac', label: 'Ransac' },
            ]}
          />
          {/* <Input defaultValue="0" disabled={outlierValueInputDisabled} /> */}
          <InputNumber
            style={{ width: '30%' }}
            min={numberRange[0]}
            max={numberRange[1]}
            defaultValue={numberRange[0]}
            onChange={outlierInputChange}
            value={userInputOption.type_missing === 'std' ? userInputOption.number_std : userInputOption.number_perc}
            disabled={outlierValueInputDisabled}
          />
        </Space.Compact>
      </Row>
      <Row>
        <LabelBox>데이터 정규화</LabelBox>

        <Select
          style={{ width: '100%' }}
          defaultValue="null"
          disabled={disabled}
          onChange={onNormalizationChange}
          options={[
            { value: 'null', label: '선택 안 함' },
            { value: 'minmax', label: '최대-최소' },
            { value: 'meanstd', label: '평균-분산' },
            { value: 'robust', label: '로버스트' },
          ]}
        />
      </Row>
    </Row>
    //       ),
    //     },
    //   ]}
    // />
  )
}

export default PreprocessingOption
