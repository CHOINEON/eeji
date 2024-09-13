import { UndoOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Badge, Button, message } from 'antd'
import XaiApi from 'apis/XaiApi'
import { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { colorChips, colorChips as STACKED_BAR_CHART_COLORS } from 'views/AIModelGenerator/components/Chart/colors'
import { MenuTitle } from 'views/AIModelGenerator/components/Input/Text'
import GlobalFeatureImportance from './components/GlobalFeatureImportance'
import PDP_Plot from './components/PDP_Plot'
import { transformDataByRow } from './functions'
import { activeVariables, localAttrState, xaiPaginationStore, xaiResultStore } from './store/analyze/atom'
import AnalysisGrid, { DataRow } from './Visualization/AnalysisGrid'

const XaiAnalysisResult = () => {
  const { t } = useTranslation()
  const xaiPagination = useRecoilValue(xaiPaginationStore)
  const filteredData = useRecoilValue(localAttrState)
  const [xaiResult, setXaiResult] = useRecoilState(xaiResultStore)
  const [activeVars, setActiveVars] = useRecoilState(activeVariables)

  const { mutate: mutateXaiResult } = useMutation(XaiApi.getPaginatedXaiResult, {
    onSuccess: (result: any) => {
      if (Object.keys(result).length > 0)
        setXaiResult({
          ...xaiResult,
          sample_size: result['sample_size'],
          feature_length: result.feature_list.length,
          feature_list: result['feature_list'],
          predict_result: result['predict_result'],
          input_data: transformDataByRow(
            xaiPagination.limit,
            xaiPagination.offset,
            result['input_data'],
            xaiPagination.total
          ),
          xai_local: transformDataByRow(
            xaiPagination.limit,
            xaiPagination.offset,
            result['xai_local'],
            xaiPagination.total
          ),
          xai_global: result['xai_global'],
          xai_pdp: result['xai_pdp'],
          colors: STACKED_BAR_CHART_COLORS,
        })
    },
    onError: (error: AxiosError) => {
      message.error(error.message)
    },
  })

  useEffect(() => {
    //각 입력변수별로 활성화 여부를 담는 배열 세팅
    const obj = xaiResult?.feature_list.reduce((accumulator, value) => {
      return { ...accumulator, [value]: true }
    }, {})
    setActiveVars(obj)
  }, [])

  useEffect(() => {
    //자식 컴포넌트에서 pagination 설정 바뀔 때마다 데이터 다시 가져옴
    mutateXaiResult({ model_id: xaiResult.model_id, offset: xaiPagination.offset, limit: xaiPagination.limit })
  }, [xaiPagination])

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
      <div className="container p-5 h-full">
        <MenuTitle className="ml-4">XAI</MenuTitle>
        {/* 
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
          </p> */}
        <div className="w-100 mt-4">
          <div className="w-[70%] h-[77vh] mr-2 block float-left">
            <RoundedBox height="75vh">
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
                  {xaiResult.feature_list.map((value: number, index) => (
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
                  featureList={xaiResult?.feature_list}
                  localWeight={filteredData}
                  localValue={xaiResult?.input_data}
                  predResult={xaiResult?.predict_result.predict_result}
                />
              </div>
            </RoundedBox>
          </div>
          <div className="w-[28%] h-[77vh] ml-1 bg-red block float-left">
            {xaiResult?.xai_pdp ? <PDP_Plot data={xaiResult?.xai_pdp} /> : null}
            {xaiResult?.xai_global ? (
              <GlobalFeatureImportance data={xaiResult?.xai_global} colors={xaiResult?.colors} />
            ) : null}
          </div>
        </div>
      </div>
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
