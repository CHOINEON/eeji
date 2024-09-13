import styled from '@emotion/styled'
import { Trans, useTranslation } from 'react-i18next'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { AITextContainer, AIbutton } from 'views/AIModelGenerator/Visualization/Features/FeatureAnalysis'
import FeatureImportance from 'views/AIModelGenerator/Visualization/Features/FeatureImportance'

const GlobalFeatureImportance = ({ data, colors }: any) => {
  const { t } = useTranslation()

  return (
    <>
      <ComponentContainer>
        <div className="mx-5">
          <Title className="inline-block mb-5">{t('Variable Contribution Stats')}</Title>
          <InfoCircle
            content={t('The impact of each variable on the overall prediction')}
            styleClass="text-[#9E9E9E]"
          />
          <FeatureImportance data={data} colors={colors} />
          <div className="block float-left w-full my-1">
            <AIbutton>AI</AIbutton>
            <AITextContainer>
              <Trans
                i18nKey="The most influential variable in the current AI prediction model is"
                values={{ var: data?.labels[0] }}
              >
                The most influential variable in the current AI prediction model is <strong>{data?.labels[0]}</strong>.
              </Trans>
            </AITextContainer>
          </div>
        </div>
      </ComponentContainer>
    </>
  )
}

export default GlobalFeatureImportance

const ComponentContainer = styled.div`
  border: 1px solid red;
  // width: 470px;
  width: 100%;
  height: 55%;
  margin-top: 2%;
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
