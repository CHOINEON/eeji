import styled from '@emotion/styled'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { graphDataState, horizonState, selectedSymbolSelector } from '../stores/atom'

const HorizonButtonGroup = () => {
  const selectedSymbol = useRecoilValue(selectedSymbolSelector) //최초 버튼 생성에만 사용
  const [horizon, setHorizon] = useRecoilState(horizonState)
  const resetGraphData = useResetRecoilState(graphDataState)

  const onClick = (selectedHorizon: number) => {
    setHorizon({ ...horizon, selectedHorizon: selectedHorizon })

    //prediction, raw data 초기화
    resetGraphData()
  }

  return (
    horizon.horizonList && (
      <div className="flex flex-row justify-center">
        {horizon.horizonList?.map((horizon: number, index: number) => (
          <PeriodButton
            // className={`rounded border ${
            //   horizon.selectedHorizon === horizon ? 'border-[#4338f7]' : 'border-[#d9d9d9]'
            // } mx-1`}
            key={index}
            onClick={() => onClick(horizon)}
          >
            {/* {horizon + selectedSymbol.period.charAt(0).toUpperCase()} */}
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
