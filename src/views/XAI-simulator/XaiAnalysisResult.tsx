import { UndoOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Badge, Button, Col, Row } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import GlobalFeatureImportance from './components/GlobalFeatureImportance'
import PDP_Plot from './components/PDP_Plot'
import { activeVariables, localAttrState, xaiResultStore } from './store/analyze/atom'
import AnalysisGrid, { DataRow } from './Visualization/AnalysisGrid'

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
  const { t } = useTranslation()
  const data = useRecoilValue(xaiResultStore)
  const [activeVars, setActiveVars] = useRecoilState(activeVariables)
  const filteredData = useRecoilValue(localAttrState)

  useEffect(() => {
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
          </p>
          <Col span={18}>
            <RoundedBox width={'100%'} height={'75vh'}>
              <div className="w-1/7 text-left ">
                <Title>{t('Input Variable Filtering')}</Title>
                <Button
                  className="inline-block float-right"
                  type="text"
                  icon={<UndoOutlined />}
                  onClick={handleClearFilter}
                >
                  {t('Clear')}
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
                <Title>{t('Prediction Model Explanation Results')}</Title>
                <AnalysisGrid
                  featureList={data?.feature_list}
                  localWeight={filteredData}
                  localValue={data?.input_data}
                  predResult={data?.predict_result.predict_result}
                />
              </div>
            </RoundedBox>
          </Col>
          <Col span={6} style={{ width: '100%', height: '75vh' }}>
            {data?.xai_pdp ? <PDP_Plot data={data?.xai_pdp} /> : null}
            {data?.xai_global ? <GlobalFeatureImportance data={data?.xai_global} colors={data?.colors} /> : null}
          </Col>
        </Row>
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
