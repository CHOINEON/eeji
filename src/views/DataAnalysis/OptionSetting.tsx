import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  Skeleton,
  Switch,
} from 'antd'
import styled from '@emotion/styled'
import NewTagSelect from './components/TagTree/NewTagSelect'
import { Box } from '@chakra-ui/react'
import LineChart from './components/Chart/LineChart'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { dataFileStore } from './store/atom'
import VariableOption from './components/Option/VariableOption'
import PreprocessingOption from './components/Option/PreprocessingOption'
import ModelOption from './components/Option/ModelOption'
import { inputOptionListState } from './store/userOption/atom'
import { selectedDataState, userInfoState } from './store/base/atom'
import axios from 'axios'

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
  padding: 1vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`
const LabelBox = styled.div`
  //   text-align: center;
  // font-size: 15px;
  // color: #002d65;
  // font-weight: bold;
`

//사용자가 모델 선택을 pls, rf => epoch은 비활성화

const OptionSetting = () => {
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')

  const [auto, setAuto] = useState(true)
  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)
  const selectedData = useRecoilValue(selectedDataState)

  const [defaultActiveKey, setdefaultActiveKey] = useState(['1'])
  const setSelectedDataFile = useSetRecoilState(dataFileStore)

  const onChangeMissingValue = (param: any) => {
    console.log('param:', param)
  }

  const [resultText, setResultText] = useState({ mae: '', rmse: '' })
  const content = (
    <div>
      <p>MAE : {resultText.mae}</p>
      <p>RMSE : {resultText.rmse}</p>
    </div>
  )

  const [chartData, setChartData] = useState({})

  const onChange = (checked: boolean) => {
    setAuto(checked)
    console.log('chek:', checked)
  }

  const handleClick = () => {
    if (auto) {
      setUserInputOption({
        ...userInputOption,
        set_auto: true,
        com_id: com_id,
        user_id: user_id,
        dataset_id: selectedData.id,
      })
    }

    const url =
      process.env.REACT_APP_API_SERVER_URL + `/api/get_model_option/${userInfo.user_id}?user_id=${userInfo.user_id}`

    // param.y_value = param.y_value[0]
    // console.log('test param:', param)
    axios
      .post(url, userInputOption)
      .then((response) => {
        console.log('test response:', response)
      })
      .catch((error) => console.log('error:', error))
    // console.log('userInputOption:', userInputOption)
  }
  return (
    <Container>
      <Row gutter={[24, 16]} style={{ width: '100%' }}>
        <Col span={18}>
          <RoundedBox minHeight={'100%'}>
            <div className="w-100">
              <Popover placement="rightTop" title="평가 지표" content={content}>
                <Button>평가 지표</Button>
              </Popover>
            </div>
            <div className="w-100">
              <LineChart chartData={chartData} />
            </div>
          </RoundedBox>
        </Col>
        <Col span={6}>
          <RoundedBox minHeight={'100%'}>
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
              <Switch defaultChecked checkedChildren="Auto" unCheckedChildren="Manual" onChange={onChange} />
            </div>
            {/* <Collapse ghost items={items} defaultActiveKey={['1']} size="small" /> */}
            <VariableOption />
            <PreprocessingOption />
            <ModelOption />
            <Row>
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
            </Row>
          </RoundedBox>
        </Col>
      </Row>
    </Container>
  )
}

export default OptionSetting
