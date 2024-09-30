import { App } from 'antd'
import { PerformanceModel } from 'apis/type/ModelPerformanceOption'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
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
    message.info('10월 서비스 준비 중입니다.')
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
              <PerformanceContents>
                <InfoCircle content={errorInfo.ACCURACY} styleClass="text-[#F2F5FC]" />
                {t('Prediction Accuracy')}
              </PerformanceContents>
              <PerformanceModelValue>{(Number(data[0]['ACCURACY']) * 100).toFixed(0)} %</PerformanceModelValue>
            </PerformanceContentsBox>
            <PerformanceContentsBox>
              <PerformanceContents>
                <InfoCircle content={errorInfo.F1_SCORE} styleClass="text-[#F2F5FC]" />
                F-SCORE
              </PerformanceContents>
              <PerformanceContentsBox>
                <PerformanceValueAccuracy>{Number(data[0]['F1_SCORE']).toFixed(2)}</PerformanceValueAccuracy>
              </PerformanceContentsBox>
            </PerformanceContentsBox>
          </PerformanceContentsWrap>
        ) : (
          <PerformanceContentsWrap>
            {Object.keys(data[0]).map((key, index) => {
              const modelKey = key as keyof PerformanceModel
              const isFirstItem = index === 0
              const boxStyle = isFirstItem ? {} : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', padding: '0 5px' }
              return (
                <PerformanceContentsBox style={boxStyle} key={modelKey}>
                  <div>
                    <PerformanceContents>
                      <div>{modelKey.toString().toUpperCase()}</div>
                      <div className="text-center">
                        <InfoCircle content={errorInfo[modelKey]} styleClass="text-[#F2F5FC]" />
                      </div>
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
  font-size: 20px;
`
const PerformanceContentsWrap = styled.div`
  display: flex;
  padding-top: 11.5px;
  text-align: center;
`
const PerformanceContentsBox = styled.span`
  flex: 1;
`
const PerformanceContents = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  // margin-right: 10px;
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
