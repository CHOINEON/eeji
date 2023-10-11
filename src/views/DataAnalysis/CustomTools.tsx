import styled from '@emotion/styled'
import { Button, Col, DatePicker, Popover, Row, Tabs, Switch } from 'antd'
import React, { useState } from 'react'
import VariableOption from './components/Option/VariableOption'
import LineChart from './components/Chart/LineChart'
import { useRecoilState, useRecoilValue } from 'recoil'
import { inputOptionListState } from './store/userOption/atom'
import { selectedDataState, userInfoState } from './store/base/atom'
import axios from 'axios'
import PreprocessingOption from './components/Option/PreprocessingOption'
import ModelOption from './components/Option/ModelOption'

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

//데이터, 전처리(알고리즘) , 모델 생성
const CustomTools = () => {
  //, {'Algorithms'}, 'Model'
  const com_id = localStorage.getItem('companyId')
  const user_id = localStorage.getItem('userId')

  const [userInputOption, setUserInputOption] = useRecoilState(inputOptionListState)
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)
  const selectedData = useRecoilValue(selectedDataState)
  const [activeKey, setActiveKey] = useState('1')

  const items = [
    { name: 'Data', value: <VariableOption /> },
    { name: 'Preprocessing', value: <PreprocessingOption /> },
    { name: 'Model', value: <ModelOption /> },
  ]
  const [auto, setAuto] = useState(true)

  const [resultText, setResultText] = useState({ mae: '', rmse: '' })
  const content = (
    <div>
      <p>MAE : {resultText.mae}</p>
      <p>RMSE : {resultText.rmse}</p>
    </div>
  )

  const [chartData, setChartData] = useState({})

  const onSwitchChange = (checked: boolean) => {
    setAuto(checked)
    setActiveKey('1')
  }

  const handleClick = () => {
    if (auto) {
      setUserInputOption({
        ...userInputOption,
        set_auto: true,
        com_id: localStorage.getItem('companyId'),
        user_id: localStorage.getItem('userId'),
        dataset_id: selectedData.id,
      })
    }

    console.log('userInputOption:', userInputOption)

    const param = {
      set_auto: auto,
      user_id: localStorage.getItem('userId'),
      com_id: localStorage.getItem('companyId'),
      dataset_id: selectedData.id,
      start_date: new Date(),
      end_date: new Date(),
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

    const url =
      process.env.REACT_APP_NEW_API_SERVER_URL + `/api/get_model_option/${userInfo.user_id}?user_id=${userInfo.user_id}`

    axios
      .post(url, param)
      .then((response) => {
        console.log('test response:', response)
        if (response.status === 200) {
          alert('success')
        }
      })
      .catch((error) => console.log('error:', error))
  }

  const onTabChange = (key: string) => {
    setActiveKey(key)
  }

  return (
    <Container>
      <Row gutter={[24, 16]} style={{ width: '100%' }}>
        <Col span={18}>
          <RoundedBox minHeight={'80%'}>
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
        <Col span={6} style={{ minHeight: '670px' }}>
          <RoundedBox minHeight={'80%'}>
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
