import IndexApi from 'apis/IndexApi'
import { IRawData } from 'apis/type/IndexResponse'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { capitalizeFirstLetter } from 'utils/StringFormatter'
import ChartComponent from '../ChartComponent'
import { graphDataState, SymbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

// 개발 보류
// const plainOptions = ['History', 'Forecast']
// const [viewType, setViewType] = useState('History')

const VisualPanel = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState)
  const setGraphData = useSetRecoilState(graphDataState)

  const { data: predictionData } = useQuery(
    ['predictionData', symbol.symbol_id, symbol.selectedHorizon],
    () => IndexApi.getPredictionData(symbol.symbol_id),
    {
      enabled: !!symbol.symbol_id && !!symbol.selectedHorizon,
    }
  )

  const { data: rawData } = useQuery(['rawData', symbol.symbol_id], () => IndexApi.getRawData(symbol.symbol_id), {
    enabled: !!symbol.symbol_id,
  })

  useEffect(() => {
    if (predictionData) setGraphData(predictionData[symbol.selectedHorizon])
  }, [predictionData, symbol.selectedHorizon])

  useEffect(() => {
    if (rawData) {
      const firstFeatureKey = Object.keys(rawData?.features)[0] as keyof typeof rawData.features
      setSymbol({
        ...symbol,
        features: rawData.features,
        dates: rawData.features[firstFeatureKey].map((item: IRawData) => item.date),
      })
    }
  }, [rawData])

  //   setViewType(value)
  // }

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbol.symbol_id}</span>
        <span>{capitalizeFirstLetter(symbol.period)}</span>
        <span className="mx-2"> | </span>
        <span>{symbol.unit}</span>
        {/* <div className="my-4">
          <Radio.Group
            options={plainOptions}
            onChange={onChangeViewType}
            value={viewType}
            optionType="button"
            buttonStyle="solid"
          />
        </div> */}
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
