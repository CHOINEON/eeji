import styled from '@emotion/styled'
import { Button, Col, Row, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import InfoCircle from '../AIModelGenerator/components/Icon/InfoCircle'
import AnalysisGrid, { ColumnHeader, DataRow } from './Visualization/AnalysisGrid'
import { useRecoilState, useRecoilValue } from 'recoil'
import { localAttrState, transformedXaiResultStore, xaiResultStore } from './store/analyze/atom'
import ModelPerformance from './ModelPerformance'
import FeatureAnalysis from 'views/AnalysisResult/FeatureAnalysis'
import FeatureImportance from 'views/AIModelGenerator/FeatureImportance'
import GlobalFeatureImportance from './components/GlobalFeatureImportance'
import PDP_Plot from './components/PDP_Plot'

interface IactiveButtons {
  [key: string]: boolean
}

export const transformDataByRow = (count: number, rawData: any) => {
  const sample_size = count //["1","2","3","4"]
  const transformedData: Array<unknown> = []

  for (let i = 0; i < sample_size; i++) {
    const newDataPoint: any = {}

    for (const feature in rawData) {
      newDataPoint[feature] = rawData[feature][i]
    }
    transformedData.push(newDataPoint)
  }
  return transformedData
}

const AnalysisResult = () => {
  const [data, setData] = useRecoilState(xaiResultStore)
  const [activeButtons, setActiveButtons] = useState<IactiveButtons>({})
  const [filteredData, setFilteredData] = useRecoilState(localAttrState({}))

  const [transformedData, setTransformedData] = useRecoilState(transformedXaiResultStore)

  // useEffect(() => {
  //   setTransformedData(data)
  // }, [])

  useEffect(() => {
    console.log('AnalysisResult  mounted data', data)

    //초기에 원본과 동일하게 세팅
    // if (data.feature_length > 0) setTransformedData(data)

    //각 입력변수별로 활성화 여부를 담는 배열 세팅
    // const obj = data.feature_list.reduce((accumulator, value) => {
    //   return { ...accumulator, [value]: true }
    // }, {})

    // setActiveButtons(obj)
  }, [])

  // useEffect(() => {
  //   console.log('filteredData', filteredData)
  // }, [filteredData])

  useEffect(() => {
    // console.log('activeButtons:', activeButtons)
    // setFilteredData(activeButtons)
    // console.log('activeButtons', activeButtons)
    // const filterValuesArray = Object.keys(activeButtons).filter((key) => !activeButtons[key])
    // console.log('filterValuesArray::', filterValuesArray)
    // if (Object.keys(activeButtons).length > 0 && filterValuesArray.length === 0) {
    //   // console.log('여기?')
    //   //전부 true라서 필터링 할 게 없으면 다시 원본으로 복구
    //   setTransformedData({ ...data })
    // } else {
    //   filterValuesArray.map((val: any) => {
    //     // console.log('data?.xai_local:', data?.xai_local)
    //     const newArr = transformedData?.xai_local?.map((item: any) => {
    //       if (val in item) return { ...item, [val]: 0 }
    //     })
    //     console.log('newArr:', newArr)
    //     setTransformedData({ ...transformedData, xai_local: newArr })
    //   })
    // }
  }, [activeButtons])

  const handleClick = (e: any) => {
    // console.log('e:', e.target.innerText)
    const selectedVar = e.target.innerText
    setActiveButtons({ ...activeButtons, [selectedVar]: !activeButtons[selectedVar] })
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
            <Row>
              <RoundedBox width={'100%'} height={'75vh'}>
                {/* <VariableRow>
                  <div className="w-1/7 text-left">
                    <ColumnHeader width="100%">입력변수</ColumnHeader>
                  </div>
                  <div className="w-6/7">
                    {data.feature_list.map((value: any, index) => (
                      <button
                        key={index}
                        className={`bg-${activeButtons[value] ? 'blue-800' : 'white'} m-1 text-${
                          activeButtons[value] ? 'white' : 'black'
                        } px-4 py-2 rounded-full ${activeButtons[value] ? ' ' : 'border'}  `}
                        onClick={handleClick}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </VariableRow> */}
                <AnalysisGrid
                  data={data}
                  // localWeight={data.xai_local}
                  // localValue={data.input_data}
                  // predResult={data.predict_result}
                  // columns={Object.keys(data.input_data)}
                />
              </RoundedBox>
            </Row>
          </Col>
          <Col span={6}>
            {/* <PDP_Plot data={data?.xai_pdp} /> */}
            {/* <GlobalFeatureImportance data={data?.xai_global[0]} /> */}
          </Col>
        </Row>
        <Row style={{ width: '100%' }}></Row>
        <Col span={6}></Col>
      </Container>
    </div>
  )
}

export default React.memo(AnalysisResult)

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
