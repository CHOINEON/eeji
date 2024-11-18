import IndexApi from 'apis/IndexApi'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import ExplanationPanel from './ExplanationPanel/ExplanationPanel'
import ResizablePanels from './ResizablePanels'
import { SymbolListState, SymbolState } from './stores/atom'
import VisualPanel from './VisualPanel/VisualPanel'

const Main = () => {
  const setSymbolList = useSetRecoilState(SymbolListState)
  const setSymbol = useSetRecoilState(SymbolState)

  const { mutate: getSymbolList } = useMutation({
    mutationFn: IndexApi.getSymbolList,
    onSuccess: (response) => {
      setSymbolList(response.symbols)
      setSymbol({ ...response.symbols[0], selectedHorizon: JSON.parse(response.symbols[0].horizons)[0] })
    },
  })

  useEffect(() => {
    getSymbolList()
  }, [])

  return <ResizablePanels panel1={<VisualPanel />} panel2={<ExplanationPanel />} panel3={null} panel4={null} />
}

export default Main
