import { Spin } from 'antd'
import IndexApi from 'apis/IndexApi'
import { IPrediction } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { capitalizeFirstLetter } from 'utils/StringFormatter'
import ChartComponent from '../ChartComponent'
import { graphDataState, RawDataState, selectedFilterState, SymbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

const VisualPanel = () => {
  const symbol = useRecoilValue(SymbolState)
  const setGraphData = useSetRecoilState(graphDataState)
  const setRawData = useSetRecoilState(RawDataState)
  const setSelectedFilter = useSetRecoilState(selectedFilterState)
  const [loading, setLoading] = useState(true)

  const fetchPredictionData = () => {
    setLoading(true)
    return IndexApi.getPredictionData(symbol.symbol_id, symbol.selectedHorizon.toString())
  }
  const fetchRawData = () => {
    setLoading(true)
    return IndexApi.getRawData(symbol.symbol_id)
  }

  const { data: predictionData } = useQuery(
    ['predictionData', symbol.symbol_id, symbol.selectedHorizon],
    fetchPredictionData,
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
      onSuccess: (data) => {
        if (data) {
          setGraphData(data?.prediction as IPrediction[])
          setSelectedFilter((prev) => ({ ...prev, has_ci: data?.is_ci }))
        }
      },
      refetchOnWindowFocus: false,
      // refetchOnMount: true,
    }
  )

  const { data: rawData } = useQuery(['rawData', symbol.symbol_id], fetchRawData, {
    enabled: !!symbol.symbol_id,
    onSuccess: (data) => {
      if (data) setRawData(data)
    },
    refetchOnWindowFocus: false,
    // refetchOnMount: true,
  })

  useEffect(() => {
    console.log('predictionData:', predictionData)
    console.log('rawData:', rawData)
    if (predictionData && rawData) setLoading(false)
  }, [predictionData, rawData])

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbol.symbol_id}</span>
        <span>{capitalizeFirstLetter(symbol.period)}</span>
        <span className="mx-2"> | </span>
        <span>{symbol.unit}</span>
      </div>
      <Spin tip="Loading" size="large" spinning={loading}>
        <div className="m-5">
          <ChartComponent />
          <div className="mt-3">
            <HorizonButtonGroup />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default VisualPanel
