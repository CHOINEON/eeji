import IndexApi from 'apis/IndexApi'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import ChartComponent, { ChartProps } from './ChartComponent'

import { Radio, RadioChangeEvent } from 'antd'

const options = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
]

const Index = (props: ChartProps) => {
  const [symbol, setSymbol] = useState('Nickel')
  const [initialData, setInitialData] = useState([])
  const [chartData, setChartData] = useState([])
  const [period, setPeriod] = useState(1)

  const { mutate: fetchPredictionData } = useMutation(IndexApi.getPredictiondata, {
    onSuccess: (response: { data: Array<unknown> }) => {
      setInitialData(response?.data)
    },
  })

  useEffect(() => {
    if (initialData.length > 0) {
      const newArr = []

      // Filter and map the initialData for both prediction and groundTruth in one pass
      const filteredData = initialData
        .filter((item) => item.horizon === period)
        .map((item) => ({
          time: new Date(item.date).getTime() / 1000, // Convert to UNIX timestamp in seconds
          pred: item.pred,
          groundTruth: item.ground_truth,
        }))
        .sort((a, b) => a.time - b.time) // Sort by time in ascending order

      // Split the filtered data into prediction and groundTruth
      const prediction = filteredData.map(({ time, pred }) => ({ time, value: pred }))
      const groundTruth = filteredData.map(({ time, groundTruth }) => ({ time, value: groundTruth }))

      newArr.push(prediction)
      newArr.push(groundTruth)

      setChartData([
        { data: prediction, lineColor: '#2962FF' },
        { data: groundTruth, lineColor: 'rgb(225, 87, 90)' },
      ])
    }
  }, [initialData, period])

  useEffect(() => {
    fetchPredictionData(symbol)
  }, [])

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setPeriod(value)
  }

  return (
    <div className="mt-7">
      <div className="">
        <h3 className="text-white inline-block mx-5">Symbol : {symbol}</h3>
        <Radio.Group options={options} optionType="button" buttonStyle="solid" onChange={onChange} value={period} />
      </div>
      <div className="m-5">
        <ChartComponent {...props} series={chartData}></ChartComponent>
      </div>
    </div>
  )
}

export default Index
