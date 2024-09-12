import styled from '@emotion/styled'
import { App, Select } from 'antd'
import ModelApi from 'apis/ModelApi'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { featureSelectModalState } from 'views/AIModelGenerator/store/modal/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import { selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import FeatureSelectModal from './components/Modal/FeatureSelectModal'
import { stepCountStore } from './store/global/atom'
import { selectedModelAtom } from './store/model/atom'
import ClassificationResult from './Visualization/Data/ClassificationResult'
import RegressionResult from './Visualization/Data/RegressionResult'

const ModelGeneratorResult = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const [options, setOptions] = useState([])
  const [selectedFeatureX, setSelectedFeatureX] = useState([])

  const selectedModel = useRecoilValue(selectedModelAtom)
  const selectedData = useRecoilValue(selectedDataState)
  const resetSelectedData = useResetRecoilState(selectedDataState)

  const setActiveStep = useSetRecoilState(stepCountStore)
  const setModelIdx = useSetRecoilState(selectModelState)
  const setModalState = useSetRecoilState(featureSelectModalState)

  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      // 한 번에 한 개의 요청만 처리하도록 변경하여, 서버 응답메시지를 사용자에게 표출함(2024-04-29)
      if (result?.detail) {
        message.warning({ content: result.detail, style: { marginTop: '5vh' } }).then(() => setActiveStep(0))
      } else {
        setAnalysisResponse([
          ...analysisResponse,
          {
            pred_data: JSON.parse(result['prediction_data']),
            feature_data: result['feature_piechart_data'],
            input: result['selected_input'],
            error: result['metrics'],
            row_data: result['result_table'],
            performance: result['peformance_table'],
            uuid: result['get_uuid'],
            classes: result['classes'],
          },
        ])

        setSelectedFeatureX(result['selected_input'])
      }
    },
    onError: (error: any) => {
      if (error.message === 'canceled') {
        message.warning('request canceled')
      } else {
        message.warning(error.message)
      }
    },
  })

  useEffect(() => {
    if (analysisResponse.length > 0) {
      const newOption: Array<any> = []
      analysisResponse.map((value: any, index: number) => {
        newOption.push({ value: index, label: index === 0 ? 'INEEJI Pred' : `Prediction ${index}` })
      })

      setOptions(newOption)
    }
  }, [analysisResponse])

  // TODO : 위치 잡고 기능 다시 살려놓기
  // const handleRegenerate = () => {
  //   setModalState(true)
  // }

  const handleChange = (value: string) => {
    setModelIdx(parseInt(value))
  }

  const handleGenerate = () => {
    //
  }

  return (
    <>
      <ComponentContainer>
        <div className="mt-[30px] ml-[30px] w-[63%] h-[47px]">
          <div className="block float-left mr-[30px]">
            <Title>
              <Trans i18nKey="Prediction Results of" values={{ target_var: selectedModel.target }}>
                Prediction Results of {selectedModel.target}
              </Trans>
            </Title>
            <InfoCircle content={t('Prediction Results of the Model')} />
          </div>
          <div className="ml-3">
            {options.length > 1 && (
              <>
                <span className="ml-4">모델 선택 :</span>
                <Select
                  style={{ width: 120, margin: 8 }}
                  options={options}
                  onChange={handleChange}
                  defaultValue={options[0]?.value}
                />
              </>
            )}
          </div>
          <p className="w-full block float-left font-semibold text-[18px] text-[#A3AFCF]">{selectedData.name}</p>
        </div>
        {analysisResponse.length > 0 &&
          (selectedModel.is_classification ? <ClassificationResult /> : <RegressionResult />)}
        <FeatureSelectModal data={selectedFeatureX} onRunning={handleGenerate} />
      </ComponentContainer>
    </>
  )
}

export default ModelGeneratorResult

const Title = styled.span`
  display: block;
  float: left;
  font-size: 30px;
  color: #002d65;
  font-weight: bolder;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

const ButtonSave = styled.button`
  display: block;
  float: left;
  margin-top: 7px;
  width: 140px;
  height: 34px;
  border-radius: 17px;
  background-color: #4338f7;
  color: #fff;
  font-weight: bolder;
`
const ComponentContainer = styled.div`
  display: block;
  float: left;
  justify-content: space-evenly;
  background-color: #ffffff;
  min-height: 800px;
  height: 100%;
  width: 100%;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  // border: 1px solid red;
  border-radius: 25px;
  opacity: 1;
`
