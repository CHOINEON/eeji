import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import PredictionResult from 'views/DataAnalysis/PredictionResult'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { selectedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { inputOptionListState } from 'views/DataAnalysis/store/userOption/atom'
import ModelApi from 'apis/ModelApi'
import InfoCircle from 'views/DataAnalysis/components/Icon/InfoCircle'
import FeatureAnalysis from './FeatureAnalysis'
import FeatureSelectModal from './FeatureSelectModal'
import { featureSelectModalState } from 'views/DataAnalysis/store/modal/atom'
import { v4 } from 'uuid'
import { analysisResponseAtom } from 'views/DataAnalysis/store/response/atoms'
import { Spin } from 'antd'
import tempData from './classificationData.json'

const TabChild = () => {
  const [loading, setLoading] = useState({ showing: false, text: '데이터 분석 중...' })

  const selectedData = useRecoilValue(selectedDataState)
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const resetSelectedData = useResetRecoilState(selectedDataState)

  const [modalState, setModalState] = useRecoilState(featureSelectModalState)
  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)
  const [featureImportanceData, setFeatureImportanceData] = useState([])
  // const [predictionData, setPredictionData] = useState({})
  const [selectedFeatureX, setSelectedFeatureX] = useState([])

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      console.log('mutate result:', result)
      setLoading({ showing: false, text: '' })

      setAnalysisResponse([
        ...analysisResponse,
        {
          key: v4(),
          pred_data: JSON.parse(result['prediction_data']),
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
        },
      ])

      setFeatureImportanceData(result['feature_piechart_data'])
      // setPredictionData(JSON.parse(result['prediction_data']))
      setSelectedFeatureX(result['selected_input'])

      // formatterForBestPlot(result['best_plot'])
      // formattingTableData(JSON.parse(result['sorted_results_df']))

      // setPreprocessingData(result['preprocessing_graphs'])
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
    // console.log('selectedData:', selectedData)
    //임시 데이터로 처리
    // setAnalysisResponse([
    //   ...analysisResponse,
    //   {
    //     key: v4(),
    //     pred_data: JSON.parse(tempData['prediction_data']),
    //     feature_data: tempData['feature_piechart_data'],
    //     input: tempData['selected_input'],
    //     error: tempData['metrics'],
    //   },
    // ])
    // setFeatureImportanceData(data['feature_piechart_data'])
    // setPredictionData(data['prediction_data'])
    // setSelectedFeatureX(data['selected_input'])

    //0109 false
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

      //주석함(0109)
      mutateRunning({ type: 'request', payload, controller })
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

  return (
    <>
      <Spin tip={loading.text} spinning={loading.showing} style={{ marginTop: '100px' }}>
        <ComponentContainer>
          <div className="mt-[30px] ml-[30px] w-full h-[47px]">
            <div className="block float-left mr-[30px]">
              <Title>Prediction Result of {selectedData.targetY}</Title>
              <InfoCircle content="모델의 예측 결과" />
            </div>
            {analysisResponse && analysisResponse.length > 0 && (
              <ButtonSave onClick={handleRegenerate}>사용자 모델 재생성</ButtonSave>
            )}
            <p className="w-full block float-left font-semibold text-[18px] text-[#A3AFCF]">{selectedData.name}</p>
          </div>

          {analysisResponse && analysisResponse.length > 0 && (
            <>
              {/* <Spin tip="예측 모델 생성중..." spinning={loading}> */}
              <div
                style={{
                  // border: '1px solid red',
                  width: '63%',
                  margin: '30px',
                  display: 'block',
                  float: 'left',
                  // padding: '20px',
                }}
              >
                <PredictionResult />
              </div>
              <div style={{ width: '30%', margin: '25px 0', display: 'block', float: 'left' }}>
                <FeatureAnalysis />
              </div>
              {/* </Spin> */}
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
  justify-content: space-evenly;
  background-color: #ffffff;
  height: 800px;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  // border: 1px solid red;
  border-radius: 25px;
  opacity: 1;
`
