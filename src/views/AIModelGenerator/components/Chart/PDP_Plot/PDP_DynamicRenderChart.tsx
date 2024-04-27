import { Select } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
// import PDP_LineChart from './PDP_LineChart'
import PDP_LineChart from './PDP_LineChart'

const PDP_DynamicRenderChart = ({ type, data }: any) => {
  const [chartData, setChartData] = useState([data])
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState()

  const plotData_1: any[] = [
    {
      x: [0.0, 11.11, 22.22, 33.33, 44.44, 55.56, 66.67, 77.78, 88.89, 100.0],
      y: chartData[0][0],
    },
  ]

  const plotData_2: any[] = [
    {
      x: [0, 2, 4, 6, 8],
      y: chartData[0][1],
    },
  ]

  const plotData_3: any[] = [
    {
      x: [0, 2, 4, 6, 8],
      y: chartData[0][2],
    },
  ]

  const plotData_4: any[] = [
    {
      x: [0, 2, 4, 6, 8],
      y: chartData[0][3],
    },
  ]
  useEffect(() => {
    console.log('DynamicRenderChart type--------:', type)
    console.log('DynamicRenderChart data=-------:', data)

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

  useEffect(() => {
    console.log('chartData:', chartData)
  }, [chartData])

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
        <Title> Partical Dependence Plot CO </Title>
        {/* <div style={{ display: 'block' }}>
          <Select style={{ width: '50%' }} onChange={onChangeSelect} value={selectedOption} options={options} />
        </div> */}
        <div className="w-100" style={{ height: '120px' }}>
          {/* 이부분도 n개의 데이터로 나눠져있냐에 따라 n개의 plot 각각 다른 데이터 넣어줘야함 */}
          <PDP_LineChart data={plotData_1} />
          {/* <PDP_LineChart data={plotData_2} />
          <PDP_LineChart data={plotData_3} />
          <PDP_LineChart data={plotData_4} /> */}
          {/* {chartData.length > 0 && <LineChart chartData={chartData} />} */}
        </div>
      </div>
    </>
  )
}

export default PDP_DynamicRenderChart
