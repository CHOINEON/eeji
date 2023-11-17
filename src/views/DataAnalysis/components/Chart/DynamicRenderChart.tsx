import { Select } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import LineChart from './LineChart'

const DynamicRenderChart = ({ type, data }: any) => {
  const [chartData, setChartData] = useState([])
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState()

  useEffect(() => {
    // console.log('DynamicRenderChart type--------:', type)
    // console.log('DynamicRenderChart data=-------:', data)

    //for Select
    if (data.length > 1 || Object.keys(data).length > 0) {
      optionFormatter(type)
    }
  }, [data])

  useEffect(() => {
    const defaultOption = options[0]?.value
    setSelectedOption(defaultOption)

    bindChartData(data)
  }, [options])

  const optionFormatter = (type: string) => {
    setOptions([])

    if (type === 'preprocessingResult') {
      const selectList = data.map((x: any) => x.column_name)
      selectList.forEach((element: any) => {
        const obj = { value: '', label: '' }
        obj['value'] = element
        obj['label'] = element
        setOptions((prev) => [...prev, obj])
      })
    }

    if (type === 'modelResult' || type === 'prediction') {
      // console.log('type:', type)
      // console.log('data:', data)

      const columns = Object.keys(data) //[CNN1D, LSTM, MLP]
      const result: { [key: string]: Array<string> } = {}

      columns.map((column: string) => {
        //{CNN1D: {}, LSTM: {}, MLP:{} }
        result[column] = data[column]

        //selectbox option
        const obj = { value: '', label: '' }
        obj['value'] = column
        obj['label'] = column

        setOptions((prev) => [...prev, obj])
      })
    }

    // if (type === 'prediction') {
    //   const columns = ['선형 예측 결과', '학습 결과(train)', '학습 결과(test)']
    //   const result: { [key: string]: Array<string> } = {}

    //   columns.map((column: string, i: number) => {
    //     result[column] = data[i]

    //     //selectbox option
    //     const obj = { value: '', label: '' }
    //     obj['value'] = column
    //     obj['label'] = column

    //     console.log()
    //     setOptions((prev) => [...prev, obj])
    //   })
    // }
  }

  const bindChartData = (data: any) => {
    if (options.length > 0) {
      //set default
      const defaultOption = options[0]?.value
      setSelectedOption(defaultOption)

      //for Chart
      // onChangeSelect(defaultOption)
      if (type === 'preprocessingResult') {
        setChartData(data.find((x: any) => x.column_name === defaultOption))
      } else if (type === 'modelResult' || type === 'prediction') {
        setChartData(data[defaultOption])
      }
    }
  }

  const onChangeSelect = (param: any) => {
    setSelectedOption(param)

    if (type === 'preprocessingResult') {
      setChartData(data.find((x: any) => x.column_name === param))
    } else if (type === 'modelResult' || type === 'prediction') {
      setChartData(data[param])
    }
  }

  return (
    <>
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'block' }}>
          <Select style={{ width: '50%' }} onChange={onChangeSelect} value={selectedOption} options={options} />
        </div>
        <div className="w-100" style={{ height: '450px' }}>
          <LineChart chartData={chartData} />
          {/* {chartData.length > 0 && <LineChart chartData={chartData} />} */}
        </div>
      </div>
    </>
  )
}

export default DynamicRenderChart
