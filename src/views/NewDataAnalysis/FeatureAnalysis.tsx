import { DownOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Carousel, Dropdown, MenuProps, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import InfoCircle from 'views/DataAnalysis/components/Icon/InfoCircle'
import FeatureImportance from 'views/DataAnalysis/FeatureImportance'
import { selectedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { analysisResponseAtom } from 'views/DataAnalysis/store/response/atoms'
import { selectModelState } from 'views/DataAnalysis/store/userOption/atom'

const FeatureAnalysis = ({ data, input }: any) => {
  // const selectedData = useRecoilValue(selectedDataState)
  const analysisResponse = useRecoilValue(analysisResponseAtom)
  const [modelIdx, setModelIdx] = useRecoilState(selectModelState)
  const [options, setOptions] = useState([])
  const [chartData, setChartData] = useState({ labels: [], values: [] })
  // const [contents, setContents] = useState([])

  // const onChange = (currentSlide: number) => {
  //   console.log(currentSlide)

  // }

  useEffect(() => {
    // console.log('analysisResponse:', analysisResponse)
    if (analysisResponse.length > 0) {
      const newOption: Array<any> = []
      analysisResponse.map((value: any, index: number) => {
        newOption.push({ value: index, label: index === 0 ? 'INEEJI Pred' : `Prediction ${index}` })
      })

      setOptions(newOption)
    }

    setChartData(analysisResponse[modelIdx]['data']['feature_piechart_data'][0])
  }, [analysisResponse])

  const handleChange = (value: string) => {
    // console.log(`selected ${value}`)
    setChartData(analysisResponse[parseInt(value)]['data']['feature_piechart_data'][0])
    setModelIdx(parseInt(value))
  }

  return (
    <ComponentContainer>
      <SubTitle>
        Feature Importance
        <InfoCircle content="변수 중요도가 높을 수록 예측 모델에 대한 영향력이 큽니다." />
        {options.length > 1 && (
          <div style={{ width: '120px', display: 'inline-block' }}>
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
        <div className="block float-left">
          <AIbutton>AI</AIbutton>
          <div
            style={{
              width: '84%',
              display: 'inline-block',
              marginRight: '10px',
              float: 'right',
              color: '#002D65',
              fontSize: '12px',
              marginBottom: '5px',
            }}
          >
            현재 예측 모델에서 가장 영향력이 큰 변수는 <b>{chartData?.labels[0]}</b>
            입니다.
          </div>
        </div>
        <div className="block float-left">
          <AIbutton>AI</AIbutton>
          <div
            style={{
              width: '84%',
              display: 'inline-block',
              marginRight: '10px',
              float: 'right',
              color: '#002D65',
              fontSize: '12px',
              marginBottom: '5px',
            }}
          >
            현재 {modelIdx === 0 ? '자동 추천으로 ' : ''}입력된 원인 변수 X는{' '}
            <b>{analysisResponse[modelIdx]?.input?.join(', ')}</b> 입니다.
          </div>
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
  margin: 25px;
  width: 90%;
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

const ContentsTitle = styled(Title)`
  font-size: 20px;
`

const AIbutton = styled.button`
  background-color: #31d600;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  color: white;
  font-weight: 500;
  margin-left: 20px;
  margin-right: 10px;
`
