import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRecoilValue, useRecoilState } from 'recoil'
import { dataPropertyState } from 'views/AIModelGenerator/store/dataset/atom'
import styled from 'styled-components'
import { useMutation } from 'react-query'
import { axiosPrivate } from 'apis/axios'
import IcoPerformance from 'assets/img/icons/XAI/icon_perfromanceModel.png'
import { PerformanceModel, PerformanceModelTyeps } from 'apis/type/ModelPerformanceOption'
// type dataType = {
//   fscore: number
//   mae: number
//   mse: number
//   rmse: number
// }
// const data: { [key: string]: string } = {
//   mae: '0.412',
//   mse: '0.512',
//   rmse: '0.714',
//   fscore: '0',
// }
const ModelPerformance = ({ data }: any) => {
  const dataProperty = useRecoilValue(dataPropertyState)
  console.log('current_data:', data)
  const handleSave = () => {
    //mutation()
  }
  const handleReport = () => {
    alert('서비스 준비 중입니다.')
  }
  // 데이터 값이 일정값을 넘을 시 B/M/K로 구분하여 내보내게 설정해놓았습니다.
  const formatNumber = (num: number) => {
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
  // const fetchData = async (payload: any) => {
  //   const config = {
  //     headers: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //     },
  //   }
  //   const { data } = await axiosPrivate.post(`/api/send_data/${payload.user_id}`, payload)
  //   return data
  // }
  // const { mutate } = useMutation(fetchData, {
  //   onSuccess: (response: any) => {},
  //   onError: (error: any, query: any) => {
  //     // console.error(error)
  //   },
  // })
  return (
    <>
      <ComponentContainer>
        <PerformanceTitleImgWrap>
          <PerformanceTitle>모델 성능(classification)</PerformanceTitle>
          <div>
            <img src={IcoPerformance} alt="Performance Icon" />
          </div>
        </PerformanceTitleImgWrap>
        {/* 미라님 파일명은 임의로 전송된 데이터라고 변경해놓았습니다. 여기에다가 props값을 넣으시면 될거같아요 */}
        {/* <div>`${전송된데이터}의 데이터를 분석했습니다.`</div> */}
        <div>Ineeji-sensor-2024.00.00.csv의 데이터를 분석했습니다.</div>
        {dataProperty.algo_type === 1 ? (
          <PerformanceContentsWrap>
            <PerformanceContentsBox>
              <PerformanceContents>AI 모델</PerformanceContents>
              <PerformanceModelValue>INEEJI_1</PerformanceModelValue>
            </PerformanceContentsBox>
            <PerformanceContentsBox>
              <PerformanceContents>AI 모델 정확도</PerformanceContents>
              {Object.keys(data).map((key: string) => {
                const modelKey = key as keyof PerformanceModel
                console.log('modelKey', modelKey)
                return (
                  <PerformanceContentsBox>
                    <PerformanceValueAccuracy>{data[modelKey].toFixed(1)}%</PerformanceValueAccuracy>
                  </PerformanceContentsBox>
                )
              })}
            </PerformanceContentsBox>
          </PerformanceContentsWrap>
        ) : (
          <PerformanceContentsWrap>
            {Object.keys(data).map((key, index) => {
              const modelKey = key as keyof PerformanceModel
              const isFirstItem = index === 0
              const boxStyle = isFirstItem
                ? {}
                : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', paddingLeft: '10px' }
              return (
                <PerformanceContentsBox style={boxStyle}>
                  <div key={modelKey}>
                    <PerformanceContents>{modelKey.toString().toUpperCase()}</PerformanceContents>
                    <PerformanceValue>{formatNumber(data[modelKey])}</PerformanceValue>
                  </div>
                </PerformanceContentsBox>
              )
            })}
          </PerformanceContentsWrap>
        )}
        <PerformanceButtonWrap>
          <SaveButton onClick={handleSave}>SAVE</SaveButton>
          <ExportButton onClick={handleReport}>REPORT</ExportButton>
        </PerformanceButtonWrap>
      </ComponentContainer>
    </>
  )
}
export default ModelPerformance
const ComponentContainer = styled.div`
  font-weight: bold;
  padding: 26px 28px;
  box-shadow: 0px 0px 20px #0000001a;
  border: 1px solid #d5dcef;
  background-color: #4338f7;
  border-radius: 18px;
  color: #ffffff;
  font-size: 15px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  background-image: url('path/to/your/image.png');
  background-size: cover;
  background-position: center;
`
const PerformanceTitle = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-weight: bold;
  margin-bottom: 7.5px;
  font-size: 26px;
`
const PerformanceContentsWrap = styled.div`
  display: flex;
  padding-top: 19.5px;
`
const PerformanceContentsBox = styled.div`
  flex: 1;
`
const PerformanceContents = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #fff;
  font-size: 21px;
  padding-right: 10px;
  font-weight: bold;
`
const PerformanceModelValue = styled.span`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  color: #95eb61;
  font-size: 33px;
  font-weight: bold;
`
const PerformanceValueAccuracy = styled.span`
  color: #95eb61;
  font-size: 30px;
  font-weight: bold;
`
const PerformanceValue = styled.div`
  font-weight: bold;
  color: #95eb61;
  font-size: 30px;
`
const PerformanceButtonWrap = styled.div`
  text-align: center;
  display: flex;
  margin-top: 20px;
`
const PerformanceButton = styled.button`
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  border-radius: 9px;
  background-color: #e5ebff;
  color: #4338f7;
  font-size: 17px;
  height: 46px;
  line-height: 46px;
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
