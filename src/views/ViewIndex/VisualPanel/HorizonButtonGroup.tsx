import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { filterConditionState, SymbolState } from '../stores/atom'

const HorizonButtonGroup = () => {
  const symbol = useRecoilValue(SymbolState) //최초 버튼 생성에만 사용
  const [filterCondition, setFilterCondition] = useRecoilState(filterConditionState)

  useEffect(() => {
    if (symbol.horizons.length > 0) {
      setFilterCondition({ horizon: JSON.parse(symbol.horizons)[0] })
    }
  }, [symbol.horizons])

  return (
    symbol.horizons && (
      <div className="flex flex-row justify-center">
        {JSON.parse(symbol.horizons)?.map((horizon: number, index: number) => (
          <PeriodButton
            className={`rounded border ${
              filterCondition.horizon === horizon ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            } mx-1`}
            key={index}
            onClick={() => setFilterCondition({ horizon: horizon })}
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
