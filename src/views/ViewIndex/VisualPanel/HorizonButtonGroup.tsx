import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { graphDataState, horizonState, symbolState } from '../stores/atom'

const HorizonButtonGroup = () => {
  const [horizon, setHorizon] = useRecoilState(horizonState)
  const symbols = useRecoilValue(symbolState)
  const resetGraphData = useResetRecoilState(graphDataState)

  const onClick = (selectedHorizon: number) => {
    setHorizon({ ...horizon, selectedHorizon: selectedHorizon })

    //prediction, raw data 초기화
    resetGraphData()
  }

  return (
    horizon.horizonList?.length > 0 && (
      <div className="flex flex-row justify-center">
        {horizon.horizonList.map((h: number, index: number) => (
          <button
            className={`rounded-2xl border w-[80px] h-[30px] ${
              horizon.selectedHorizon === h ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            } mx-1`}
            key={index}
            onClick={() => onClick(h)}
          >
            {h + symbols.selectedSymbolData?.period?.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    )
  )
}

export default HorizonButtonGroup
