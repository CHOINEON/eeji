import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { SymbolState } from '../stores/atom'

const HorizonButtonGroup = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState) //최초 버튼 생성에만 사용

  // const [filterCondition, setFilterCondition] = useRecoilState(filterConditionState)

  useEffect(() => {
    if (symbol.horizons.length > 0) {
      setSymbol({ ...symbol, selectedHorizon: JSON.parse(symbol.horizons)[0] })
    }
  }, [symbol.horizons])

  return (
    symbol.horizons && (
      <div className="flex flex-row justify-center">
        {JSON.parse(symbol.horizons)?.map((horizon: number, index: number) => (
          <PeriodButton
            className={`rounded border ${
              symbol.selectedHorizon === horizon ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            } mx-1`}
            key={index}
            onClick={() => setSymbol({ ...symbol, selectedHorizon: horizon })}
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
