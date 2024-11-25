import styled from '@emotion/styled'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { graphDataState, RawDataState, SymbolState } from '../stores/atom'

const HorizonButtonGroup = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState) //최초 버튼 생성에만 사용
  const resetGraphData = useResetRecoilState(graphDataState)
  const resetRawData = useResetRecoilState(RawDataState)

  const onClick = (horizon: number) => {
    setSymbol({ ...symbol, selectedHorizon: horizon })

    //prediction, raw data 초기화
    resetGraphData()
    resetRawData()
  }

  return (
    symbol.horizons && (
      <div className="flex flex-row justify-center">
        {JSON.parse(symbol.horizons)?.map((horizon: number, index: number) => (
          <PeriodButton
            className={`rounded border ${
              symbol.selectedHorizon === horizon ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            } mx-1`}
            key={index}
            onClick={() => onClick(horizon)}
          >
            {horizon + symbol.period.charAt(0).toUpperCase()}
          </PeriodButton>
        ))}
      </div>
    )
  )
}

export default HorizonButtonGroup

const PeriodButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 20px;
`
