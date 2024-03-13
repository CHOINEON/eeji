/* eslint-disable @typescript-eslint/no-loss-of-precision */
import styled from '@emotion/styled'
import { Select, Card, SelectProps } from 'antd'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'

ChartJS.register(ChartDataLabels)

const PDP_Plot = ({ data }: any) => {
  // console.log('data:', data)
  const keys: Array<string> = Object.keys(data)
  const values: Array<Array<unknown>> = Object.values(data)

  const chartOptions = {
    layout: {
      padding: 20,
      margin: 'auto',
    },
    responsive: true,
    // maintainAspectRatio: false, //will take up entire container
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
  }

  const options: SelectProps['options'] = Object.keys(data)?.map((key) => ({
    value: key,
    label: key,
  }))

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const [chartData, setChartData] = useState<{ datasets: any[]; labels: string[] }>({
    datasets: [
      {
        label: `Dataset 0`,
        data: Object.values(data)[0],
        borderColor: '#86C162',
        backgroundColor: '#1B73FF69',
      },
    ],
    labels: Array.from({ length: values[0]?.length }, (_, i) => `[${i * 11.11}]`),
  })

  const handleChange = (value: any) => {
    setSelectedOption(value)
    const selectedData = data[value]
    // console.log('selectedData:', selectedData)

    setChartData({
      datasets: [
        {
          label: `Dataset ${value}`,
          data: selectedData,
          borderColor: '#86C162',
          backgroundColor: '#1B73FF69',
        },
      ],
      labels: Array.from({ length: selectedData.length }, (_, i) => `[${i * 11.11}]`),
    })
  }

  return (
    <>
      <ComponentContainer>
        <div className="mt-1 ml-[20px] w-[420px]">
          <Title>변수 변화 결과 예측</Title>
          <InfoCircle content="하나의 변수가 예측 결과에 미치는 주변 효과" color="#9E9E9E" />
          <Select
            className="ml-2 w-[175px] bg-[#F5F8FF] border-[#D5DCEF]"
            defaultValue={options[0]?.value}
            onChange={handleChange}
            options={options}
          />
          <div className="block float-left w-full">
            <ChartWrapper>
              <Line data={chartData} options={chartOptions} />
            </ChartWrapper>
          </div>
        </div>
      </ComponentContainer>
    </>
  )
}

export default PDP_Plot

const ComponentContainer = styled.div`
  // border: 1px solid red;
  display: block;
  float: left;
  justify-content: space-evenly;
  padding: 5% 1%;
  background-color: #ffffff;
  width: 100%;
  height: 40%;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  opacity: 1;
`

const Title = styled.div`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: #002d65;
  font-size: 21px;
  display: block;
  float: left;
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 10px;
`
