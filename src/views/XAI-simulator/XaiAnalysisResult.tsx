import styled from '@emotion/styled'
import { Badge, Button, Col, Row, Space, Tag } from 'antd'
// import Title from 'antd/es/typography/Title'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import AnalysisGrid, { ColumnHeader, DataRow } from './Visualization/AnalysisGrid'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeVariables, localAttrState, transformedXaiResultStore, xaiResultStore } from './store/analyze/atom'
import GlobalFeatureImportance from './components/GlobalFeatureImportance'
import PDP_Plot from './components/PDP_Plot'
import tw from 'tailwind-styled-components'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { UndoOutlined } from '@ant-design/icons'

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

const XaiAnalysisResult = () => {
  const [data, setData] = useRecoilState(xaiResultStore)
  const [activeVars, setActiveVars] = useRecoilState(activeVariables)
  const filteredData = useRecoilValue(localAttrState)

  useEffect(() => {
    // console.log('AnalysisResult  mounted data', data)

    //각 입력변수별로 활성화 여부를 담는 배열 세팅
    const obj = data?.feature_list.reduce((accumulator, value) => {
      return { ...accumulator, [value]: true }
    }, {})

    setActiveVars(obj)
  }, [])

  const handleClick = (e: any) => {
    const selectedVar = e.target.innerText
    setActiveVars({ ...activeVars, [selectedVar]: !activeVars[selectedVar] })
  }

  const handleClearFilter = (e: any) => {
    // for (const [key, value] of Object.entries(activeVars)) {
    //   // setActiveVars({ ...activeVars, [key]: true })
    // }

    setActiveVars((prevState: any) => {
      const updatedVars = { ...prevState }

      for (const [key, value] of Object.entries(updatedVars)) {
        updatedVars[key] = true
      }
      return updatedVars
    })
  }

  return (
    <>
      <Container>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <p
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
            {/* <InfoCircle content="。。。" /> */}
          </p>
          <Col span={18}>
            <RoundedBox width={'100%'} height={'75vh'}>
              {/* <ScrollContainer> */}
              <div className="w-1/7 text-left ">
                {/* <RowLabel>입력변수</RowLabel> */}
                <Title>입력변수 필터링</Title>
                <Button
                  className="inline-block float-right"
                  type="text"
                  icon={<UndoOutlined />}
                  onClick={handleClearFilter}
                >
                  Clear
                </Button>
              </div>
              <VariableRow>
                <div className="w-6/7 p-3">
                  {data.feature_list.map((value: number, index) => (
                    <DynamicBadgeButton
                      className="px-4 rounded-full m-1 min-w-[70px] h-[28px] font-['Helvetica Neue'] border-[#D5DCEF]}"
                      key={index}
                      toggle={activeVars[value]}
                      color={colorChips[index]}
                      onClick={handleClick}
                    >
                      {/* <Badge className="mr-4" color={colorChips[index]} />
                        {value} */}

                      <Badge
                        className={`${activeVars[value] ? 'border-white' : `border-[${colorChips[index]}]`} mr-4`}
                        color={activeVars[value] ? 'white' : colorChips[index]}
                      />
                      {value}
                    </DynamicBadgeButton>
                  ))}
                </div>
              </VariableRow>
              <div className="mt-[50px]">
                <Title>예측모델 설명 결과</Title>
                <AnalysisGrid
                  featureList={data.feature_list}
                  localWeight={filteredData}
                  localValue={data.input_data}
                  predResult={data.predict_result}
                  // columns={Object.keys(data.input_data)}
                />
              </div>
              {/* </ScrollContainer> */}
            </RoundedBox>
          </Col>
          <Col span={6} style={{ width: '100%', height: '75vh' }}>
            <PDP_Plot data={data?.xai_pdp} />
            <GlobalFeatureImportance data={data?.xai_global[0]} colors={data.colors} />
          </Col>
        </Row>
        <Row style={{ width: '100%' }}></Row>
        <Col span={6}></Col>
      </Container>
    </>
  )
}

export default React.memo(XaiAnalysisResult)

const DynamicBadgeButton = styled.button<{ color: string; toggle: boolean }>`
  background-color: ${(props: any) => (props.toggle ? props.color : 'white')};
  color: ${(props: any) => (props.toggle ? '#FFFFFF' : '#174274')};
`

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const Title = styled.span`
  color: #002d65;
  font-family: 'Helvetica Neue';
  font-size: 17px;
  margin: 5px 3px;
  font-weight: bold;
`

const VariableRow = styled(DataRow)`
  background-color: #f5f8ff;
  margin-bottom: 10px;
  border: 1px solid #d5dcef;
`

const Container = styled.div`
  width: 100%;
  height: 35vw;
  // margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  // padding-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
  overflow: auto;

  overflow-y: scroll;
  overflow-x: scroll;
  overflow: -moz-scrollbars-horizontal;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    height: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`

const ScrollContainer = styled.div`
  overflow-y: scroll;
  overflow-x: scroll;
  overflow: -moz-scrollbars-horizontal;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    height: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`
