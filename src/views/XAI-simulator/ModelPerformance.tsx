import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { dataPropertyState, selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import styled from 'styled-components'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { PerformanceModel, PerformanceModelTyeps } from 'apis/type/ModelPerformanceOption'
import { message } from 'antd'
import { analysisResponseAtom, filteredResultState } from 'views/AIModelGenerator/store/response/atoms'
import { modalState } from 'stores/modal'
import useModal from 'hooks/useModal'
import ModelApi from 'apis/ModelApi'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'

const errorInfo: any = {
  mae: '평균절대오차. 모든 오차 절대값의 합을 평균. (0에 가까울 수록 좋은 모델)',
  mse: '평균제곱오차. 오차를 제곱한 값의 평균. (알고리즘이 예측한 값과 실제 정답과의 차이)',
  rmse: '평균 제곱근 오차. 예측 모델에서 예측한 값과 실제 값 사이의 평균 차이. 예측 모델이 목표 값(정확도)를 얼마나 잘 예측할 수 있는지 추정.',
}

const ModelPerformance = () => {
  const [modal, setModal] = useRecoilState(modalState)
  const { openModal, closeModal } = useModal()
  // const dataProperty = useRecoilValue(dataPropertyState)
  const selectedData = useRecoilValue(selectedDataState)

  const data = useRecoilValue(filteredResultState('error'))
  const currentKey = useRecoilValue(filteredResultState('uuid'))

  const handleSave = () => {
    // console.log('selectedData:', selectedData)
    // console.log('currentKey:', currentKey)

    const userId = localStorage.getItem('userId')
    const companyId = localStorage.getItem('companyId')

    const payload = {
      user_id: userId,
      com_id: companyId,
      uuid: currentKey[0],
      model_name: '',
      target_y: selectedData.targetY,
      isClassification: selectedData.isClassification,
    }
    // mutateSaveModel(payload)
    openModal({
      modalTitle: 'Model Save',
      modalType: 'SaveModel',
      modalProps: {
        payload,
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  const handleReport = () => {
    message.info('4월 서비스 준비 중입니다.')
  }

  // 데이터 값이 일정값을 넘을 시 B/M/K로 구분하여 내보내게 설정해놓았습니다.
  const formatNumber = (num: any) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num
  }

  return (
    <>
      <ComponentContainer>
        <PerformanceTitleImgWrap>
          <PerformanceTitle>모델 성능</PerformanceTitle>
          <div>
            <img src={IcoPerformance} alt="Performance Icon" />
          </div>
        </PerformanceTitleImgWrap>

        <div>{selectedData.name} 데이터로 학습을 진행한 결과입니다.</div>
        {selectedData.isClassification === 1 ? (
          <PerformanceContentsWrap>
            <PerformanceContentsBox>
              <PerformanceContents>AI 모델</PerformanceContents>
              <PerformanceModelValue>INEEJI_1</PerformanceModelValue>
            </PerformanceContentsBox>
            <PerformanceContentsBox>
              <PerformanceContents>F-SCORE</PerformanceContents>

              {Object.keys(data[0]).map((key: string, idx: number) => {
                const modelKey: any = key
                // console.log('분류모델 modelKey', modelKey)
                return (
                  <PerformanceContentsBox key={modelKey}>
                    <InfoCircle content={errorInfo[modelKey]} />
                    <PerformanceValueAccuracy>{data[idx][modelKey]}</PerformanceValueAccuracy>
                  </PerformanceContentsBox>
                )
              })}
            </PerformanceContentsBox>
          </PerformanceContentsWrap>
        ) : (
          <PerformanceContentsWrap>
            {Object.keys(data[0]).map((key, index) => {
              const modelKey = key as keyof PerformanceModel
              const isFirstItem = index === 0
              const boxStyle = isFirstItem
                ? {}
                : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', paddingLeft: '10px' }
              return (
                <PerformanceContentsBox style={boxStyle} key={modelKey}>
                  <div>
                    <PerformanceContents>{modelKey.toString().toUpperCase()}</PerformanceContents>
                    <PerformanceValue>{formatNumber(data[0][modelKey as keyof (typeof data)[0]])}</PerformanceValue>
                  </div>
                </PerformanceContentsBox>
              )
            })}
          </PerformanceContentsWrap>
        )}
        <PerformanceButtonWrap>
          <SaveButton onClick={handleSave}>SAVE</SaveButton>
          <ExportButton onClick={handleReport}>REPORT</ExportButton>
        </PerformanceButtonWrap>
      </ComponentContainer>
    </>
  )
}
export default ModelPerformance

const ComponentContainer = styled.div`
  margin: 5px;
  padding: 20px 30px;
  box-shadow: 0px 0px 20px #0000001a;
  border: 1px solid #d5dcef;
  background-color: #4338f7;
  border-radius: 18px;
  color: #ffffff;
  font-size: 12px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  background-image: url('path/to/your/image.png');
  background-size: cover;
  background-position: center;
`
const PerformanceTitle = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-weight: bold;
  // margin-bottom: 7.5px;
  font-size: 20px;
`
const PerformanceContentsWrap = styled.div`
  display: flex;
  padding-top: 11.5px;
`
const PerformanceContentsBox = styled.div`
  flex: 1;
`
const PerformanceContents = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #fff;
  font-size: 20px;
  padding-right: 10px;
  font-weight: bold;
`
const PerformanceModelValue = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-size: 25px;
  font-weight: bold;
`
const PerformanceValueAccuracy = styled.span`
  color: #95eb61;
  font-size: 22px;
  font-weight: bold;
`
const PerformanceValue = styled.div`
  font-weight: bold;
  color: #95eb61;
  font-size: 22px;
`
const PerformanceButtonWrap = styled.div`
  text-align: center;
  display: flex;
  margin-top: 17px;
`
const PerformanceButton = styled.button`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  border-radius: 9px;
  background-color: #e5ebff;
  color: #4338f7;
  font-size: 13px;
  height: 40px;
  line-height: 40px;
  flex: 1;
  font-weight: bold;
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
