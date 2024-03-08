import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import PredictionResult from 'views/AIModelGenerator/PredictionResult'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { inputOptionListState, selectModelState } from 'views/AIModelGenerator/store/userOption/atom'
import InfoCircle from 'views/AIModelGenerator/components/Icon/InfoCircle'
import FeatureAnalysis from './FeatureAnalysis'
import FeatureSelectModal from './FeatureSelectModal'
import { featureSelectModalState } from 'views/AIModelGenerator/store/modal/atom'
import { analysisResponseAtom, filteredResultState } from 'views/AIModelGenerator/store/response/atoms'
import { Select, Spin } from 'antd'
import ModelApi from 'apis/ModelApi'

const TabChild = () => {
  const [loading, setLoading] = useState({ showing: false, text: '데이터 분석 중...' })
  const [options, setOptions] = useState([])
  // const newdata = useRecoilValue(filteredResultState('feature_piechart_data'))

  const [modelIdx, setModelIdx] = useRecoilState(selectModelState)

  const selectedData = useRecoilValue(selectedDataState)
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const resetSelectedData = useResetRecoilState(selectedDataState)

  const [modalState, setModalState] = useRecoilState(featureSelectModalState)
  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)
  const [selectedFeatureX, setSelectedFeatureX] = useState([])

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      console.log('mutate result:', result)
      setLoading({ showing: false, text: '' })

      setAnalysisResponse([
        ...analysisResponse,
        {
          pred_data: JSON.parse(result['prediction_data']),
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
          uuid: result['get_uuid'],
        },
      ])

      // setFeatureImportanceData(result['feature_piechart_data'])
      setSelectedFeatureX(result['selected_input'])
    },
    onError: (error: any) => {
      setLoading({ showing: false, text: '' })

      if (error.message === 'canceled') {
        alert('request canceled')
      } else {
        alert(error.message)
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

  useEffect(() => {
    setLoading({ showing: true, text: '데이터 분석 중...' })

    //Dataset list 컴포넌트 로드될 때 chaining effect 차단하기 위해 분기 처리
    if (selectedData.name !== '') {
      const payload = {
        set_auto: true,
        user_id: localStorage.getItem('userId'),
        com_id: localStorage.getItem('companyId'),
        dataset_id: selectedData.ds_id,
        date_col: selectedData.dateCol,
        start_date: selectedData.startDate,
        end_date: selectedData.endDate,
        x_value: userInputOption.x_value || null,
        y_value: selectedData.targetY || '',
        type_missing: userInputOption.type_missing,
        number_missing: userInputOption.number_missing,
        type_outlier: userInputOption.type_outlier,
        number_std: userInputOption.number_std,
        number_perc: userInputOption.number_perc,
        type_scaling: userInputOption.type_scaling,
        number_ma: userInputOption.number_ma,
        type_model: userInputOption.type_model,
        number_epoch: userInputOption.number_epoch,
        number_beyssian: userInputOption.number_beyssian,
        if_classification: selectedData.isClassification,
      }
      const controller = new AbortController()
      // setController(controller)
      // console.log('tab child / payload:', payload)

      mutateRunning({ type: 'request', payload: payload })
    }

    return () => {
      resetSelectedData()
    }
  }, [selectedData])

  const handleRegenerate = () => {
    // selectedFeatureX
    setModalState(true)
  }

  const handleGenerate = (param: any) => {
    // console.log('handleGenerate:', param)
    setLoading({ showing: param, text: '사용자 모델 생성 중...' })
  }

  const handleChange = (value: string) => {
    setModelIdx(parseInt(value))
  }
  return (
    <>
      <Spin tip={loading.text} spinning={loading.showing} style={{ marginTop: '300px' }}>
        <ComponentContainer>
          <div className="mt-[30px] ml-[30px] w-[63%] h-[47px]">
            <div className="block float-left mr-[30px]">
              <Title>Prediction Result of {selectedData.targetY}</Title>
              <InfoCircle content="모델의 예측 결과" />
            </div>
            <div className="ml-3">
              {analysisResponse && analysisResponse.length > 0 && (
                <ButtonSave onClick={handleRegenerate}>사용자 모델 재생성</ButtonSave>
              )}

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

          {analysisResponse && analysisResponse.length > 0 && (
            <>
              <div
                style={{
                  // border: '1px solid red',
                  width: '68%',
                  padding: '5px 30px',
                  display: 'block',
                  float: 'left',
                }}
              >
                <PredictionResult />
              </div>
              <div style={{ width: '30%', marginTop: '-50px', display: 'inline-block', float: 'left' }}>
                <FeatureAnalysis />
              </div>
            </>
          )}
          <FeatureSelectModal data={selectedFeatureX} onRunning={handleGenerate} />
        </ComponentContainer>
      </Spin>
    </>
  )
}

export default TabChild

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
  min-height: 770px;
  height: 100%;
  width: 100%;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  // border: 1px solid red;
  border-radius: 25px;
  opacity: 1;
`
