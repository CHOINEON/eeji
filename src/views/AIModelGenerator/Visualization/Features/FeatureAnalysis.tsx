import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import { selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'
import ModelPerformance from 'views/XAI-simulator/ModelPerformance'
import FeatureClassPerformance from './FeatureClassPerformance'

const FeatureAnalysis = ({ textVisible }: any) => {
  const [chartData, setChartData] = useState({ labels: [], values: [] })

  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const modelIdx = useRecoilValue(selectModelState)

  useEffect(() => {
    setChartData(analysisResponse[modelIdx]['feature_data'])
  }, [modelIdx])

  return (
    <>
      <ModelPerformance />
      {analysisResponse[modelIdx].classes && <FeatureClassPerformance />}
      <ComponentContainer textVisible={textVisible}>
        <SubTitle>
          변수 중요도
          <InfoCircle content="변수 중요도가 높을 수록 예측 모델에 대한 영향력이 큽니다." />
        </SubTitle>
        <div className={textVisible ? 'block' : 'hidden'}>
          <div className="block float-left w-100 mt-2">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              현재 예측 모델에서 가장 영향력이 큰 변수는 <b>{chartData?.labels[0]}</b>
              입니다.
            </AITextContainer>
          </div>
          <div className="block float-left w-100">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              현재 {modelIdx === 0 ? '자동 추천으로 ' : ''}입력된 원인 변수 X는{' '}
              <b>{analysisResponse[modelIdx]?.input?.join(', ')}</b>입니다.
            </AITextContainer>
          </div>
        </div>
        <div className="block float-left w-100">
          <FeatureImportance data={chartData} colors={colorChips} />
        </div>
      </ComponentContainer>
    </>
  )
}

export default FeatureAnalysis

const ComponentContainer = styled.div<{ textVisible: boolean }>`
  display: block;
  float: left;
  margin: 5px;
  min-height: ${(props: any) => (props.textVisible ? '350px' : '200px')};
  background-color: #f6f8ff;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
  white-space: wrap;
  padding: 20px 30px;
`

const Title = styled.div`
  display: block;
  float: left;
  color: #002d65;
  font-weight: bold;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

const SubTitle = styled(Title)`
  font-size: 20px;
  width: 100%;
`

export const AIbutton = styled.button`
  display: block;
  float: left;
  background-color: #31d600;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  color: white;
  font-weight: 500;
  margin-right: 10px;
`

export const AITextContainer = styled.div`
  font-family: 'Helvetica Neue';
  width: 80%;
  display: block;
  float: left;
  color: #002d65;
  fontsize: 12px;
  marginbottom: 5px;
`
