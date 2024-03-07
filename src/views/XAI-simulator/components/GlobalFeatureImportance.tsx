import styled from '@emotion/styled'
import React from 'react'
import FeatureImportance from 'views/AIModelGenerator/FeatureImportance'
import { AITextContainer, AIbutton } from 'views/AnalysisResult/FeatureAnalysis'

const GlobalFeatureImportance = ({ data }: any) => {
  return (
    <>
      <ComponentContainer>
        <div className="ml-[20px] w-[420px]">
          <Title>Global Attribution</Title>
          <FeatureImportance data={data} />
          <div className="my-4 block float-left">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              현재 예측 모델에서 가장 영향력이 큰 변수는 <b>{data?.labels[0]}</b>
              입니다.
            </AITextContainer>
          </div>
        </div>
      </ComponentContainer>
    </>
  )
}

export default GlobalFeatureImportance

const ComponentContainer = styled.div`
// border: 1px solid red;
  display: block;
  float: left;
  justify-content: space-evenly;
  padding:5% 1%;
  background-color: #ffffff;
  width:100%
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  opacity: 1;
`

const Title = styled.p`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  color: #002d65;
  font-size: 21px;
`
