import IndexApi from 'apis/IndexApi'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import GlobalFeatureImportance from './ExplanationPanel/GlobalFeatureImportance'
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
      setSymbol(response.symbols[0])
    },
  })

  useEffect(() => {
    getSymbolList()
  }, [])

  return (
    <ResizablePanels
      panel1={<VisualPanel />}
      panel2={<GlobalFeatureImportance />}
      panel3={
        <div>
          <h1 className="text-xl font-bold">Panel 3</h1>
          <p>This is the content of Panel 3.</p>
        </div>
      }
      panel4={
        <div>
          <h1 className="text-xl font-bold">Panel 4</h1>
          <p>This is the content of Panel 4.</p>
        </div>
      }
    />
  )
}

export default Main
