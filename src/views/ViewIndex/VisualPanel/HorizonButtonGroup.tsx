import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedIndexState, SymbolState } from '../stores/atom'

const HorizonButtonGroup = () => {
  const horizons = useRecoilValue(SymbolState).horizons
  const symbol = useRecoilValue(SymbolState)
  const [selectedButton, setSelectedButton] = useRecoilState(selectedIndexState)

  useEffect(() => {
    if (symbol.horizons.length > 0) setSelectedButton({ horizon: JSON.parse(symbol.horizons)[0] })
  }, [horizons])

  return (
    horizons && (
      <div className="flex flex-row justify-center">
        {JSON.parse(horizons)?.map((horizon: number) => (
          <PeriodButton
            className={`rounded border ${
              selectedButton.horizon === horizon ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            } mx-1`}
            key={horizon}
            onClick={() => setSelectedButton({ horizon: horizon })}
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
