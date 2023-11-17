import React, { useState, useEffect, useRef } from 'react'
import ItemBox from './components/DataEntry/ItemBox'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedVarStoreX, selectedVarStoreY, usedVariableStore, variableStore } from './store/variable/atom'
import ScatterPlot from './components/Chart/D3_Scatter/ScatterPlot'
import { Col, DatePicker, InputNumber, Row, Select, Slider } from 'antd'
import dayjs from 'dayjs'
import { selectedDataState } from './store/dataset/atom'
import { Spin } from 'antd'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { DatePickerProps } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import { MdDateRange } from 'react-icons/md'
import isBetween from 'dayjs/plugin/isBetween'
import Title from 'antd/es/typography/Title'
import InfoCircle from './components/Icon/InfoCircle'
dayjs.extend(isBetween)

const CorrelationView = ({ data, options }: any) => {
  // const isBetween = require('dayjs/plugin/isBetween')
  const selectedData = useRecoilValue(selectedDataState)

  const [featureX, setFeatureX] = useState({
    value: '',
    min: 0,
    max: 0,
    sliderMin: 0,
    sliderMax: 0,
  })
  const [featureY, setFeatureY] = useState<any>({ value: '', min: 0, max: 0, sliderMin: 0, sliderMax: 0 })
  const [sliderMarks, setSliderMarks] = useState({ x: {}, y: {} })
  const [chartData, setChartData] = useState<any>({})
  const [dataRange, setDataRange] = useState({ start: '', end: '' })
  const [datetime, setDatetime] = useState({ startDate: '', endDate: '' })
  const [defaultDatetime, setDefaultDatetime] = useState({ startDate: '', endDate: '' })
  const [loading, setLoading] = useState(true)

  //테스트용으로 일단 전체 다 렌더링 (나중에 바꾸기)
  const [variableList, setVariableList] = useRecoilState(variableStore)

  useEffect(() => {
    // console.log('CorrelationView data::', data)
    // console.log('CorrelationView options::', options)

    if (data?.length > 0) {
      setLoading(false)
      renderDefaultDate(data)
      setChartData(data)
    }
  }, [data])

  const dateFormat = 'YYYY-MM-DD hh:mm:ss'

  function date_ascending(a: any, b: any) {
    const dateA = new Date(a['date_col']).getTime()
    const dateB = new Date(b['date_col']).getTime()
    return dateA > dateB ? 1 : -1
  }

  const renderDefaultDate = (data: Array<any>) => {
    // console.log('render default:', data)
    //TODO: 날짜순으로 정렬해서 처음/마지막 날짜 state에 저장

    const filteredArr = data.sort(date_ascending)
    const dateArr = filteredArr.map((value: any) => value.date_col)

    // console.log('dateArr:', dateArr)
    setDatetime({ startDate: dateArr[0], endDate: dateArr[dateArr.length - 1] })
    setDefaultDatetime({ startDate: dateArr[0], endDate: dateArr[dateArr.length - 1] })
    setDataRange({ start: dateArr[0], end: dateArr[dateArr.length - 1] })
  }

  const handleSelect = (param: any, type: any) => {
    if (data?.length > 0) {
      // min, max 구하기
      const columns = Object.keys(data[0])
      const result: { [key: string]: Array<string> } = {}

      //format
      columns.map((column: any) => {
        result[column] = []
      })

      //push items
      data?.map((data: any) => {
        columns.forEach((column: any) => {
          result[column].push(data[column])
        })
      })

      const arr = result[param]
      const min = Math.min.apply(null, arr)
      const max = Math.max.apply(null, arr)

      if (type === 'x') {
        setFeatureX({ value: param, min: min, max: max, sliderMin: min, sliderMax: max })
        setSliderMarks({ ...sliderMarks, x: { [min]: min, [max]: max } })
      }
      if (type === 'y') {
        setFeatureY({ value: param, min: min, max: max, sliderMin: min, sliderMax: max })
        setSliderMarks({ ...sliderMarks, y: { [min]: min, [max]: max } })
      }
    }
  }

  const handleChange = (param: any, type: string) => {
    // console.log('param:', param)

    // TODO : data 를 slider 의 min/max로 필터링해서 chartData에 담기 -> ScatterPlot에 보냄
    if (type === 'x') {
      setFeatureX({ ...featureX, sliderMin: param[0], sliderMax: param[1] })
      setChartData(
        data.filter(
          (d: any) =>
            d[featureX.value] > param[0] &&
            d[featureX.value] < param[1] &&
            d[featureY.value] > featureY.sliderMin &&
            d[featureY.value] < featureY.sliderMax
        )
      )
    }
    if (type === 'y') {
      setFeatureY({ ...featureY, sliderMin: param[0], sliderMax: param[1] })
      setChartData(
        data.filter(
          (d: any) =>
            d[featureY.value] > param[0] &&
            d[featureY.value] < param[1] &&
            d[featureX.value] > featureX.sliderMin &&
            d[featureX.value] < featureX.sliderMax
        )
      )
    }
  }

  const filterChartData = () => {
    console.log('datetime:', datetime)
    const isBetween = function (obj: any) {
      const dateToCheck = dayjs(obj['date_col']) // 각 row의 날짜 컬럼 값
      const startDate = dayjs(datetime.startDate)
      const endDate = dayjs(datetime.endDate)

      // console.log('startDate: ' + startDate)
      // console.log('endDate: ' + endDate)
      console.log('bool:', dateToCheck.isBetween(startDate, endDate))
      return dateToCheck.isBetween(startDate, endDate)
    }
    console.log('data:', data)
    /////////////////NEED REFACTORING !!! ///////////////////
    const filteredData = data.filter((d: any) => isBetween(d))
    console.log('filteredData:', filteredData)
    // const temp = filteredData.filter((el: any) => el[featureX.value])
    //   //Array.sort는 정렬할 때 요소를 문자열로 취급하기 때문에 함수를 써야함
    const orderByFeatureX = filteredData
      .filter((el: any) => el[featureX.value])
      .sort((a: any, b: any) => {
        return a[featureX.value] - b[featureX.value]
      })

    // const orderByFeatureX = filteredData.sort((a: any, b: any) => {
    //   return a[featureX.value] - b[featureX.value]
    // })

    console.log('orderByFeatureX:', orderByFeatureX)

    const orderByFeatureY = filteredData
      .filter((el: any) => el[featureY.value])
      .sort((a: any, b: any) => {
        return a[featureY.value] - b[featureY.value]
      })

    console.log('orderByFeatureY:', orderByFeatureY)

    setChartData(filteredData)
    // console.log('filteredData:', filteredData)

    //sliderMin 값으로 scale을 정하고 있어서(ScatterPlot.tsx) 날짜 필터링한 데이터의 컬럼 최소/최대값을 sliderMin과 동기화함(11/14)
    const xMinValue = orderByFeatureX[0][featureX.value]
    const xMaxValue = orderByFeatureX[filteredData.length - 1][featureX.value]

    const yMinValue = orderByFeatureY[0][featureY.value]
    const yMaxValue = orderByFeatureY[filteredData.length - 1][featureY.value]
    console.log(`xMinValue: ${xMinValue} xMaxValue: ${xMaxValue}`)

    setFeatureX({
      ...featureX,
      sliderMin: xMinValue,
      sliderMax: xMaxValue,
    })

    setFeatureY({
      ...featureY,
      sliderMin: yMinValue,
      sliderMax: yMaxValue,
    })
  }

  const handleDateChange = (value: any, type: string) => {
    // console.log('handleRangeChange:', value, type)

    const stringDate = dayjs(value).format(dateFormat)
    console.log('stringDate:', stringDate)

    if (type === 'startDate') {
      //null일때는 초기값(디폴트) 세팅, 그 외 값일때  datetime
      setDatetime({
        ...datetime,
        startDate: value ? stringDate : dataRange.start,
      })
    }
    if (type === 'endDate') {
      setDatetime({ ...datetime, endDate: value ? stringDate : dataRange.end })

      // const isBetween = function (obj: any) {
      //   const dateToCheck = dayjs(obj['date_col']) // 각 row의 날짜 컬럼 값
      //   const startDate = dayjs(defaultDatetime.startDate)
      //   const endDate = value

      //   return dateToCheck.isBetween(startDate, endDate)
      // }

      // const result = data
      //   .filter((d: any) => isBetween(d))
      //   .sort((a: any, b: any) => {
      //     return a[featureY.value] - b[featureY.value]
      //   })

      // setChartData(result)

      // //sliderMin 값으로 scale을 정하고 있어서(ScatterPlot.tsx) 날짜 필터링한 데이터의 컬럼 최소/최대값을 sliderMin과 동기화함(11/14)
      // const newMinValue = result.length > 0 ? result[0][featureY.value] : featureY.min
      // const newMaxValue = result.length > 0 ? result[result.length - 1][featureY.value] : featureY.max

      // setFeatureY({
      //   ...featureY,
      //   sliderMin: newMinValue ? newMinValue : featureY.min,
      //   sliderMax: newMaxValue ? newMaxValue : featureY.max,
      // })
    }
    filterChartData()
  }

  // useEffect(() => {
  //   console.log('chartData:', chartData)
  // }, [chartData])
  // const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  //   console.log(date, dateString)
  // }

  return (
    <>
      <Spin
        tip="loading"
        spinning={loading}
        style={{
          margin: '50px 0',
          marginBottom: '20px',
          textAlign: 'center',
          borderRadius: '4px',
        }}
      >
        <div style={{ width: '100%', height: '400px', display: 'block' }}>
          <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
            Correlation Plot
            <InfoCircle content="X, Y를 직접 선택하여 상관관계를 파악할 수 있습니다" />
          </Title>
          <div style={{ width: '60%', display: 'block', float: 'left' }}>
            <ScatterPlot data={chartData} featureX={featureX} featureY={featureY} />
          </div>
          <div
            style={{
              height: '100%',
              width: '30%',
              padding: '2rem 1rem',
              display: 'block',
              float: 'left',
              // border: '1px solid red',
            }}
          >
            <ItemBox
              title="Date Range"
              component={
                <>
                  <Row>
                    <DatePicker
                      showTime
                      style={{ width: '100%' }}
                      value={dayjs(datetime.startDate, dateFormat)}
                      defaultValue={dayjs(defaultDatetime.startDate, dateFormat)}
                      format={dateFormat}
                      onChange={(e) => handleDateChange(e, 'startDate')}
                      disabledDate={(current) => current && current < dayjs(defaultDatetime.startDate)}
                    />
                  </Row>
                  <p style={{ textAlign: 'center' }}>~</p>
                  <Row>
                    <DatePicker
                      showTime
                      style={{ width: '100%' }}
                      value={dayjs(datetime.endDate, dateFormat)}
                      defaultValue={dayjs(defaultDatetime.endDate, dateFormat)}
                      format={dateFormat}
                      onChange={(e) => handleDateChange(e, 'endDate')}
                      disabledDate={(current) => current && current > dayjs(defaultDatetime.endDate)}
                    />
                  </Row>
                </>
              }
            ></ItemBox>

            <ItemBox
              title="Feature X"
              component={
                <Select
                  style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                  onSelect={(e: any) => handleSelect(e, 'x')}
                  options={variableList}
                  defaultValue={options[0]}
                />
              }
            />
            <ItemBox
              title="Feature Y"
              component={
                <Select
                  style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                  onSelect={(e: any) => handleSelect(e, 'y')}
                  options={variableList}
                  defaultValue={options[0]}
                />
              }
            />
            <ItemBox
              title="X Range"
              component={
                <Slider
                  range
                  included={true}
                  marks={sliderMarks.x}
                  min={featureX.min}
                  max={featureX.max}
                  defaultValue={[featureX.min, featureX.max]}
                  value={[featureX.sliderMin, featureX.sliderMax]}
                  onChange={(e) => handleChange(e, 'x')}
                />
              }
            />
            <ItemBox
              title="Y Range"
              component={
                <Slider
                  range
                  included={true}
                  marks={sliderMarks.y}
                  min={featureY.min}
                  max={featureY.max}
                  defaultValue={[featureY.min, featureY.max]}
                  value={[featureY.sliderMin, featureY.sliderMax]}
                  onChange={(e) => handleChange(e, 'y')}
                />
              }
            />
            {/* <ItemBox
              title="Color Variable(작업중)"
              component={
                <Select
                  style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                  onSelect={(e: any) => handleSelect(e, 'x')}
                  options={variableList}
                  defaultValue={options[0]}
                />
              }
            /> */}
            {/* <ItemBox
              title="Size Variable(작업중)"
              component={
                <Select
                  style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                  onSelect={(e: any) => handleSelect(e, 'x')}
                  options={variableList}
                  defaultValue={options[0]}
                />
              }
            /> */}
          </div>
        </div>
      </Spin>
    </>
  )
}

export default CorrelationView
