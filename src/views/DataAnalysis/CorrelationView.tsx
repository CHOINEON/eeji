import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { App, DatePicker, Space, Button } from 'antd'
import ItemBox from './components/DataEntry/ItemBox'
import axios from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { stepCountStore } from './store/atom'
import { selectedVarStoreX, selectedVarStoreY, usedVariableStore, variableStore } from './store/variable/atom'
import NewTagSelect from './components/TagTree/NewTagSelect'
import Plot from 'react-plotly.js'
import RadioButtonGroup from './components/DataEntry/RadioButtonGroup'
import { ArrowRightOutlined, DotChartOutlined } from '@ant-design/icons'
import { selectedDataState } from './store/base/atom'
import dayjs from 'dayjs'

const Context = React.createContext({ name: 'Default' })

const CorrelationView = () => {
  const { RangePicker } = DatePicker

  const { message, notification } = App.useApp()
  const setActiveStep = useSetRecoilState(stepCountStore)
  // const selectedDataset = useRecoilState(dataSetStore)
  // const selectedFile = useRecoilState(dataFileStore)
  const [selectedDates, setSelectedDates] = useState()
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState)

  const [plotData, setPlotData] = useState()
  const [plotImg, setPlotImg] = useState()

  const [scalingOption, setScalingOption] = useState('iqr')
  const [layoutOption, setLayoutOption] = useState()
  const [featureX, setFeatureX] = useState([])
  const [featureY, setFeatureY] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  const [defaultOption, setDefaultOption] = useState([])

  const [variableList, setVariableList] = useRecoilState(variableStore)
  const [usedVariable, setUsedVariable] = useRecoilState(usedVariableStore)
  const [checked, setChecked] = useState(false)

  const plotRef = useRef(null)

  const config = {
    displaylogo: false,
    responsive: true,
  }

  useEffect(() => {
    setLoading(false)
    openNotification()
    // if (selectedData.id === '') {
    //   messageApi.open({
    //     type: 'error',
    //     content: '파일이 선택되지 않았습니다.',
    //     duration: 1,
    //     style: {
    //       margin: 'auto',
    //     },
    //   })
    //   setActiveStep(0)
    // }
  }, [])

  useEffect(() => {
    setDefaultOption(variableList)
  }, [variableList])

  const openNotification = () => {
    notification.info({
      message: `Notification`,
      description: (
        <Context.Consumer>
          {({ name }) => '현재 서버 이전 중으로 일부 기능의 동작이 원활하지 않습니다.'}
        </Context.Consumer>
      ),
    })
  }

  const fetchCorrelationPlot = async () => {
    setLoading(true)
    setPlotImg(undefined)
    setPlotData(undefined)

    const param = {
      response_type: 'json', //DB에서 encoded image or json 중 알아서 보내주기로
      dataset_id: selectedData.id,
      file_nm: selectedData.name,
      scaling_method: scalingOption,
      x_value: featureX,
      y_value: featureY,
      user_id: localStorage.getItem('userId'),
    }

    // console.log('param:', param)

    await axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/corrplot/cplot', param)
      .then((response: any) => {
        setLoading(false)

        console.log('/api/corrplot/cplot response ::', response)

        if (response.data.image) {
          setPlotImg(response.data.image)
        } else {
          setPlotData(response.data.data)

          //layout 수정
          const layout = response.data.layout
          layout['margin'] = {
            x: '4vw',
            y: '1vw',
          }
          setLayoutOption(layout)
        }
      })
      .catch((error) => {
        setLoading(false)
        // messageApi.open({
        //   type: 'error',
        //   content: '관리자에게 문의하세요',
        //   duration: 1,
        //   style: {
        //     margin: 'auto',
        //   },
        // })
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
    if (featureX.length === 0 || featureY.length === 0) {
      // messageApi.open({
      //   type: 'error',
      //   content: '변수 X, Y를 선택하십시오.',
      //   duration: 1,
      //   style: {
      //     margin: 'auto',
      //   },
      // })
    } else {
      fetchCorrelationPlot()
    }
  }

  const handleRadioButtonChange = (value: any) => {
    setScalingOption(value)
  }

  const handleSelect = (param: any) => {
    // console.log('selected:', param)
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
    // console.log('datearr[0]:', dateArray[0].format('YYYY-MM-DD'))

    setSelectedDates(dateArray)
  }

  const handleResetButton = (event: any) => {
    fetchCorrelationPlot()
    const update = {
      title: 'some new title', // updates the title
      'xaxis.range': [-0.8237524999999999, -0.05399250000000011],
      'xaxis.range[0]': -0.8237524999999999,
      'xaxis.range[1]': -0.05399250000000011,
      'yaxis.range': [-0.75151875, 0.12421125000000002],
      'yaxis.range[0]': -0.75151875,
      'yaxis.range[1]': 0.12421125000000002,
      'xaxis.autorange': false,
      'yaxis.autorange': false,
    }

    // console.log('handleResetButton', handleResetButton)
    // setLayoutOption(updateTest)

    //console.log('respData:', respData)

    // setPlotData(undefined)
    // setLayoutOption(undefined)

    // setLayoutOption({ ...respData.layout })
    // setPlotData([...respData.plotdata])
  }

  const handleDefaultValue = () => {
    // if (selectedDates) {
    //   return [dayjs(defaultValue[0], DATE_FORMAT), dayjs(defaultValue[1], DATE_FORMAT)]
    // }

    return [dayjs(), dayjs()]
  }

  return (
    <>
      <CorrelationViewContainer>
        <PlotWrapper>
          <div className="w-100 h-100 d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/** default image */}
            {!plotImg && !plotData && (
              <DotChartOutlined style={{ fontSize: 100, color: '#bfbfbf', textAlign: 'center' }} />
            )}
            {/** render image or plot */}
            {plotImg ? (
              <img src={plotImg} style={{ margin: 'auto', width: '40vw' }} />
            ) : plotData ? (
              <Plot ref={plotRef} className="w-100 h-100" data={plotData} layout={layoutOption} config={config} />
            ) : null}
          </div>
        </PlotWrapper>
        <OptionWrapper>
          <div className="w-100 h-90">
            <Space className="w-100" direction="vertical" size={15}>
              {/* <ItemBox title="Time Series" component={<Switch onChange={onChangeSwitch} checked={checked} />} />
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
              ></ItemBox> */}
              <ItemBox
                title="Variable X"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="x"
                    onSelect={handleSelect}
                    selectOptions={defaultOption}
                  />
                }
              />
              <ItemBox
                title="Variable Y"
                component={
                  <NewTagSelect
                    style={{ width: '100%', margin: 'auto', float: 'left', minWidth: '150px' }}
                    selectionType="single"
                    type="y"
                    onSelect={handleSelect}
                    selectOptions={defaultOption}
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
                  Plot
                </Button>
              }
            />
          </div>
        </OptionWrapper>
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

const CorrelationViewContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
`
const RoundBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  float: left;
  background-color: white;
  box-shadow: 0px 5px 20px #4338f733;
  border-radius: 18px;
  opacity: 1;
`

const OptionWrapper = styled(RoundBox)`
  // display: flex;
  // flex-wrap: wrap;
  // float: left;
  padding: 4vw 2vw;
  width: 30%;
  height: 100%;
`
const PlotWrapper = styled(RoundBox)`
  // display: flex;
  // flex-wrap: wrap;
  // float: left;
  padding: 3vw 1vw;
  width: 62%;
`
