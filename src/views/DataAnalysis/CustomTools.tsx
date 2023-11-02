import styled from '@emotion/styled'
import { Button, Col, Row, Tabs, Switch, Select, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import VariableOption from './components/Option/VariableOption'
import { useRecoilState, useRecoilValue } from 'recoil'
import { inputCorrPlotOptionState, inputOptionListState } from './store/userOption/atom'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import axios from 'axios'
import PreprocessingOption from './components/Option/PreprocessingOption'
import ModelOption from './components/Option/ModelOption'
import ScatterChart from './components/Chart/ScatterChart'
import Title from 'antd/es/typography/Title'
import ModelApi from 'apis/ModelApi'
import { useMutation, useQueryClient } from 'react-query'
import ScatterPlot from './components/Chart/D3_Scatter/ScatterPlot'
import testData from 'views/DataAnalysis/components/Chart/D3_Scatter/data.json'
import CorrelationView from './CorrelationView'
import LineChart from './components/Chart/LineChart'

//데이터, 전처리(알고리즘) , 모델 생성
const CustomTools = () => {
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const selectedData = useRecoilValue(selectedDataState)
  const [activeKey, setActiveKey] = useState('1')
  const [featureList, setFeatureList] = useState([])

  const items = [
    { name: 'Data', value: <VariableOption /> },
    { name: 'Preprocessing', value: <PreprocessingOption /> },
    { name: 'Model', value: <ModelOption /> },
  ]
  const [auto, setAuto] = useState(true)
  const initialData = {
    preprocessing_graphs: Array<any>(),
    corrplot: Array<unknown>(),
    fig_json_rfr: Array<unknown>(),
    fig_json_rfe: Array<unknown>(),
    fig_json_combine: Array<unknown>(),
    fig_coef_1st_json: Array<unknown>(),
    fig_2nd_coef: Array<unknown>(),
    fig_eval_json: Array<unknown>(),
    fig_test_json: Array<unknown>(),
    lin_pred_fig_json: Array<unknown>(),
    sorted_results_df: Array<unknown>(),
    // best_plot: Array<unknown>(),
  }

  const [data, setData] = useState({
    preprocessing_graphs: [],
    corrplot: [],
    fig_json_rfr: [],
    fig_json_rfe: [],
    fig_json_combine: [],
    fig_coef_1st_json: [],
    fig_2nd_coef: [],
    fig_eval_json: [],
    fig_test_json: [],
    lin_pred_fig_json: [],
    sorted_results_df: [],
    // best_plot: [],
  })

  const [corrplotData, setCorrplotData] = useState([])
  const [chartData, setChartData] = useState({
    preprocessing_graphs: [],
    corrplot: [],
    fig_json_rfr: [],
    fig_json_rfe: [],
    fig_json_combine: [],
    fig_coef_1st_json: [],
    fig_2nd_coef: [],
    fig_eval_json: [],
    fig_test_json: [],
    lin_pred_fig_json: [],
    sorted_results_df: [],
  }) //차트 바인딩용

  const [columns, setColumns] = useState([])

  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState()
  const [controller, setController] = useState<any>()

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

  // useEffect(() => console.log('chartData:', chartData), [chartData])

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      // console.log('mutate result:', result)

      setData({
        preprocessing_graphs: result['preprocessing_graphs'],
        corrplot: result['result_df'],
        fig_json_rfr: JSON.parse(result['fig_json_rfr']),
        fig_json_rfe: JSON.parse(result['fig_json_rfe']),
        fig_json_combine: JSON.parse(result['fig_json_combine']),
        fig_coef_1st_json: JSON.parse(result['fig_coef_1st_json']),
        fig_2nd_coef: JSON.parse(result['fig_2nd_coef']),
        fig_eval_json: JSON.parse(result['fig_eval_json']),
        fig_test_json: JSON.parse(result['fig_test_json']),
        lin_pred_fig_json: JSON.parse(result['lin_pred_fig_json']),
        sorted_results_df: JSON.parse(result['sorted_results_df']),
        // best_plot: JSON.parse(result['bestplot']),
      })

      // setCorrplotData(result['result_df'])

      setChartData({
        preprocessing_graphs: result['preprocessing_graphs'][0],
        corrplot: result['result_df'],
        fig_json_rfr: JSON.parse(result['fig_json_rfr']),
        fig_json_rfe: JSON.parse(result['fig_json_rfe']),
        fig_json_combine: JSON.parse(result['fig_json_combine']),
        fig_coef_1st_json: JSON.parse(result['fig_coef_1st_json']),
        fig_2nd_coef: JSON.parse(result['fig_2nd_coef']),
        fig_eval_json: JSON.parse(result['fig_eval_json']),
        fig_test_json: JSON.parse(result['fig_test_json']),
        lin_pred_fig_json: JSON.parse(result['lin_pred_fig_json']),
        sorted_results_df: [],
        // best_plot: JSON.parse(result['bestplot']),
      })

      formattingPreprocess(result['preprocessing_graphs'])
      formattingTableData(JSON.parse(result['sorted_results_df']))
    },
    onError: (error: any) => {
      if (error.message === 'canceled') {
        alert('request canceled')
      } else {
        console.error(error)
      }
    },
  })

  useEffect(() => {
    const param = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
      ds_id: selectedData.ds_id,
    }
    axios.post(process.env.REACT_APP_NEW_API_SERVER_URL + '/api/send_data/admin', param).then((response) => {
      if (response.status === 200) {
        console.log('send_data/admin resp::', response.data.data)
        setCorrplotData(response.data.data)
      }
    })
  }, [])

  const onSwitchChange = (checked: boolean) => {
    setAuto(checked)
    setActiveKey('1')
  }

  function formattingPreprocess(dataArr: any) {
    setOptions([])

    //formatting
    const selectList = dataArr.map((x: any) => x.column_name)
    // console.log('selectList:', selectList)

    selectList.forEach((element: any) => {
      const obj = { value: '', label: '' }
      obj['value'] = element
      obj['label'] = element
      setOptions((prev) => [...prev, obj])
    })

    //select box binding
    setSelectedOption(selectList[0])

    //passing the initial data to chart  //////side effect : setChartData 다시 호출됨
    // onChangeSelect(selectList[0])
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
    setChartData({ ...chartData, sorted_results_df: newArr })
  }

  const resetChartData = useCallback(() => {
    setChartData(initialData)
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

    //initialize
    // resetChartData()

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

  const onChangeSelect = (param: any) => {
    setSelectedOption(param)
    setChartData({
      ...chartData,
      preprocessing_graphs: data.preprocessing_graphs.find((x: any) => x.column_name === param),
    })
  }

  const onHandleCancel = () => {
    const type = 'cancel'
    mutateRunning({ type, controller })
  }

  const renderCharts = () => {
    return Object.entries(data).map((dataArr: any, index: number) => {
      // console.log('dataArr:', dataArr)
      const title = dataArr[0]
      const data = dataArr[1]
      const filterArr = ['preprocessing_graphs', 'corrplot', 'sorted_results_df']

      return (
        <div key={index}>
          <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
            {title}
          </Title>
          {/* {title === 'corrplot' && <CorrelationView data={corrplotData} options={options} />} */}

          {title === 'preprocessing_graphs' && (
            <>
              <div style={{ display: 'inline-block', width: '20%' }}>
                <Select style={{ width: '50%' }} onChange={onChangeSelect} value={selectedOption} options={options} />
              </div>
              <div className="w-100">
                <LineChart chartData={chartData.preprocessing_graphs} />
              </div>
            </>
          )}
          {title === 'sorted_results_df' && columns && (
            <Table dataSource={chartData?.sorted_results_df} columns={columns} size="small" />
          )}
          {!filterArr.includes(title) && (
            <div className="w-100">
              <LineChart chartData={data} />
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <Container>
      <Row gutter={[24, 16]} style={{ width: '100%' }}>
        <Col span={18}>
          <RoundedBox minHeight={'100%'}>
            <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
              Correlation Plot
            </Title>
            <CorrelationView data={corrplotData} options={options} />

            {data.corrplot.length > 0 && renderCharts()}
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
              {/* <Button
                id="design_button"
                onClick={onHandleCancel}
                style={{
                  // backgroundColor: '#4338F7',
                  // color: '#fff',
                  borderRadius: '100px',
                  width: '100%',
                  marginTop: '20px',
                }}
              >
                request cancel(테스트중)
              </Button> */}
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
