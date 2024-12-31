import IndexApi from 'apis/IndexApi'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import PanelWrapper from './PanelWrapper'
import { horizonState, selectedSymbolSelector, symbolState } from './stores/atom'
import VisualPanel from './VisualPanel/VisualPanel'

const Main = () => {
  // const setSymbolList = useSetRecoilState(SymbolListState)

  //전체 symbbol list(Array) 와 선택된 symbol을 하나의 상태로 관리 (filtering을 위해 selector사용)
  const [symbol, setSymbol] = useRecoilState(symbolState)

  //선택된 symbol의 horizon list(Array) 와 선택된 horizon을 하나의 상태로 관리
  const [horizon, setHorizon] = useRecoilState(horizonState)

  const selectedSymbol = useRecoilValue(selectedSymbolSelector)

  const { mutate: getSymbolList } = useMutation({
    mutationFn: IndexApi.getSymbolList,
    onSuccess: (response) => {
      setSymbol({
        symbolList: response.symbols,
        selectedSymbol: response.symbols[0],
      })

      console.log(JSON.parse(response.symbols[0].horizons)) // [365]

      setHorizon({
        horizonList: JSON.parse(response.symbols[0].horizons).map((horizon: number) => horizon.toString()),
        selectedHorizon: JSON.parse(response.symbols[0].horizons)[0].toString(),
      })
      // setSymbolList(response)
      // setSymbol({ ...response.symbols[0], selectedHorizon: JSON.parse(response.symbols[0].horizons)[0] })
    },
  })

  useEffect(() => {
    console.log(symbol)
    console.log(horizon)
    console.log(selectedSymbol)
  }, [symbol, horizon])

  useEffect(() => {
    getSymbolList()
  }, [])

  //<ExplanationPanel />
  return <PanelWrapper panel1={<VisualPanel />} panel2={null} />
}

export default Main
