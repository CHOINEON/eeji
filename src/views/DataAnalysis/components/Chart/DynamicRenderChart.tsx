import { Select } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import LineChart from './LineChart'

const DynamicRenderChart = ({ type, data, options }: any) => {
  const [chartData, setChartData] = useState([])
  const [selectedOption, setSelectedOption] = useState()

  useEffect(() => {
    console.log('DynamicRenderChart data:', data)
    // console.log('options:', options)

    const defaultOption = options[0].value
    setSelectedOption(defaultOption)

    if (type === 'preprocessingResult') {
      setChartData(data.find((x: any) => x.column_name === defaultOption))
    } else if (type === 'modelResult') {
      setChartData(data[defaultOption])
    }
  }, [])

  const onChangeSelect = (param: any) => {
    setSelectedOption(param)

    if (type === 'preprocessingResult') {
      setChartData(data.find((x: any) => x.column_name === param))
    } else if (type === 'modelResult') {
      setChartData(data[param])
    }
  }

  return (
    <>
      {/* <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
        best_plot
      </Title> */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'block' }}>
          <Select style={{ width: '50%' }} onChange={onChangeSelect} value={selectedOption} options={options} />
        </div>
        <div className="w-100" style={{ height: '450px' }}>
          <LineChart chartData={chartData} />
        </div>
      </div>
    </>
  )
}

export default DynamicRenderChart
