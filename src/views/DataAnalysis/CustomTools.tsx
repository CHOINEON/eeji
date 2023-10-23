import styled from '@emotion/styled'
import { Button, Col, Row, Tabs, Switch, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import VariableOption from './components/Option/VariableOption'
import { useRecoilState, useRecoilValue } from 'recoil'
import { inputCorrPlotOptionState, inputOptionListState } from './store/userOption/atom'
import { selectedDataState, userInfoState } from './store/base/atom'
import axios from 'axios'
import PreprocessingOption from './components/Option/PreprocessingOption'
import ModelOption from './components/Option/ModelOption'
import ScatterChart from './components/Chart/ScatterChart'
import Title from 'antd/es/typography/Title'
import ModelApi from 'apis/ModelApi'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

//데이터, 전처리(알고리즘) , 모델 생성
const CustomTools = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')

  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const [corrPlotOption, setCorrPlotOption] = useRecoilState(inputCorrPlotOptionState)
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)
  const selectedData = useRecoilValue(selectedDataState)
  const [activeKey, setActiveKey] = useState('1')

  const items = [
    { name: 'Data', value: <VariableOption /> },
    { name: 'Preprocessing', value: <PreprocessingOption /> },
    { name: 'Model', value: <ModelOption /> },
  ]
  const [auto, setAuto] = useState(true)

  // const [resultText, setResultText] = useState({ mae: '', rmse: '' })

  const [result, setResult] = useState([{ preprocessing_graphs: [] }])
  const [chartData, setChartData] = useState({ preprocessing: [], corrplot: [], tempCorr: {} })
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState()

  const [testData, setTestData] = useState([])

  const onSwitchChange = (checked: boolean) => {
    setAuto(checked)
    setActiveKey('1')
  }

  const { mutate } = useMutation(ModelApi.postModelOption, {
    onSuccess: (response) => {
      toast(() => 'success')
      //initialize
      setOptions([])

      //formatting
      const dataArr = response.data?.preprocessing_graphs
      const selectList = dataArr.map((x: any) => x.column_name)
      setResult((prev) => [{ preprocessing_graphs: dataArr }])

      selectList.forEach((element: any) => {
        const obj = { value: '', label: '' }
        obj['value'] = element
        obj['label'] = element
        setOptions((prev) => [...prev, obj])
      })

      //select box binding
      setSelectedOption(selectList[0])

      //chart data binding
      setChartData({ ...chartData, preprocessing: dataArr[0] })
    },
    onError: (error: any) => {
      console.error(error)
    },
  })

  // useEffect(() => {
  //   console.log('userInputOption:', userInputOption)
  // }, [userInputOption])

  useEffect(() => {
    console.log('chartData:', chartData)
  }, [chartData])

  //컴포넌트 최초 마운트 시 기초 정보 담기
  useEffect(() => {
    setUserInputOption({
      ...userInputOption,
      set_auto: true,
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      dataset_id: selectedData.ds_id,
      start_date: selectedData.startDate,
      end_date: selectedData.endDate,
      date_col: selectedData.dateCol,

      // x_value: [],
      // y_value: '',
      // type_missing: null,

      // number_missing: null,
      // type_outlier: null,
      // number_std: null,
      // number_perc: null,
      // type_scaling: null,
      // number_ma: null,
      // type_model: null,
      // number_epoch: null,
      // number_beyssian: null,
    })
    // setOptions([])
  }, [])

  const handleClick = () => {
    if (auto) {
      setUserInputOption({
        ...userInputOption,
        set_auto: true,
        com_id: localStorage.getItem('companyId'),
        user_id: localStorage.getItem('userId'),
        dataset_id: selectedData.ds_id,
      })
    }

    //TODO: Feature 선택 안 한 경우 API요청으로 넘어가지 않음
    if (userInputOption.x_value.length === 0 || userInputOption.y_value.length === 0) {
      alert('선택 안함')
    } else {
      const param = {
        set_auto: auto,
        user_id: localStorage.getItem('userId'),
        com_id: localStorage.getItem('companyId'),
        dataset_id: selectedData.ds_id,
        date_col: selectedData.dateCol,

        start_date: selectedData.startDate,
        end_date: selectedData.endDate,
        x_value: userInputOption.x_value || [],
        y_value: userInputOption.y_value || '',
        type_missing: userInputOption.type_missing,

        number_missing: userInputOption.number_missing,
        type_outlier: userInputOption.type_outlier,
        number_std: userInputOption.number_std,
        number_perc: userInputOption.number_perc,
        type_scaling: userInputOption.type_scaling,

        number_ma: userInputOption.number_ma,
        type_model: userInputOption.type_model,
        number_epoch: userInputOption.number_epoch,
        number_beyssian: userInputOption.number_beyssian,
      }
      // console.log('param:', param)

      const url = process.env.REACT_APP_NEW_API_SERVER_URL + `/api/cor_plot/${userInfo.user_id}`

      // mutate(param)

      //corr plot test
      const param_for_corrplot = {
        user_id: localStorage.getItem('userId'),
        com_id: localStorage.getItem('companyId'),
        ds_id: selectedData.ds_id,
        x_col: '풍량',
        y_col: '산소부화율',
        size_col: corrPlotOption.size_col,
        color_col: corrPlotOption.color_col,
        x_range: corrPlotOption.x_range,
        y_range: corrPlotOption.y_range,
        size_range: corrPlotOption.size_range,
        color_range: corrPlotOption.color_range,
        filter_col: corrPlotOption.filter_range,
        filter_range: corrPlotOption.filter_range,
        date_range: corrPlotOption.date_range,
      }

      axios
        .post(url, param_for_corrplot)
        .then((response) => {
          console.log('api/cor_plot/ response:', response)

          if (response.status === 200) {
            //chart data binding
            // setChartData(dataArr[0])
            setChartData({ ...chartData, corrplot: response.data.cor_plot[0] })
          }
        })
        .catch((error) => console.log('error:', error))

      //json으로 받아오기(corr plot data)
      const url_corr_data = process.env.REACT_APP_NEW_API_SERVER_URL + `/api/send_data/${userInfo.user_id}`
      const param_for_corrplot2 = {
        user_id: localStorage.getItem('userId'),
        com_id: localStorage.getItem('companyId'),
        ds_id: selectedData.ds_id,
      }

      axios
        .post(url_corr_data, param_for_corrplot2)
        .then((response) => {
          if (response.status === 200) {
            const startTime = performance.now()

            console.log('api/cor_plot/ json response:', response)
            const array = response.data
            const columns = Object.keys(array[0])
            const result: { [key: string]: Array<string> } = {}
            // result = {Etime : [], 두께 : [], 원자재_폭: [] }

            //format
            columns.map((column: any) => {
              result[column] = []
            })

            //push items
            array.map((data: any) => {
              columns.forEach((column: any) => {
                result[column].push(data[column])
              })
            })

            const plotResult: { [key: string]: object } = {}
            const tempChartData = [{ mode: 'markers', type: 'scatter', x: result['풍량'], y: result['산소부화율'] }]

            plotResult['data'] = tempChartData
            // plotResult['layout'] = { xaxis: { autorange: true }, yaxis: { autorange: true } }
            console.log('plotResult:', plotResult)
            setChartData({ ...chartData, tempCorr: plotResult })
            const endTime = performance.now() // 측정 종료

            console.log('소요시간:', endTime - startTime)
            ///////////
          }
        })
        .catch((error) => console.log('error:', error))
    }
  }

  const onTabChange = (key: string) => {
    setActiveKey(key)
  }

  const onChangeSelect = (param: any) => {
    // console.log('param:', param)
    // console.log('result:', result)
    setSelectedOption(param)
    setChartData(result[0].preprocessing_graphs.find((x: any) => x.column_name === param))
  }

  return (
    <Container>
      <Row gutter={[24, 16]} style={{ width: '100%' }}>
        <Col span={18}>
          <RoundedBox minHeight={'100%'}>
            <div className="w-100">
              <div>
                <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                  Correlation Plot(data from api response)
                </Title>
                <div className="w-100">
                  <ScatterChart chartData={chartData.corrplot} />
                </div>
              </div>

              {/* <div>
                <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                  Correlation Plot(frontend data handling)
                </Title>
                <div className="w-100">
                  <ScatterChart chartData={chartData.tempCorr} />
                </div>
              </div> */}

              <div>
                <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                  Preprocessing result
                </Title>
                <div style={{ display: 'inline-block', width: '20%' }}>
                  <Select style={{ width: '50%' }} onChange={onChangeSelect} value={selectedOption} options={options} />
                </div>
              </div>
            </div>
            {/* <div className="w-100">
              <ScatterChart chartData={chartData.preprocessing} />
            </div> */}
          </RoundedBox>
        </Col>
        <Col span={6} style={{ height: '670px' }}>
          <RoundedBox minHeight={'100%'}>
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
              <Switch
                checkedChildren="Auto"
                unCheckedChildren="Manual"
                onChange={onSwitchChange}
                defaultChecked={true}
              />
            </div>
            <Tabs
              defaultActiveKey="1"
              onChange={onTabChange}
              activeKey={activeKey}
              size="small"
              style={{ marginBottom: 32 }}
              items={items.map((item, i) => {
                const id = String(i + 1) //array는 0부터 시작하는데 id를 1부터 시작하려고 1 더해줌
                return {
                  label: item.name,
                  key: id,
                  children: item.value,
                  disabled: auto,
                }
              })}
            />
            <div style={{ position: 'absolute', bottom: '5%', width: '80%' }}>
              <Button
                id="design_button"
                style={{
                  backgroundColor: '#4338F7',
                  color: '#fff',
                  borderRadius: '100px',
                  width: '100%',
                  marginTop: '20px',
                }}
                onClick={handleClick}
              >
                RUN
              </Button>
            </div>
          </RoundedBox>
        </Col>
      </Row>
    </Container>
  )
}
export default CustomTools

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

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
`

const LabelBox = styled.div`
  //   text-align: center;
  font-size: 15px;
  color: #002d65;
  font-weight: bold;
`
