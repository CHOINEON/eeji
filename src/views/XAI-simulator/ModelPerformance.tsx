import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { dataPropertyState } from 'views/AIModelGenerator/store/dataset/atom'
import styled from 'styled-components'
import { useMutation } from 'react-query'
import ModelPerformanceApi from 'apis/ModelPerformanceApi'
import { ModelStore } from './store/analyze/ModelStore'
import { ModelPostReq } from 'apis/type/ModelPerformanceOption'

//1. post 버전

// const DataImportModal22: React.FC<any> = (props) => {
const ModelPerformance = () => {
  const [customModel, setCustomModel] = useRecoilState(ModelStore)
  const dataProperty = useRecoilValue(dataPropertyState)
  //0이거나 1이거나 해당하는 데이터 받아오기

  const { mutate: mutatePerformance } = useMutation(ModelPerformanceApi.postModelwithOption, {
    onSuccess: (response) => {
      setCustomModel((prevState) => ({
        ...prevState,
        mae: response.mae,
        mse: response.mse,
        rsme: response.rsme,
      }))
    },
    onError: (error) => {
      console.error(error)
    },
  })
  useEffect(() => {
    if (dataProperty.algo_type === 1 || dataProperty.algo_type === 0) {
      const controller = new AbortController()
      const mutationParams: ModelPostReq = {
        type: dataProperty.algo_type.toString(),
        payload: {
          user_id: 'exampleUserId',
          data: 'exampleData',
        },
        controller,
      }
      mutatePerformance(mutationParams)

      return () => controller.abort()
    }
  }, [dataProperty.algo_type, mutatePerformance])

  // useEffect(() => {
  //   if (dataProperty.algo_type === 1 || dataProperty.algo_type === 0) {
  //     const controller = new AbortController()
  //     const { signal } = controller
  //     const mutationParams = {
  //       type: dataProperty.algo_type.toString(),
  //       payload: {
  //         user_id: 'exampleUserId',
  //         data: 'exampleData',
  //       },
  //       controller: { signal },
  //     }
  //     mutatePerformance(mutationParams)

  //     return () => controller.abort()
  //   }
  // }, [dataProperty.algo_type, mutatePerformance])

  return (
    <>
      {dataProperty.algo_type === 1 ? (
        <div>
          <ComponentContainer>
            <BannerTitle>모델 성능</BannerTitle>
            <div>Ineeji-sensor-2024.00.00.csv의 데이터를 분석했습니다.</div>
            <BannerContentsWrap>
              <BannerContentsBox>
                <BannerContents>AI 모델</BannerContents>
                <BannerContentsPrice>XAI</BannerContentsPrice>
              </BannerContentsBox>
              <BannerContentsBox>
                <BannerContents>AI 모델 정확도</BannerContents>
                <ContentsMAE> {customModel.modelaccuracy}</ContentsMAE>
              </BannerContentsBox>
            </BannerContentsWrap>
            <ButtonWrap>
              <BannerButton>SAVE</BannerButton>
              <BannerButton>REPORT</BannerButton>
            </ButtonWrap>
          </ComponentContainer>
          <ComponentContainer>
            <BannerTitle>모델 성능</BannerTitle>
            <div>Ineeji-sensor-2024.00.00.csv의 데이터를 분석했습니다.</div>
            <BannerContentsWrap>
              <BannerContentsBox>
                <BannerContents>MAE</BannerContents>
                <ContentsMAE> {customModel.mae}</ContentsMAE>
              </BannerContentsBox>
              <BannerContentsBox>
                <BannerContents>MSE</BannerContents>
                <ContentsMAE> {customModel.mse}</ContentsMAE>
              </BannerContentsBox>
              <BannerContentsBox>
                <BannerContents>RMSE</BannerContents>
                <ContentsMAE> {customModel.rmse}</ContentsMAE>
              </BannerContentsBox>
            </BannerContentsWrap>
          </ComponentContainer>
        </div>
      ) : (
        <div>
          <ComponentContainer>
            <BannerTitle>모델 성능</BannerTitle>
            <div>Ineeji-sensor-2024.00.00.csv의 데이터를 분석했습니다.</div>
            <strong>MAE</strong>
            <strong>MSE</strong>
            <strong>RMSE</strong>
          </ComponentContainer>
        </div>
      )}
    </>
  )
}
export default ModelPerformance

const ContentsMAE = styled.div`
  color: #95eb61;
  font-size: 30px;
`
const ButtonWrap = styled.div`
  text-align: center;
`
const BannerButton = styled.button`
  border-radius: 9px;
  background-color: #e5ebff;
  color: #4338f7;
  font-size: 17px;
  padding: 13px 60px 12px 59px;
  font-weight: bold;
`
const BannerContentsBox = styled.div`
  flex: 1;
`
// const BannerContentsBox = styled.div<BannerContentsBoxProps>`
//   flex: 1;
//   ${(props) => props.borderLeft && 'border-left: 1px solid red;'}
// `
const BannerContentsWrap = styled.div`
  display: flex;
`
const BannerContentsPrice = styled.span`
  padding-left: 10px;
  color: #95eb61;
  font-size: 33px;
`
const BannerContents = styled.span`
  color: #fff;
  font-size: 21px;
`
const BannerTitle = styled.p`
  color: #95eb61;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 3px;
  font-size: 26px;
`
const ComponentContainer = styled.div`
  height: 158px;
  padding: 26px 28px;
  box-shadow: 0px 0px 20px #0000001a;
  border: 1px solid #d5dcef;
  background-color: #4338f7;
  border-radius: 18px;
  color: #ffffff;
  font-size: 15px;
  font-face: 'Helvetica Neue';
`
