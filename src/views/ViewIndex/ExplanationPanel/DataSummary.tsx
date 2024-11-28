import { useRecoilValue } from 'recoil'
import { SymbolListState, SymbolState } from '../stores/atom'
import { ComponentTitle } from './CommonComponents'

const DataSummary = () => {
  const symbolList = useRecoilValue(SymbolListState)
  const symbol = useRecoilValue(SymbolState)

  return (
    <div className="m-2">
      {symbolList?.filter((s) => s.symbol_id === symbol.symbol_id)[0]?.description && (
        <>
          <ComponentTitle title="Data Summary" />
          <div>
            {symbolList?.filter((s) => s.symbol_id === symbol.symbol_id)[0]?.description}
            {''} (출처 : {symbolList?.filter((s) => s.symbol_id === symbol.symbol_id)[0]?.source})
          </div>
        </>
      )}
    </div>
  )
}

export default DataSummary
