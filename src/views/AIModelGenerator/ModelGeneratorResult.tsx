import styled from '@emotion/styled'
import { ThemeProvider } from '@mui/material/styles'
import { App, Select } from 'antd'
import ModelApi from 'apis/ModelApi'
import { useGetModelList } from 'hooks/queries/useGetModelList'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { validationCheck } from 'utils/DateFunction'
import { v4 } from 'uuid'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { loadingAtom } from 'views/AIModelGenerator/store/global/atom'
import { featureSelectModalState } from 'views/AIModelGenerator/store/modal/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import { selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import FeatureSelectModal from './components/Modal/FeatureSelectModal'
import { stepCountStore } from './store/global/atom'
import { selectedModelAtom } from './store/model/atom'
import { theme } from './theme/theme'
import ClassificationResult from './Visualization/Data/ClassificationResult'
import RegressionResult from './Visualization/Data/RegressionResult'

const ModelGeneratorResult = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const [options, setOptions] = useState([])
  const [selectedFeatureX, setSelectedFeatureX] = useState([])

  const selectedModel = useRecoilValue(selectedModelAtom)
  const setSelectedModel = useSetRecoilState(selectedModelAtom)

  const selectedData = useRecoilValue(selectedDataState)
  const resetSelectedData = useResetRecoilState(selectedDataState)

  const setActiveStep = useSetRecoilState(stepCountStore)
  const setModelIdx = useSetRecoilState(selectModelState)
  const setModalState = useSetRecoilState(featureSelectModalState)
  const setAnalysisResult = useSetRecoilState(analysisResponseAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const MAX_DATA_COUNT = 5000

  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)

  const { id } = useParams<{ id: string }>()
  const userid = localStorage.getItem('userId')

  const { data } = useGetModelList(userid)

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

  const downloadData = async (url: string) => {
    try {
      const result = await ModelApi.getJsonResult(url)

      // (24-08-29) 끝에서 5000개만 그리도록 수정
      function sliceResultObj(obj: any, num: number) {
        // 객체의 키들을 배열로 변환
        const keys = Object.keys(obj)
        // 마지막 5000개의 키 추출
        const last5000Keys = keys.slice(-num)

        // 마지막 10개의 키-값 쌍으로 새 객체 생성
        const last5000Obj = last5000Keys.reduce((result: any, key: string) => {
          result[key] = obj[key]
          return result
        }, {})

        return last5000Obj
      }

      function sliceResultArr(obj: { pred: Array<unknown>; truth: Array<unknown> }, num: number) {
        return { pred: obj['pred'].slice(-num), truth: obj['truth'].slice(-num) }
      }

      setAnalysisResult([
        {
          key: v4(),
          pred_data:
            result['prediction_data']['pred'].length > MAX_DATA_COUNT
              ? sliceResultArr(result['prediction_data'], MAX_DATA_COUNT)
              : result['prediction_data'],
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
          row_data:
            Object.keys(result['result_table']).length > MAX_DATA_COUNT
              ? sliceResultObj(result['result_table'], MAX_DATA_COUNT)
              : result['result_table'],
          metrics: result['metrics'],
          performance: result['peformance_table'],
          uuid: result['get_uuid'],
          classes: Boolean(result['isClassification']) ? result['classes'] : null,
        },
      ])
      setActiveStep(1)
      setLoading(false)
    } catch (error) {
      console.error(error)
      message.error(t('Sorry. This request has expired.'))
    }
  }

  // TODO: common block refactoring 필요. ModelLisTable 에서 copy.
  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // GCS에서 받아온 만료시간이 GMT으로 설정되어 있어 한국 시간대(GMT + 9)로 변경하여 확인함
      if (validationCheck(result.expiration, 9)) downloadData(result.signed_url)
      else message.error(t('Sorry. This request has expired.'))
    },
    onError: () => {
      message.error(t('The result is not available. Please contact the administrator.'))
    },
  })

  useEffect(() => {
    if (id !== null && data) {
      const dataArray = Array.isArray(data) ? data : []
      const foundItem = dataArray.find((item) => item.id === id)

      if (foundItem) {
        setSelectedModel(foundItem)
      }
      // console.log(foundItem)
      mutateTrainingResult({ model_id: id, is_xai: 'false' })
    }
  }, [id, data])

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

  // TODO: common block으로 refactoring
  return (
    <>
      {id ? (
        <ThemeProvider theme={theme}>
          <div className="relative z-[1000]">
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
          </div>
        </ThemeProvider>
      ) : (
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
      )}
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

const ComponentContainer = styled.div`
  display: block;
  float: left;
  justify-content: space-evenly;
  background-color: #ffffff;
  width: 100%;
  height: 100vh;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  opacity: 1;
`
