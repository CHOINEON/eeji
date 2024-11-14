import { useRecoilValue } from 'recoil'
import { SymbolListState, SymbolState } from '../stores/atom'

const DataSummary = () => {
  const symbolList = useRecoilValue(SymbolListState)
  const symbol = useRecoilValue(SymbolState)

  return (
    <div className="m-3">
      <h3 className="text-black text-lg">Data Summary</h3>
      {symbolList?.filter((s) => s.symbol_id === symbol.symbol_id)[0]?.description}
      (출처 : {symbolList?.filter((s) => s.symbol_id === symbol.symbol_id)[0]?.source})
    </div>
  )
}

export default DataSummary
