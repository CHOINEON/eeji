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
dayjs.extend(isBetween)

const CorrelationView = ({ data, options }: any) => {
  // const isBetween = require('dayjs/plugin/isBetween')
  const selectedData = useRecoilValue(selectedDataState)

  const [featureX, setFeatureX] = useState({ value: '', min: 0, max: 0, sliderMin: 0, sliderMax: 0 })
  const [featureY, setFeatureY] = useState<any>({ value: '', min: 0, max: 0, sliderMin: 0, sliderMax: 0 })
  const [sliderMarks, setSliderMarks] = useState({ x: {}, y: {} })
  const [chartData, setChartData] = useState<any>({})
  const [dataRange, setDataRange] = useState({ start: '', end: '' })
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
    console.log('param:', param)
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

  const handleRangeChange = (value: any, type: string) => {
    const stringDate = dayjs(value).format(dateFormat)
    // console.log('formatted:', formattedOBj)

    if (type === 'startDate') {
      //null일때는 초기값(디폴트) 세팅, 그 외 값일때  datetime
      setDefaultDatetime({
        ...defaultDatetime,
        startDate: value ? stringDate : dataRange.start,
      })

      const isBetween = function (obj: any) {
        const dateToCheck = dayjs(obj['date_col']) // 각 row의 날짜 컬럼 값
        const startDate = value //선택된 datetime(dayjs type)
        const endDate = dayjs(defaultDatetime.endDate)

        return dateToCheck.isBetween(startDate, endDate)
      }

      setChartData(data.filter((d: any) => isBetween(d)))
    }
    if (type === 'endDate') {
      setDefaultDatetime({ ...defaultDatetime, endDate: value ? value : dataRange.end })

      const isBetween = function (obj: any) {
        const dateToCheck = dayjs(obj['date_col']) // 각 row의 날짜 컬럼 값
        const startDate = dayjs(defaultDatetime.startDate)
        const endDate = value

        return dateToCheck.isBetween(startDate, endDate)
      }

      setChartData(data.filter((d: any) => isBetween(d)))
    }
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
                      value={dayjs(defaultDatetime.startDate, dateFormat)}
                      format={dateFormat}
                      onChange={(e) => handleRangeChange(e, 'startDate')}
                    />
                  </Row>
                  <p style={{ textAlign: 'center' }}>~</p>
                  <Row>
                    <DatePicker
                      showTime
                      style={{ width: '100%' }}
                      value={dayjs(defaultDatetime.endDate, dateFormat)}
                      format={dateFormat}
                      onChange={(e) => handleRangeChange(e, 'endDate')}
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
