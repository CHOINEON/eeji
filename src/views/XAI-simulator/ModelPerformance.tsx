import { App } from 'antd'
import { PerformanceModel } from 'apis/type/ModelPerformanceOption'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { filteredResultState } from 'views/AIModelGenerator/store/response/atoms'

interface IErrorInfo {
  [key: string]: string
}

const errorInfo: IErrorInfo = {
  MAE: '평균절대오차. 모든 오차 절대값의 합을 평균. (0에 가까울 수록 좋은 모델)',
  MSE: '평균제곱오차. 오차를 제곱한 값의 평균. (알고리즘이 예측한 값과 실제 정답과의 차이)',
  RMSE: '평균 제곱근 오차. 예측 모델에서 예측한 값과 실제 값 사이의 평균 차이. 예측 모델이 목표 값(정확도)를 얼마나 잘 예측할 수 있는지 추정.',
  F1_SCORE: '정확성과 재현율을 균형있게 평가하는 성능 지표. (0~1 사이의 값을 가지며, 높을 수록 좋음)',
  ACCURACY: '분류 모델이 얼마나 정확하게 분류했는지 평가하는 지표.',
}

const ModelPerformance = () => {
  const { message } = App.useApp()

  const selectedModel = useRecoilValue(selectedModelAtom)
  const data = useRecoilValue(filteredResultState('error'))

  const handleReport = () => {
    message.info('9월 서비스 준비 중입니다.')
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

        <div>{selectedModel.name} 데이터로 학습을 진행한 결과입니다.</div>
        {selectedModel.is_classification ? (
          <PerformanceContentsWrap>
            <PerformanceContentsBox>
              <PerformanceContents>예측 정확도</PerformanceContents>
              <PerformanceModelValue>{(Number(data[0]['ACCURACY']) * 100).toFixed(0)} %</PerformanceModelValue>
            </PerformanceContentsBox>
            <PerformanceContentsBox>
              <PerformanceContents>
                <InfoCircle content={errorInfo.F1_SCORE} color="#F2F5FC" />
                F-SCORE
              </PerformanceContents>
              <PerformanceContentsBox>
                <PerformanceValueAccuracy>{Number(data[0]['F1_SCORE']).toFixed(2)}</PerformanceValueAccuracy>
              </PerformanceContentsBox>
            </PerformanceContentsBox>
          </PerformanceContentsWrap>
        ) : (
          <PerformanceContentsWrap>
            {Object.keys(data[0])
              // .filter((item) => ['ACCURACY', 'F1_SCORE'].includes(item))
              .map((key, index) => {
                const modelKey = key as keyof PerformanceModel
                const isFirstItem = index === 0
                const boxStyle = isFirstItem
                  ? {}
                  : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', paddingLeft: '10px' }
                return (
                  <PerformanceContentsBox style={boxStyle} key={modelKey}>
                    <div>
                      <PerformanceContents>
                        {modelKey.toString().toUpperCase()}
                        <InfoCircle content={errorInfo[modelKey]} color="#F2F5FC" />
                      </PerformanceContents>
                      <PerformanceValue>{formatNumber(data[0][modelKey as keyof (typeof data)[0]])}</PerformanceValue>
                    </div>
                  </PerformanceContentsBox>
                )
              })}
          </PerformanceContentsWrap>
        )}
        <PerformanceButtonWrap>
          {/* <SaveButton onClick={handleSave}>SAVE</SaveButton> */}
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
const PerformanceContentsBox = styled.span`
  flex: 1;
`
const PerformanceContents = styled.span`
  // display: inline-block;
  // float: left;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #fff;
  font-size: 18px;
  // padding-right: 10px;
  font-weight: bold;
  margin-right: 10px;
`
const PerformanceModelValue = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-size: 25px;
  font-weight: bold;
`
const PerformanceValueAccuracy = styled.span`
  color: #95eb61;
  font-size: 25px;
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
