/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Select, Card, SelectProps } from 'antd'
import Title from 'antd/es/typography/Title'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScriptableContext,
} from 'chart.js'
import { ChartData } from 'chart.js'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ChartDataLabels)

const PDP_Plot = ({ data }: any) => {
  console.log('data:', data)

  const short_pdp_keys = Object.keys(data)
  const short_pdp_values = Object.values(data)

  // const chartOptions = {
  //   layout: {
  //     padding: 20,
  //     margin: 'auto',
  //   },
  //   responsive: true,
  //   plugins: {
  //     //왜 안되냐고....
  //     datalabels: {
  //       display: false,
  //     },
  //   },
  //   // interaction: {
  //   //   mode: 'nearest', //as const,
  //   //   intersect: false,
  //   //   axis: 'x',
  //   // },
  // }

  // const { Option } = Select

  // const options: SelectProps['options'] = short_pdp_keys.map((key) => ({
  //   value: key,
  //   label: key,
  // }))

  // const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // const [myData, setMyData] = useState<{ datasets: any[]; labels: string[] }>({
  //   datasets: [
  //     {
  //       label: `Dataset 0`,
  //       data: short_pdp_values[0],
  //       borderColor: '#86C162',
  //       backgroundColor: '#1B73FF69',
  //     },
  //   ],
  //   labels: Array.from({ length: short_pdp_values[0].length }, (_, i) => `[${i * 11.11}]`),
  // })

  // const handleChange = (value: string) => {
  //   setSelectedOption(value)
  //   const selectedData = short_pdp_values[Number(value)]
  //   setMyData({
  //     datasets: [
  //       {
  //         label: `Dataset ${value}`,
  //         data: selectedData,
  //         borderColor: '#86C162',
  //         backgroundColor: '#1B73FF69',
  //       },
  //     ],
  //     labels: ['test'],

  //     // labels: Array.from({ length: selectedData.length }, (_, i) => `[${i * 11.11}]`),
  //   })
  // }

  return (
    <>
      <Card style={{ width: '100%' }}>
        <Box
          style={{
            position: 'relative',
            zIndex: 1000,
            height: '100%',
          }}
        >
          {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title style={{ fontSize: '20px', color: '#002D65' }}> Partical Dependence Plot CO </Title>
            <Select style={{ width: '30%' }} onChange={handleChange} options={options} />
          </div>{' '}
          <ChartWrapper>
            <Line data={myData} options={chartOptions} />
          </ChartWrapper> */}
        </Box>{' '}
      </Card>
    </>
  )
}

export default PDP_Plot

const ChartWrapper = styled.div`
  // display: ${(props: any) => (props.toggle ? 'block' : 'none')};
  // border: 1px solid pink;
  width: 100%;
  height: 200px;
  // width: ${(props: any) => (props.isClassification === 1 ? '200px' : '100%')};
  // height: ${(props: any) => (props.isClassification === 1 ? '600px' : '100%')};
  position: relative;
  float: left;
  margin: 10px;
`
