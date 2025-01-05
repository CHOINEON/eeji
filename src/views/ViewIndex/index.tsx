import IndexApi from 'apis/IndexApi'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import PanelWrapper from './PanelWrapper'
import { horizonState, symbolState } from './stores/atom'
import VisualPanel from './VisualPanel/VisualPanel'

const Main = () => {
  //전체 symbbol list(Array) 와 선택된 symbol을 하나의 상태로 관리 (filtering을 위해 selector사용)
  const setSymbol = useSetRecoilState(symbolState)
  //선택된 symbol의 horizon list(Array) 와 선택된 horizon을 하나의 상태로 관리
  const setHorizon = useSetRecoilState(horizonState)

  const { mutate: getSymbolList } = useMutation({
    mutationFn: IndexApi.getSymbolList,
    onSuccess: (response) => {
      setSymbol({
        symbolList: response.symbols,
        selectedSymbolData: response.symbols[0],
      })
      setHorizon({
        horizonList: JSON.parse(response.symbols[0].horizons),
        selectedHorizon: JSON.parse(response.symbols[0].horizons)[0],
      })
    },
  })

  useEffect(() => {
    getSymbolList()
  }, [])

  //<ExplanationPanel />
  return <PanelWrapper panel1={<VisualPanel />} panel2={null} />
}

export default Main
