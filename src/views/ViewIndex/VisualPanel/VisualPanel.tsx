import IndexApi from 'apis/IndexApi'
import { IPrediction } from 'apis/type/IndexResponse'
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { capitalizeFirstLetter } from 'utils/StringFormatter'
import ChartComponent from '../ChartComponent'
import { graphDataState, RawDataState, SymbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

const VisualPanel = () => {
  const symbol = useRecoilValue(SymbolState)
  const setGraphData = useSetRecoilState(graphDataState)
  const setRawData = useSetRecoilState(RawDataState)

  const fetchPredictionData = () => IndexApi.getPredictionData(symbol.symbol_id, symbol.selectedHorizon.toString())
  const fetchRawData = () => IndexApi.getRawData(symbol.symbol_id)

  const { data: predictionData } = useQuery(
    ['predictionData', symbol.symbol_id, symbol.selectedHorizon],
    fetchPredictionData,
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
      onSuccess: (data) => {
        if (data) setGraphData(data?.prediction as IPrediction[])
      },
    }
  )

  const { data: rawData } = useQuery(['rawData', symbol.symbol_id], fetchRawData, {
    enabled: !!symbol.symbol_id,
    onSuccess: (data) => {
      if (data) setRawData(data)
    },
  })

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbol.symbol_id}</span>
        <span>{capitalizeFirstLetter(symbol.period)}</span>
        <span className="mx-2"> | </span>
        <span>{symbol.unit}</span>
      </div>
      <div className="m-5">
        <ChartComponent />
        <div className="mt-3">
          <HorizonButtonGroup />
        </div>
      </div>
    </div>
  )
}

export default VisualPanel
