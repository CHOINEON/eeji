import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { dataPropertyState } from 'views/AIModelGenerator/store/dataset/atom'
import styled from 'styled-components'
import { useMutation } from 'react-query'

import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { PerformanceModel, PerformanceModelTyeps } from 'apis/type/ModelPerformanceOption'

// type dataType = {
//   fscore: number
//   mae: number
//   mse: number
//   rmse: number
// }

const data: { [key: string]: string } = {
  mae: '0.412',
  mse: '0.512',
  rmse: '0.714',
  fscore: '0',
}

const ModelPerformance = ({ data }: any) => {
  const dataProperty = useRecoilValue(dataPropertyState)

  const handleSave = () => {
    //mutation()
  }

  return (
    <>
      {dataProperty.algo_type === 1 ? (
        <div>
          <ComponentContainer>
            <PerformanceTitleImgWrap>
              <PerformanceTitle>모델 성능(classification)</PerformanceTitle>
              <div>
                <img src={IcoPerformance} alt="Performance Icon" />
              </div>
            </PerformanceTitleImgWrap>
            <div>의 데이터를 분석했습니다.</div>
            <PerformanceContentsWrap>
              <PerformanceContentsBox>
                <PerformanceContents>AI 모델</PerformanceContents>
                <PerformanceModelValue>INEEJI_1</PerformanceModelValue>
              </PerformanceContentsBox>
              <PerformanceContentsBox>
                <PerformanceContents>AI 모델 정확도</PerformanceContents>
                {Object.keys(data).map((key: string) => {
                  const modelKey = key as keyof PerformanceModel
                  console.log('modelKey', modelKey)
                  return (
                    <PerformanceContentsBox>
                      <PerformanceValue>{data[modelKey]}</PerformanceValue>
                    </PerformanceContentsBox>
                  )
                })}
              </PerformanceContentsBox>
            </PerformanceContentsWrap>
            <PerformanceButtonWrap>
              <SaveButton>SAVE</SaveButton>
              <ExportButton>REPORT</ExportButton>
            </PerformanceButtonWrap>
          </ComponentContainer>
        </div>
      ) : (
        <div>
          <ComponentContainer>
            <PerformanceTitleImgWrap>
              <PerformanceTitle>모델 성능</PerformanceTitle>
              <div>
                <img src={IcoPerformance} alt="Performance Icon" />
              </div>
            </PerformanceTitleImgWrap>

            <div>Ineeji-sensor-2024.00.00.csv의 데이터를 분석했습니다.</div>
            <PerformanceContentsWrap>
              {Object.keys(data).map((key, index) => {
                const modelKey = key as keyof PerformanceModel
                const isFirstItem = index === 0
                const boxStyle = isFirstItem ? {} : { borderLeft: '1px solid red', paddingLeft: '10px' }

                return (
                  <PerformanceContentsBox style={boxStyle}>
                    <div key={modelKey}>
                      <PerformanceContents>{modelKey.toString().toUpperCase()}</PerformanceContents>
                      <PerformanceValue>{data[modelKey]}</PerformanceValue>
                    </div>
                  </PerformanceContentsBox>
                )
              })}
            </PerformanceContentsWrap>
            <PerformanceButtonWrap>
              <SaveButton onClick={handleSave}>SAVE</SaveButton>
              <ExportButton>REPORT</ExportButton>
            </PerformanceButtonWrap>
          </ComponentContainer>
        </div>
      )}
    </>
  )
}

export default ModelPerformance

const ComponentContainer = styled.div`
  padding: 26px 28px;
  box-shadow: 0px 0px 20px #0000001a;
  border: 1px solid #d5dcef;
  background-color: #4338f7;
  border-radius: 18px;
  color: #ffffff;
  font-size: 15px;
  font-face: 'Helvetica Neue';
  background-image: url('path/to/your/image.png');
  background-size: cover;
  background-position: center;
`

const PerformanceTitle = styled.span`
  color: #95eb61;
  font-weight: bold;
  margin-bottom: 7.5px;
  font-size: 26px;
`
const PerformanceContentsWrap = styled.div`
  display: flex;
  padding-top: 19.5px;
`
const PerformanceContentsBox = styled.div`
  flex: 1;
`
const PerformanceContents = styled.span`
  color: #fff;
  font-size: 21px;
  padding-right: 10px;
`
const PerformanceModelValue = styled.span`
  color: #95eb61;
  font-size: 33px;
`
const PerformanceValue = styled.div`
  color: #95eb61;
  font-size: 30px;
`
const PerformanceButtonWrap = styled.div`
  text-align: center;
`
const PerformanceButton = styled.button`
  border-radius: 9px;
  background-color: #e5ebff;
  color: #4338f7;
  font-size: 17px;
  height: 46px;
  line-height: 46px;
  width: 208px;
  font-weight: bold;
  // &.firstButton {
  //   margin-right: 5px;
  // }
  // &.secondButton {
  //   margin-left: 5px;
  // }
`

const SaveButton = styled(PerformanceButton)`
  margin-right: 5px;
`

const ExportButton = styled(PerformanceButton)`
  margin-left: 5px;
`

const PerformanceTitleImgWrap = styled.div`
  display: flex;
  justify-content: space-between;
`
