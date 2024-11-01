import IndexApi from 'apis/IndexApi'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { capitalizeFirstLetter } from 'utils/StringFormatter'
import ChartComponent from '../ChartComponent'
import { graphDataState, selectedIndexState, SymbolState } from '../stores/atom'
import HorizonButtonGroup from './HorizonButtonGroup'
import SymbolDropdown from './SymbolDropdown'

// 개발 보류
// const plainOptions = ['History', 'Forecast']
// const [viewType, setViewType] = useState('History')

const VisualPanel = () => {
  const symbol = useRecoilValue(SymbolState)
  const selectedIndex = useRecoilValue(selectedIndexState)
  const setGraphData = useSetRecoilState(graphDataState)

  const { data } = useQuery(
    ['predictionData', symbol.symbol_id, selectedIndex.horizon],
    () => IndexApi.getPredictionData(symbol.symbol_id),
    {
      enabled: !!symbol.symbol_id && !!selectedIndex.horizon,
    }
  )

  // const { data: rawData } = useQuery(['rawData', symbol.symbol_id], () => IndexApi.getRawData(symbol.symbol_id), {
  //   enabled: !!symbol.symbol_id,
  // })

  useEffect(() => {
    if (data) setGraphData(data[selectedIndex.horizon])
  }, [data, selectedIndex])

  // const onChangeViewType = ({ target: { value } }: RadioChangeEvent) => {
  //   setViewType(value)
  // }

  return (
    <div className="m-3">
      <SymbolDropdown />
      <div>
        <span className="text-black text-xl mr-5">{symbol.symbol_id}</span>
        <span>{capitalizeFirstLetter(symbol.period)}</span>
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
