import styled from '@emotion/styled'
import { Button, Col, Row, Tabs, Switch, Select, Table, Divider } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import VariableOption from '../Option/VariableOption'
import { useRecoilState, useRecoilValue } from 'recoil'
import { inputCorrPlotOptionState, inputOptionListState } from '../../store/userOption/atom'
import { selectedDataState } from '../../store/dataset/atom'
import PreprocessingOption from '../Option/PreprocessingOption'
import ModelOption from '../Option/ModelOption'
import ModelApi from 'apis/ModelApi'
import { useMutation } from 'react-query'
import CorrelationView from './CorrelationView'
import ModelTrainingResult from './ModelTrainingResult'
import PredictionResult from '../../PredictionResult'
import FeatureImportance from '../../FeatureImportance'
import RegressionCoefficient from './RegressionCoefficient'
import DataAnalyzeApi from 'apis/DataAnalyzeApi'
import BaysesianOptimization from './BaysesianOptimization'
import PreprocessingResult from './PreprocessingResult'
import ReactToPrint, { useReactToPrint } from 'react-to-print'

//데이터, 전처리(알고리즘) , 모델 생성
const CustomTools = () => {
  const componentRef = useRef()
  const preprocessingRef = useRef()

  const [refList, setRefList] = useState([])
  const corrPlotRef = useRef(null)
  const [content, setContent] = useState()

  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const selectedData = useRecoilValue(selectedDataState)
  const [activeKey, setActiveKey] = useState('1')
  const [featureList, setFeatureList] = useState({})

  const items = [
    { name: 'Data', value: <VariableOption /> },
    { name: 'Preprocessing', value: <PreprocessingOption /> },
    { name: 'Model', value: <ModelOption /> },
  ]
  const [auto, setAuto] = useState(true)
  const initialData = {
    // preprocessing_graphs: Array<any>(),
    // corrplot: Array<unknown>(),
    fig_json_rfr: Array<unknown>(),
    fig_json_rfe: Array<unknown>(),
    fig_json_combine: Array<unknown>(),
    fig_coef_1st_json: Array<unknown>(),
    fig_2nd_coef: Array<unknown>(),
    fig_eval_json: Array<unknown>(),
    fig_test_json: Array<unknown>(),
    lin_pred_fig_json: Array<unknown>(),
    // sorted_results_df: Array<unknown>(),
    // best_plot: Array<unknown>(),
  }

  // const [data, setData] = useState({
  //   // preprocessing_graphs: [],
  //   // corrplot: [],
  //   fig_json_rfr: [],
  //   fig_json_rfe: [],
  //   fig_json_combine: [],
  //   fig_coef_1st_json: [],
  //   fig_2nd_coef: [],
  //   fig_eval_json: [],
  //   fig_test_json: [],
  //   lin_pred_fig_json: [],
  //   // sorted_results_df: [],
  //   // best_plot: {},
  // })

  //일회성 렌더링이 일어나는 데이터와 사용자 조작에 의해 변하는 데이터를 분리조치(11.03)
  const [preprocessingData, setPreprocessingData] = useState([])
  const [corrplotData, setCorrplotData] = useState([])
  const [tableData, setTableData] = useState([])
  const [modelResult, setModelResult] = useState({})

  const [columns, setColumns] = useState([])

  const [options, setOptions] = useState([])
  const [modelOptions, setModelOptions] = useState([])

  const [selectedOption, setSelectedOption] = useState({ preprocessing: '', bestplot: '' })
  const [controller, setController] = useState<any>()

  const [featureImportanceData, setFeatureImportanceData] = useState({})
  const [regressionCoefData, setRegressionCoefData] = useState({})
  const [predictionData, setPredictionData] = useState({})

  // useEffect(() => {
  //   const ws = new WebSocket('ws://34.64.39.165:8000/ws/train_model')
  //   ws.onopen = () => {
  //     console.log(`WebSocket connection`)
  //   }
  //   /*parsing the incoming data*/
  //   ws.onmessage = (message) => {
  //     console.log('message:', message)
  //   }
  //   ws.onclose = (event) => {
  //     if (event.wasClean) {
  //       console.log(`WebSocket connection closed unexpectedly`)
  //     } else {
  //       console.log('WebSocket connection closed')
  //     }
  //   }
  //   return () => {
  //     ws.close()
  //   }
  // }, [])

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

  function formatterForBestPlot(plotData: any) {
    // console.log('formatterForBestPlot:', plotData)
    setModelOptions([])

    const columns = Object.keys(plotData) //[CNN1D, LSTM, MLP]
    const result: { [key: string]: Array<string> } = {}

    columns.map((column: string) => {
      //{CNN1D: {}, LSTM: {}, MLP:{} }
      result[column] = JSON.parse(plotData[column])
    })
    setModelResult(result)
  }

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      console.log('mutate result:', result)

      setFeatureImportanceData({
        fig_json_rfr: JSON.parse(result['fig_json_rfr']),
        fig_json_rfe: JSON.parse(result['fig_json_rfe']),
        fig_json_combine: JSON.parse(result['fig_json_combine']),
      })

      setRegressionCoefData({
        fig_coef_1st_json: JSON.parse(result['fig_coef_1st_json']),
        fig_2nd_coef: JSON.parse(result['fig_2nd_coef']),
      })

      setPredictionData({
        lin_pred_fig_json: JSON.parse(result['lin_pred_fig_json']),
        fig_eval_json: JSON.parse(result['fig_eval_json']),
        fig_test_json: JSON.parse(result['fig_test_json']),
      })

      formatterForBestPlot(result['best_plot'])
      formattingTableData(JSON.parse(result['sorted_results_df']))
      // formattingPreprocess(result['preprocessing_graphs'])

      //save data
      setPreprocessingData(result['preprocessing_graphs'])
    },
    onError: (error: any) => {
      if (error.message === 'canceled') {
        alert('request canceled')
      } else {
        console.error(error)
      }
    },
  })

  const { mutate: mutateCorrplot } = useMutation(DataAnalyzeApi.postCorrData, {
    onSuccess: (result: any) => {
      setCorrplotData(result.data)
    },
    onError: (error: any) => {
      // alert(error)
    },
  })

  useEffect(() => {
    const param = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      ds_id: selectedData.ds_id,
    }

    mutateCorrplot(param)
  }, [])

  // useEffect(() => {
  //   const param = {
  //     com_id: localStorage.getItem('companyId'),
  //     user_id: localStorage.getItem('userId'),
  //     ds_id: selectedData.ds_id,
  //   }
  //   axios.post(process.env.REACT_APP_NEW_API_SERVER_URL + '/api/send_data/admin', param).then((response) => {
  //     if (response.status === 200) {
  //       // console.log('send_data/admin resp::', response.data.data)
  //       setCorrplotData(response.data.data)
  //     }
  //   })
  // }, [])

  const onSwitchChange = (checked: boolean) => {
    setAuto(checked)
    setActiveKey('1')
  }

  function formattingPreprocess(dataArr: any) {
    setOptions([])

    //formatting
    const selectList = dataArr.map((x: any) => x.column_name)
    selectList.forEach((element: any) => {
      const obj = { value: '', label: '' }
      obj['value'] = element
      obj['label'] = element
      setOptions((prev) => [...prev, obj])
    })

    //select box binding
    setSelectedOption({ ...selectedOption, preprocessing: selectList[0] })
  }

  function formattingTableData(data: any) {
    // console.log('data:', data)

    //컬럼 포맷팅
    const colNames = Object.keys(data)
    const columnList: Array<any> = []
    colNames.map((name: string) => {
      const col = { title: name, dataIndex: name, key: name, responsive: ['md'] }
      columnList.push(col)
    })

    setColumns(columnList)

    //데이터소스 포맷팅
    const newArr = []
    for (let i = 0; i < Object.keys(data?.['model']).length; i++) {
      const innerObj = {}
      for (const column of colNames) {
        const newKeyValue = { [column]: data[column][i] }
        Object.assign(innerObj, newKeyValue) //새로 생성된 key:value 값
      }
      newArr.push(innerObj)
    }
    setTableData(newArr)
    // setChartData({ ...chartData, sorted_results_df: newArr })
  }

  // const resetData = useCallback(() => {
  //   setData(initialData)
  // }, [])

  const handlePrintClick = () => {
    handlePrint()
  }

  //TODO: print pdf
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Data Analysis Report',
  })

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

    //initialize
    // resetData()

    //TODO: Feature 선택 안 한 경우 API요청으로 넘어가지 않음
    if (userInputOption.x_value.length === 0 || userInputOption.y_value.length === 0) {
      alert('선택 안함')
    } else {
      const payload = {
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
      const controller = new AbortController()
      setController(controller)
      mutateRunning({ type: 'request', payload, controller })
    }
  }

  const onTabChange = (key: string) => {
    setActiveKey(key)
  }

  const onHandleCancel = () => {
    const type = 'cancel'
    mutateRunning({ type, controller })
  }

  return (
    <Container ref={componentRef}>
      <Row gutter={[24, 16]}>
        <Col span={18}> {<PredictionResult data={predictionData} />}</Col>
        <Col span={6}>
          {' '}
          <RoundedBox style={{ height: '635px', width: '350px' }}>
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
            {/* <div>
              <Button onClick={handlePrintClick} icon={<PrinterOutlined />}>
                {' '}
                Print
              </Button>
            </div> */}
          </RoundedBox>
        </Col>
        <Divider orientation="left"></Divider>

        <Col span={24}>
          <RoundedBox style={{ height: '600px' }}>
            {corrplotData && <CorrelationView data={corrplotData} options={options} />}
          </RoundedBox>
        </Col>
        <Col span={10}>{preprocessingData?.length > 0 && <PreprocessingResult data={preprocessingData} />}</Col>
        <Col span={7} style={{ height: '437px' }}>
          {Object.keys(featureImportanceData).length > 0 && <FeatureImportance data={featureImportanceData} />}
        </Col>
        <Col span={7}>
          {Object.keys(regressionCoefData).length > 0 && <RegressionCoefficient data={regressionCoefData} />}
        </Col>
        <Col span={11}>
          {tableData.length > 0 && <BaysesianOptimization data={tableData} columns={columns} size="small" />}
        </Col>
        <Col span={13}>
          {Object.keys(modelResult).length > 0 && <ModelTrainingResult type="modelResult" data={modelResult} />}
        </Col>
        <Divider orientation="left"></Divider>
      </Row>

      {/* <Row>
        {Object.keys(modelResult).length > 0 && (
          <ModelTrainingResult type="modelResult" data={modelResult} options={modelOptions} />
          // <RoundedBox minHeight={'100%'}>
          //   <DynamicRenderChart type="modelResult" data={modelResult} options={modelOptions} />
          // </RoundedBox>
        )}
      </Row>
      <Row>
        {tableData.length > 0 && (
          <PredictionResult data={tableData} columns={columns} size="small" />
          // <RoundedBox minHeight={'100%'}>
          //   <Table dataSource={tableData} columns={columns} size="small" />
          // </RoundedBox>
        )}
      </Row>
      {Object.keys(data.fig_2nd_coef).length > 0 && renderCharts()} */}
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
