import styled from '@emotion/styled'
import { Button, Col, Row, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import InfoCircle from '../AIModelGenerator/components/Icon/InfoCircle'
import AnalysisGrid, { ColumnHeader, DataRow } from './Visualization/AnalysisGrid'
import { useRecoilState, useRecoilValue } from 'recoil'
import { transformedXaiResultStore, xaiResultStore } from './store/analyze/atom'
import ModelPerformance from './ModelPerformance'
import FeatureAnalysis from 'views/AnalysisResult/FeatureAnalysis'
import FeatureImportance from 'views/AIModelGenerator/FeatureImportance'
import GlobalFeatureImportance from './components/GlobalFeatureImportance'

const AnalysisResult = () => {
  const data = useRecoilValue(xaiResultStore)
  const [transformedData, setTransformedData] = useRecoilState(transformedXaiResultStore)
  const [activeButtons, setActiveButtons] = useState([])

  useEffect(() => {
    console.log('data', data)

    // setTransformedData({
    //   ...transformedData,
    //   xai_local: transformDataByRow(data.xai_local),
    //   local_value: transformDataByRow(data.input_data),
    //   pred_result: data.predict_result.predict_result,
    //   xai_pdp: data.xai_pdp,
    // })

    const newObj = data.feature_list.reduce((acc, curr) => {
      console.log(curr)
      const feature = curr
      return { ...acc, curr: false }
    })
    console.log('newobj:', newObj)
  }, [data])

  // useEffect(() => {
  //   console.log('transformedData', transformedData)
  // }, [transformedData])

  const transformDataByRow = (rawData: any) => {
    const sample_size = data.sample_size //1200
    const transformedData = []

    for (let i = 0; i < sample_size; i++) {
      const newDataPoint: any = {}

      for (const feature of data.feature_list) {
        newDataPoint[feature] = rawData[feature][i]
      }
      transformedData.push(newDataPoint)
    }
    return transformedData
  }

  return (
    <div>
      <Container>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <Title
            style={{
              color: '#002D65',
              display: 'inline-block',
              width: '80%',
              fontWeight: 'bold',
              fontSize: '32px',
              marginLeft: 20,
            }}
          >
            XAI
            <InfoCircle content="。。。" />
          </Title>
          <Col span={18}>
            초기화 버튼
            <Row>
              <RoundedBox width={'100%'} height={'75vh'}>
                <VariableRow>
                  <div className="w-1/7 text-left">
                    <ColumnHeader width="100%">입력변수</ColumnHeader>
                  </div>
                  <div className="w-6/7">
                    {data.feature_list.map((value: any, index) => (
                      <Button key={index} type="primary" shape="round" className="m-1">
                        변수{value}
                      </Button>
                    ))}
                  </div>
                </VariableRow>
                <AnalysisGrid
                // localWeight={transformedData.xai_local}
                // localValue={transformedData.local_value}
                // predResult={transformedData.pred_result}
                // columns={Object.keys(data.input_data)}
                />
              </RoundedBox>
            </Row>
          </Col>
          <Col span={6}>
            <GlobalFeatureImportance data={data?.xai_global[0]} />
          </Col>
        </Row>
        <Row style={{ width: '100%' }}></Row>
        <Col span={6}></Col>
      </Container>
    </div>
  )
}

export default AnalysisResult

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const VariableRow = styled(DataRow)`
  background-color: #ffffff;
`
const UploadContainer = styled.div`
  // border: 1px solid red;
  position: absolute;
  width: 400px;
  height: 400px;
  padding: 100px 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`

const TextMain = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 25px;
  text-align: center;
`

const TextSub = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 13px;
  text-align: center;
`

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
  overflow: auto;
`

const UploadButton = styled.button`
  background-color: #4338f7;
  width: 230px;
  height: 46px;
  border-radius: 10px;
  color: #fff;
  font-family: 'Helvetica Neue';
  font-weight: Bold;
  font-size: 17px;
`
