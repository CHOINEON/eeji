/* eslint-disable @typescript-eslint/no-loss-of-precision */
import styled from '@emotion/styled'
import { Select, SelectProps } from 'antd'
import { Chart as ChartJS } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'

ChartJS.register(ChartDataLabels)

const PDP_Plot = ({ pdpData, target }: any) => {
  const { t } = useTranslation()

  const values: Array<Array<unknown>> = Object.values(pdpData)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const chartOptions = {
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
    scales: {
      x: {
        title: {
          display: true,
          text: t('quantile_of_variable', { variable: selectedOption, quantile: t('quantile') }) || 'X Axis', // 부모로부터 전달된 target의 x축 레이블
        },
      },
      y: {
        title: {
          display: true,
          text: t('change_in_target', { variable: target, change: t('change') }) || 'Y Axis', // 부모로부터 전달된 target의 y축 레이블
        },
      },
    },
  }

  const options: SelectProps['options'] = Object.keys(pdpData)?.map((key) => ({
    value: key,
    label: key,
  }))

  const [chartData, setChartData] = useState<{ datasets: any[]; labels: string[] }>({
    datasets: [
      {
        label: `Dataset 0`,
        data: Object.values(pdpData)[0],
        borderColor: '#86C162',
        backgroundColor: '#1B73FF69',
      },
    ],
    labels: Array.from({ length: values[0]?.length }, (_, i) => `[${i * 11.11}]`),
  })

  const handleChange = (value: any) => {
    setSelectedOption(value)
    const selectedData = pdpData[value]

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
        <div className="mt-2 ml-[20px]">
          <Title>{t('Prediction of Variable Impact')}</Title>
          <InfoCircle
            content={t('Surrounding effect of a single variable on prediction results')}
            styleClass="text-[#9E9E9E]"
          />
          <div className="w-100 my-3 pr-4 text-right">
            <Select
              className="w-[200px] mx-5 text-left"
              defaultValue={options[0]?.value}
              onChange={handleChange}
              options={options}
            />
          </div>
          <div className="my-2 h-[200px]">
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
  border: 1px solid red;
  width: 100%;
  height: 300px;
  display: block;
  float: left;
  justify-content: space-evenly;
  padding: 4% 1%;
  background-color: #ffffff;
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
  padding-right: 20px;
`
