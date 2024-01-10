import { InfoCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Select, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import InfoCircle from 'views/DataAnalysis/components/Icon/InfoCircle'
import FeatureImportance from 'views/DataAnalysis/FeatureImportance'
import { analysisResponseAtom } from 'views/DataAnalysis/store/response/atoms'
import { selectModelState } from 'views/DataAnalysis/store/userOption/atom'

const FeatureAnalysis = ({ data, input }: any) => {
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const [modelIdx, setModelIdx] = useRecoilState(selectModelState)
  const [options, setOptions] = useState([])
  const [chartData, setChartData] = useState({ labels: [], values: [] })
  const [error, setError] = useState({ MAE: 0, MSE: 0, RMSE: 0 })

  useEffect(() => {
    // console.log('analysisResponse:', analysisResponse)
    if (analysisResponse.length > 0) {
      const newOption: Array<any> = []
      analysisResponse.map((value: any, index: number) => {
        newOption.push({ value: index, label: index === 0 ? 'INEEJI Pred' : `Prediction ${index}` })
      })

      setOptions(newOption)
    }
    setError(analysisResponse[modelIdx].error)
    setChartData(analysisResponse[modelIdx]['feature_data'][0])
  }, [analysisResponse])

  const handleChange = (value: string) => {
    // console.log(`selected ${value}`)
    setChartData(analysisResponse[parseInt(value)]['feature_data'][0])
    setError(analysisResponse[modelIdx].error)
    setModelIdx(parseInt(value))
  }

  const content = (
    <div>
      <p>MAE : {error.MAE}</p>
      <p>MSE : {error.MSE}</p>
      <p>RMSE : {error.RMSE}</p>
    </div>
  )

  return (
    <ComponentContainer>
      <SubTitle>
        Feature Importance
        <InfoCircle content="변수 중요도가 높을 수록 예측 모델에 대한 영향력이 큽니다." />
        <Tooltip title={content}>
          <InfoCircleOutlined style={{ fontSize: '15px', color: '#453af6' }} />
        </Tooltip>
        {options.length > 1 && (
          <div style={{ width: '120px', margin: '0 10px', display: 'inline-block' }}>
            <Select style={{ width: 120 }} options={options} onChange={handleChange} defaultValue={options[0]?.value} />
          </div>
        )}
      </SubTitle>
      <div>
        {/* {contents.map((value: any) => {
          ;<p>
            <AIbutton>AI</AIbutton>
            <span style={{ color: '#002D65', fontSize: '12px', marginBottom: '5px' }}>{value}</span>
          </p>
        })} */}
        <div className="block float-left w-100">
          <AIbutton>AI</AIbutton>
          <AITextContainer>
            현재 예측 모델에서 가장 영향력이 큰 변수는 <b>{chartData?.labels[0]}</b>
            입니다.
          </AITextContainer>
        </div>
        <div className="block float-left w-100">
          <AIbutton>AI</AIbutton>
          <AITextContainer>
            현재 {modelIdx === 0 ? '자동 추천으로 ' : ''}입력된 원인 변수 X는{' '}
            <b>{analysisResponse[modelIdx]?.input?.join(', ')}</b>입니다.
          </AITextContainer>
        </div>
        <div className="block float-left w-100">
          <FeatureImportance data={chartData} />
        </div>
      </div>
    </ComponentContainer>
  )
}

export default FeatureAnalysis

const ComponentContainer = styled.div`
  display: block;
  float: left;
  margin: 38px 15px;
  width: 91%;
  height: 60%;
  background-color: #f6f8ff;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
`

const Title = styled.div`
  display: block;
  float: left;
  color: #002d65;
  font-weight: bold;
  margin: 25px 25px 15px 25px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
`

const SubTitle = styled(Title)`
  font-size: 22px;
  width: 100%;
`

const AIbutton = styled.button`
  display: block;
  float: left;
  background-color: #31d600;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  color: white;
  font-weight: 500;
  margin-left: 20px;
  margin-right: 10px;
`

const AITextContainer = styled.div`
  width: 80%;
  display: block;
  float: left;
  color: #002d65;
  fontsize: 12px;
  marginbottom: 5px;
`
