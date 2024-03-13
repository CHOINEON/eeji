import styled from '@emotion/styled'
import React from 'react'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'
import { AITextContainer, AIbutton } from 'views/AIModelGenerator/Visualization/Features/FeatureAnalysis'

const GlobalFeatureImportance = ({ data, colors }: any) => {
  return (
    <>
      <ComponentContainer>
        <div className="mt-1 ml-[20px] w-[420px]">
          <Title className="inline-block">변수 기여도 통계(평균)</Title>
          <InfoCircle content="각 변수가 전체 예측에 미치는 영향도" color="#9E9E9E" />
          <FeatureImportance data={data} colors={colors} />
          <div className="my-6 block float-left w-full">
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
  width: 100%;
  height: 57%;
  margin-top: 22px;
  display: block;
  float: left;
  justify-content: space-evenly;
  padding: 5% 1%;
  background-color: #ffffff;
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
