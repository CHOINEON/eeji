import { App } from 'antd'
import { PerformanceModelType } from 'apis/type/ModelPerformanceOption'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { filteredResultState } from 'views/AIModelGenerator/store/response/atoms'

interface IErrorInfo {
  [key: string]: string
}

const ModelPerformance = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const selectedModel = useRecoilValue(selectedModelAtom)
  const data = useRecoilValue(filteredResultState('error'))
  const [errorData, setErrorData] = useState<PerformanceModelType>()

  const errorInfo: IErrorInfo = {
    mae: t('errors.MAE'),
    mse: t('errors.MSE'),
    rmse: t('errors.RMSE'),
    r2: t('errors.R2'),
    mape: t('errors.MAPE'),
    F1_SCORE: t('performance.F1_SCORE'),
    ACCURACY: t('performance.ACCURACY'),
  }

  const handleReport = () => {
    message.info(t('서비스 준비 중입니다.'))
  }

  useEffect(() => {
    //2024.10.10 수정 전 버전의 텍스트 길이 지원을 위한 임시 처리(추후 삭제)
    setErrorData({
      ...errorData,
      mae: typeof data[0]['mae'] === 'number' ? formatNumber(Number(data[0]['mae']).toFixed(2)) : data[0]['mae'],
      mse: typeof data[0]['mse'] === 'number' ? formatNumber(Number(data[0]['mse']).toFixed(2)) : data[0]['mse'],
      rmse: typeof data[0]['rmse'] === 'number' ? formatNumber(Number(data[0]['rmse']).toFixed(2)) : data[0]['rmse'],
      r2: typeof data[0]['r2'] === 'number' ? formatNumber(Number(data[0]['r2']).toFixed(2)) : data[0]['r2'],
      mape: typeof data[0]['mape'] === 'number' ? Number(data[0]['mape']).toFixed(2) : data[0]['rmse'],
      f1_score: typeof data[0]['F1_SCORE'] === 'number' ? Number(data[0]['F1_SCORE']).toFixed(2) : data[0]['F1_SCORE'],
      accuracy: typeof data[0]['ACCURACY'] === 'number' ? Number(data[0]['ACCURACY']).toFixed(2) : data[0]['ACCURACY'],
    })
  }, [data])

  // 24.10.07 데이터 자릿수 엔진에서 잘라주기로 함
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
          <PerformanceTitle>{t('Model Performance')}</PerformanceTitle>
          <div>
            <img src={IcoPerformance} alt="Performance Icon" />
          </div>
        </PerformanceTitleImgWrap>

        <div>
          {selectedModel.name} {t('is trained by optimized EEJI model')}
        </div>
        {selectedModel.is_classification ? (
          <PerformanceContentsWrap>
            <PerformanceContentsBox>
              <PerformanceContents className="text-[15px]">
                <InfoCircle content={errorInfo.ACCURACY} styleClass="text-[#F2F5FC]" />
                {t('Prediction Accuracy')}
              </PerformanceContents>
              <PerformanceModelValue>{errorData?.['accuracy']}</PerformanceModelValue>
            </PerformanceContentsBox>
            <PerformanceContentsBox>
              <PerformanceContents className="text-[15px]">
                <InfoCircle content={errorInfo.F1_SCORE} styleClass="text-[#F2F5FC]" />
                F-SCORE
              </PerformanceContents>
              <PerformanceContentsBox>
                <PerformanceValueAccuracy>{errorData?.['f1_score']}</PerformanceValueAccuracy>
              </PerformanceContentsBox>
            </PerformanceContentsBox>
          </PerformanceContentsWrap>
        ) : (
          <PerformanceContentsWrap>
            {errorData &&
              Object.keys(errorData)
                .filter((key) => errorData[key as keyof typeof errorData] !== undefined)
                .map((key, index) => {
                  const modelKey = key as keyof typeof errorData
                  const isFirstItem = index === 0
                  const boxStyle = isFirstItem
                    ? {}
                    : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', padding: '0 5px' }

                  return (
                    <PerformanceContentsBox style={boxStyle} key={modelKey}>
                      <div>
                        <PerformanceContents className="text-[10px]">
                          <span>{modelKey.toString().toUpperCase()}</span>
                          <span>
                            <InfoCircle content={errorInfo?.[modelKey]} styleClass="text-[#F2F5FC]" />
                          </span>
                        </PerformanceContents>
                        <PerformanceValue>{errorData?.[modelKey as keyof typeof errorData]}</PerformanceValue>
                      </div>
                    </PerformanceContentsBox>
                  )
                })}
          </PerformanceContentsWrap>
        )}
        <PerformanceButtonWrap>
          {/* <SaveButton onClick={handleSave}>SAVE</SaveButton> */}
          <ExportButton onClick={handleReport}>{t('report')}</ExportButton>
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
  font-size: 19px;
`
const PerformanceContentsWrap = styled.div`
  display: flex;
  padding-top: 11.5px;
  text-align: center;
`
const PerformanceContentsBox = styled.span`
  flex: 1;
`
const PerformanceContents = styled.div`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #fff;
  font-weight: bold;
`
const PerformanceModelValue = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-size: 21px;
  font-weight: bold;
`
const PerformanceValueAccuracy = styled.span`
  color: #95eb61;
  font-size: 19px;
  font-weight: bold;
`
const PerformanceValue = styled.div`
  font-weight: bold;
  color: #95eb61;
  font-size: 19px;
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
const ExportButton = styled(PerformanceButton)`
  margin-left: 5px;
`
const PerformanceTitleImgWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`
