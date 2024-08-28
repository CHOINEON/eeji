import styled from '@emotion/styled'
import useResizeObserver from 'hooks/useResizeObserver'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import { selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'
import ModelPerformance from 'views/XAI-simulator/ModelPerformance'
import FeatureClassPerformance from './FeatureClassPerformance'

const FeatureAnalysis = ({ textVisible }: any) => {
  const { t } = useTranslation()
  const contentRef = useRef(null)
  const [isShowReadMore, setIsShowReadMore] = useState(false)

  const [chartData, setChartData] = useState({ labels: [], values: [] })
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const modelIdx = useRecoilValue(selectModelState)

  const observeCallback = (entries: any) => {
    for (const entry of entries) {
      if (entry.target.scrollHeight > Math.round(entry.contentRect.height)) {
        setIsShowReadMore(true)
      } else {
        setIsShowReadMore(false)
      }
    }
  }
  useResizeObserver({ callback: observeCallback, element: contentRef })

  useEffect(() => {
    setChartData(analysisResponse[modelIdx]['feature_data'])
  }, [modelIdx])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    contentRef.current.classList.add('show')
    setIsShowReadMore(false)
  }

  return (
    <>
      <ModelPerformance />
      {analysisResponse[modelIdx].classes && <FeatureClassPerformance />}
      <ComponentContainer textVisible={textVisible}>
        <SubTitle>
          {t('Feature Importance')}
          <InfoCircle
            content={t('The higher the feature importance, the greater its impact on the prediction model.')}
          />
        </SubTitle>
        <div className={textVisible ? 'block' : 'hidden'}>
          <div className="block float-left w-100 mt-2">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              <Trans
                i18nKey="The most influential variable in the current AI prediction model is"
                values={{ var: chartData?.labels[0] }}
              >
                The most influential variable in the current AI prediction model is{' '}
                <strong>{chartData?.labels[0]} </strong>.
              </Trans>
            </AITextContainer>
          </div>
          <div className="block float-left w-100">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              <Ellipsis ref={contentRef}>
                <Trans
                  i18nKey="The input variables selected by AI are"
                  values={{ var: analysisResponse[modelIdx]?.input?.join(', ') }}
                >
                  The input variables selected by AI are{' '}
                  <strong>{analysisResponse[modelIdx]?.input?.join(', ')}</strong>
                </Trans>
              </Ellipsis>
              {isShowReadMore && <MoreButton onClick={handleClick}>{t('...more')}</MoreButton>}
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
  margin-bottom: 5px;
`

const Ellipsis = styled.div`
  position: relative;
  display: -webkit-box;
  max-height: 3rem;
  overflow: hidden;
  -webkit-line-clamp: 2;
  &.show {
    display: block;
    max-height: fit-content;
    overflow: auto;
    -webkit-line-clamp: unset;
  }
`

const MoreButton = styled.button`
  max-height: 2rem;
  line-height: 2rem;
  &.hide {
    display: none;
  }
`
