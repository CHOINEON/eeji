import styled from '@emotion/styled'
import { Select, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'
import { analysisResponseAtom, filteredResultState } from 'views/AIModelGenerator/store/response/atoms'
import { selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import ModelPerformance from 'views/XAI-simulator/ModelPerformance'
import { colorsForDoughnut } from 'views/AIModelGenerator/components/Chart/colors'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import FeatureClassPerformance from './FeatureClassPerformance'
const FeatureAnalysis = ({ data, input }: any) => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  // const selectedData = useRecoilValue(selectedDataState)
  // const newdata = useRecoilValue(filteredResultState('feature_data'))

  const [modelIdx, setModelIdx] = useRecoilState(selectModelState)
  const [chartData, setChartData] = useState({ labels: [], values: [] })
  console.log('analysisResponse:', analysisResponse)
  useEffect(() => {
    // console.log('selectedData:', selectedData)
    // console.log('newdata:', newdata)
    setChartData(analysisResponse[modelIdx]['feature_data'][0])
  }, [modelIdx])

  return (
    <>
      <ModelPerformance />
      <FeatureClassPerformance />
      <ComponentContainer>
        <SubTitle>
          Feature Importance
          <InfoCircle content="변수 중요도가 높을 수록 예측 모델에 대한 영향력이 큽니다." />
        </SubTitle>
        <>
          <div className="block float-left w-100">
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
          <div className="block float-left w-100">
            <FeatureImportance data={chartData} colors={colorsForDoughnut} />
          </div>
        </>
      </ComponentContainer>
    </>
  )
}

export default FeatureAnalysis

const ComponentContainer = styled.div`
  display: block;
  float: left;
  margin: 5px;
  min-height: 430px;
  background-color: #f6f8ff;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
`

const Title = styled.div`
  display: block;
  float: left;
  color: #002d65;
  font-weight: bold;
  padding: 20px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

const SubTitle = styled(Title)`
  font-size: 22px;
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
  margin-left: 20px;
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
