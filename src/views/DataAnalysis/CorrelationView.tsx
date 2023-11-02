import React, { useState, useEffect, useRef } from 'react'
import ItemBox from './components/DataEntry/ItemBox'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { selectedVarStoreX, selectedVarStoreY, usedVariableStore, variableStore } from './store/variable/atom'
import ScatterPlot from './components/Chart/D3_Scatter/ScatterPlot'
import { Col, InputNumber, Row, Select, Slider } from 'antd'

const CorrelationView = ({ data, options }: any) => {
  const [featureX, setFeatureX] = useState({ value: '', min: 0, max: 0, sliderMin: 0, sliderMax: 0 })
  const [featureY, setFeatureY] = useState<any>({ value: '', min: 0, max: 0, sliderMin: 0, sliderMax: 0 })
  const [sliderMarks, setSliderMarks] = useState({ x: {}, y: {} })
  const [chartData, setChartData] = useState<any>({})

  //테스트용으로 일단 전체 다 렌더링 (나중에 바꾸기)
  const [variableList, setVariableList] = useRecoilState(variableStore)

  useEffect(() => {
    // console.log('CorrelationView data::', data)
    // console.log('CorrelationView options::', options)

    setChartData(data)
  }, [data])

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
    // TODO : data 를 slider 의 min/max로 필터링해서 chartData에 담기 -> ScatterPlot에 보냄

    if (type === 'x') {
      setFeatureX({ ...featureX, sliderMin: param[0], sliderMax: param[1] })
      setChartData(chartData.filter((d: any) => d[featureX.value] > param[0] && d[featureX.value] < param[1]))
    }
    if (type === 'y') {
      setFeatureY({ ...featureY, sliderMin: param[0], sliderMax: param[1] })
      setChartData(chartData.filter((d: any) => d[featureY.value] > param[0] && d[featureY.value] < param[1]))
    }
  }

  return (
    <>
      <div style={{ width: '100%', height: '400px', display: 'block' }}>
        <div style={{ width: '70%', display: 'block', float: 'left' }}>
          {data.length > 0 && <ScatterPlot data={chartData} featureX={featureX} featureY={featureY} />}
        </div>
        <div
          style={{
            height: '100%',
            width: '30%',
            padding: '4rem 1rem',
            display: 'block',
            float: 'left',
            // border: '1px solid red',
          }}
        >
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
        </div>
      </div>
    </>
  )
}

export default CorrelationView
