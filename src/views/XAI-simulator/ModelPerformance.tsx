import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { dataPropertyState } from 'views/AIModelGenerator/store/dataset/atom'
import styled from 'styled-components'
import { useMutation } from 'react-query'
import ModelPerformanceApi from 'apis/ModelPerformanceApi'
import { ModelStore } from './store/analyze/ModelStore'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { PerformanceModel } from 'apis/type/ModelPerformanceOption'

const ModelPerformance = () => {
  const [customModel, setCustomModel] = useRecoilState<PerformanceModel>(ModelStore)
  const dataProperty = useRecoilValue(dataPropertyState)

  const { mutate: mutatePerformance } = useMutation(ModelPerformanceApi, {
    onSuccess: (result: PerformanceModel) => {
      console.log('mutate result202222:', result, typeof result)
      setCustomModel(result)
    },
    onError: (error) => {
      console.error('Error fetching chart data:', error)
    },
  })

  useEffect(() => {
    if (dataProperty.algo_type === 1 || dataProperty.algo_type === 0) {
      const controller = new AbortController()
      const { signal } = controller
      // const queryParams = {
      //   user_id: localStorage.getItem('userId').toString(),
      //   algo_type: dataProperty.algo_type,
      // }

      mutatePerformance({
        user_id: localStorage.getItem('userId'),
        algo_type: dataProperty.algo_type.toString(),
        controller: signal,
      })

      // mutatePerformance({ payload: queryParams, controller: { signal } })
      return () => controller.abort()
    }
  }, [dataProperty.algo_type, mutatePerformance])

  return (
    <>
      {dataProperty.algo_type === 1 ? (
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
              <PerformanceContentsBox>
                <PerformanceContents>AI 모델</PerformanceContents>
                <PerformanceModelValue>XAI</PerformanceModelValue>
              </PerformanceContentsBox>
              <PerformanceContentsBox>
                <PerformanceContents>AI 모델 정확도</PerformanceContents>
                {Object.keys(customModel).map((key) => {
                  const modelKey = key as keyof PerformanceModel
                  console.log('modelKey', modelKey)
                  return (
                    <PerformanceContentsBox>
                      <PerformanceValue>{customModel[modelKey]}</PerformanceValue>
                    </PerformanceContentsBox>
                  )
                })}
              </PerformanceContentsBox>
            </PerformanceContentsWrap>
            <PerformanceButtonWrap>
              <PerformanceButton className="firstButton">SAVE</PerformanceButton>
              <PerformanceButton className="secondButton">REPORT</PerformanceButton>
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
              {Object.keys(customModel).map((key, index) => {
                const modelKey = key as keyof PerformanceModel
                const isFirstItem = index === 0
                const boxStyle = isFirstItem ? {} : { borderLeft: '1px solid red', paddingLeft: '10px' }

                return (
                  <PerformanceContentsBox style={boxStyle}>
                    <div key={modelKey}>
                      <PerformanceContents>{modelKey.toString().toUpperCase()}</PerformanceContents>
                      <PerformanceValue>{customModel[modelKey]}</PerformanceValue>
                    </div>
                  </PerformanceContentsBox>
                )
              })}
            </PerformanceContentsWrap>
            <PerformanceButtonWrap>
              <PerformanceButton className="firstButton">SAVE</PerformanceButton>
              <PerformanceButton className="secondButton">REPORT</PerformanceButton>
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
  &.firstButton {
    margin-right: 5px;
  }
  &.secondButton {
    margin-left: 5px;
  }
`
const PerformanceTitleImgWrap = styled.div`
  display: flex;
  justify-content: space-between;
`
