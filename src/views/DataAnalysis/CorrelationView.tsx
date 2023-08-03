import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { DatePicker, Space, Select, Button, Empty, Skeleton, Switch } from 'antd'
import ItemBox from './components/DataEntry/ItemBox'
import axios from 'axios'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { dataFileStore, dataSetStore, stepCountStore } from './store/atom'
import { selectedVarStoreX, selectedVarStoreY, usedVariableStore, variableStore } from './store/variable/atom'
import NewTagSelect from './components/TagTree/NewTagSelect'
import SliderWithNumber from './components/DataEntry/SliderWithNumber'
import Plot from 'react-plotly.js'
import RadioButtonGroup from './components/DataEntry/RadioButtonGroup'
import { ArrowRightOutlined, DotChartOutlined } from '@ant-design/icons'
import { startEndDateAtom } from './store/base/atom'
import dayjs from 'dayjs'

const CorrelationViewContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 35vw;
  // border: 1px solid red;
`
const HyperpararmeterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 4vw 2vw;
  float: left;
  width: 30%;
  height: 100%;
`
const PlotWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 3vw 1vw;
  float: left;
  width: 62%;
`

const defaultLayout: any = {
  automargin: true,
  autoresize: true,
  hovermode: 'closest',
  title: 'CorrPlot',
  plot_bgcolor: 'rgba(255,255,255,0)',
}
const DATE_FORMAT = 'YYYY-MM-DD'

const CorrelationView = () => {
  const { RangePicker } = DatePicker

  const setActiveStep = useSetRecoilState(stepCountStore)
  const selectedDataset = useRecoilState(dataSetStore)
  const selectedFile = useRecoilState(dataFileStore)
  const defaultValue = useRecoilValue(startEndDateAtom)

  const [selectedDates, setSelectedDates] = useState()

  const [plotData, setPlotData] = useState()
  const [plotImg, setPlotImg] = useState()

  const [scalingOption, setScalingOption] = useState('iqr')
  const [layoutOption, setLayoutOption] = useState(defaultLayout)
  const [featureX, setFeatureX] = useState([])
  const [featureY, setFeatureY] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  const [optionsX, setOptionsX] = useState([])
  const [optionsY, setOptionsY] = useState([])

  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)

  const [checked, setChecked] = useState(false)

  const config = {
    displaylogo: false,
    responsive: true,
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    setOptionsX(variableList)
    setOptionsY(variableList)
  }, [variableList])

  const fetchCorrelationPlot = async () => {
    setLoading(true)

    const param = {
      response_type: 'json', //DB에서 encoded image or json 중 알아서 보내주기로
      dataset_id: selectedDataset[0],
      file_nm: selectedFile[0],
      scaling_method: scalingOption,
      x_value: featureX,
      y_value: featureY,
    }

    // console.log('param:', param)
    await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/corrplot/cplot', param)
      .then((response: any) => {
        setLoading(false)

        setPlotImg(undefined)
        setPlotData(undefined)

        console.log('/api/corrplot/cplot response ::', response)
        console.log('layout::', response.data.layout)

        if (response.data.image) {
          setPlotImg(response.data.image)
        } else {
          setPlotData(response.data.data)

          //layout 수정
          const layout = response.data.layout
          layout['margin'] = { r: 10, b: 10 }
          setLayoutOption(layout)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })

    // image를 그대로 받아오는 경우 ( response_type : 'blob'  인 경우 )
    // await axios
    //   .post<Blob>('http://101.101.209.181:8080' + '/api/corrplot/cplot', param, {
    //     responseType: 'blob',
    //   })
    //   .then((res) => {
    //     const myFile = new File([res.data], 'imageName')
    //     const reader = new FileReader()
    //     reader.onload = (ev) => {
    //       const previewImage = String(ev.target?.result)
    //       console.log('111::', previewImage)
    //       setPlotImg(previewImage) // myImage라는 state에 저장했음
    //     }
    //     reader.readAsDataURL(myFile)
    //   })
  }

  const handleSearchClick = () => {
    fetchCorrelationPlot()
  }

  const handleRadioButtonChange = (value: any) => {
    setScalingOption(value)
  }

  const handleSelect = (param: any) => {
    if (param.type === 'x') setFeatureX(param.value)
    if (param.type === 'y') setFeatureY(param.value)

    const result = []
    for (let i = 0; i < usedVariable.length; i++) {
      //같은 카테고리에 선택된거 있으면 해제
      if (usedVariable[i].category === param.type) {
        result.push({ value: usedVariable[i].value, used: false })
      }
      //선택된 값은 true처리
      else if (usedVariable[i].value === param.value) {
        result.push({ value: usedVariable[i].value, used: true, category: param.type })
      } else {
        //그 외는 그대로 렌더링
        result.push(usedVariable[i])
      }
    }

    setUsedVariable(result)
  }

  const handleNext = () => {
    setActiveStep(2)
  }

  const onChangeSwitch = (param: any) => {
    // console.log('swithc:', param)
    setChecked(param)
  }

  const handleChange = (dateArray: any) => {
    console.log('datearr[0]:', dateArray[0].format('YYYY-MM-DD'))

    setSelectedDates(dateArray)
  }

  //type error...
  const handleDefaultValue = () => {
    // if (selectedDates) {
    //   return [dayjs(defaultValue[0], DATE_FORMAT), dayjs(defaultValue[1], DATE_FORMAT)]
    // }

    return [dayjs(), dayjs()]
  }

  return (
    <>
      <CorrelationViewContainer>
        <PlotWrapper className="rounded-box w-100 h-100">
          <div className="w-100 h-100">
            {plotImg && <img src={plotImg} width="500" height="200" style={{ margin: 'auto' }} />}
            {!plotImg && <Plot className="w-100 h-100" data={plotData} layout={layoutOption} config={config} />}
          </div>
        </PlotWrapper>
        <HyperpararmeterWrapper className="rounded-box">
          <div className="w-100 h-90">
            <Space className="w-100" direction="vertical" size={15}>
              <ItemBox title="Time Series" component={<Switch onChange={onChangeSwitch} checked={checked} />} />
              <ItemBox
                title="Date Range"
                component={
                  <RangePicker
                    size="middle"
                    style={{ width: '100%' }}
                    // defaultValue={handleDefaultValue}
                    onChange={handleChange}
                  />
                }
                visible={checked}
              ></ItemBox>
              <ItemBox
                title="Variable X"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="EXPLANATORY_VARIABLE"
                    onSelect={handleSelect}
                    selectOptions={optionsX}
                  />
                }
              />
              <ItemBox
                title="Variable Y"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="TARGET_VARIABLE"
                    onSelect={handleSelect}
                    selectOptions={optionsY}
                  />
                }
              />
              <ItemBox
                title="Scaling Option"
                component={<RadioButtonGroup onChangeValue={handleRadioButtonChange} />}
              />
            </Space>
          </div>
          <div className="w-100 h-10">
            <ItemBox
              title=""
              component={
                <Button type="primary" block onClick={handleSearchClick} loading={loading}>
                  Search
                </Button>
              }
            />
          </div>
        </HyperpararmeterWrapper>
      </CorrelationViewContainer>
      <div style={{ margin: '10px 30px', float: 'right' }}>
        <Button type="text" icon={<ArrowRightOutlined />} onClick={handleNext}>
          NEXT
        </Button>
      </div>
    </>
  )
}

export default CorrelationView
