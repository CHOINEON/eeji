import { Radio, RadioChangeEvent } from 'antd'
import IndexApi from 'apis/IndexApi'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { capitalizeFirstLetter } from 'utils/StringFormatter'
import ChartComponent from '../ChartComponent'
import { selectedIndexState, SymbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

const plainOptions = ['History', 'Forecast']

const VisualPanel = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState)
  const [viewType, setViewType] = useState('History')

  const [initialData, setInitialData] = useState([])
  const [chartData, setChartData] = useState([])
  const selectedIndex = useRecoilValue(selectedIndexState)

  const { data } = useQuery(
    ['predictionData', symbol.symbol_id, selectedIndex.horizon],
    () => IndexApi.getPredictionData(symbol.symbol_id, selectedIndex.horizon.toString()),
    {
      enabled: !!symbol.symbol_id && !!selectedIndex.horizon,
    }
  )

  useEffect(() => {
    console.log('data:', data?.data.length)
    if (data?.data && data?.data.length > 0) setInitialData(data?.data)
  }, [data])

  useEffect(() => {
    if (initialData.length > 0) {
      const newArr = []

      // Filter and map the initialData for both prediction and groundTruth in one pass
      const filteredData = initialData
        .filter((item) => item.horizon === selectedIndex.horizon)
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
  }, [initialData])

  useEffect(() => {
    // fetchPredictionData(symbol.symbol_id, symbol.horizons)
  }, [])

  const onChangeViewType = ({ target: { value } }: RadioChangeEvent) => {
    setViewType(value)
  }

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbol.symbol_id}</span>
        <span>{capitalizeFirstLetter(symbol.period)}</span>
        <div className="my-4">
          <Radio.Group
            options={plainOptions}
            onChange={onChangeViewType}
            value={viewType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <h5 className="text-black text-sm"></h5>

        {/* <Radio.Group options={options} optionType="button" buttonStyle="solid" onChange={onChange} value={period} /> */}
      </div>
      <div className="m-5">
        <ChartComponent series={chartData}></ChartComponent>
        <div className="mt-3">
          <HorizonButtonGroup />
        </div>
      </div>
    </div>
  )
}

export default VisualPanel
