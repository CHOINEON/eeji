/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Col, InputNumber, Row, Slider, Card, Statistic, Button } from 'antd'
import CSS from './style.module.css'
import { useRecoilState } from 'recoil'
import { ThreValueState } from '../atom'

const DecimalStep = (props) => {
  const { currentThr } = props
  const [inputValue, setInputValue] = useState(0)
  const [thrValu, setThrVal] = useRecoilState(ThreValueState)
  const [minMax, setminMax] = useState([0, 1])

  useEffect(() => {
    setminMax([currentThr * 0.2, currentThr * 2])
  }, [currentThr])

  useEffect(() => {
    // setRange([minMax * 0.9, minMax * 1.1])
    // setInputValue(currentThr)
  }, [minMax])

  const ThrSend = () => {
    const secURL = 'http://34.64.217.237:9001/set_thr'
    const response = fetch(secURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thr: inputValue }),
    })
    const result = response
    console.log(result, '20231024')
  }
  const onChange = (value) => {
    if (isNaN(value)) {
      return
    }
    if (currentThr) {
      console.log('value:', value)
      setInputValue(value)
      setThrVal(value)
    }
  }
  return (
    <Row>
      <Col span={22}>
        <Slider
          defaultValue={minMax[0]}
          min={minMax[0] * 0.9}
          max={minMax[1] * 1.1}
          onChange={onChange}
          value={thrValu}
          step={0.01}
          style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}
        />
      </Col>
      {/* <Col span={4}>
        <Space direction="Horizontal"> */}
      {/* <InputNumber
            min={minMax[0] * 0.9}
            max={minMax[1] * 1.1}
            style={{
              margin: '16 16px',
            }}
            step={0.01}
            value={inputValue}
            onChange={onChange}
          /> */}
      <Button
        onClick={ThrSend}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          background: '#4338F7',
          color: '#fff',
        }}
      >
        {' '}
        SUBMIT
      </Button>
      {/* </Space> */}
      {/* </Col> */}
    </Row>
  )
}
const ThreSlider = ({ currentThr }) => {
  return (
    <div className={CSS.slider}>
      <DecimalStep currentThr={currentThr} style={{ marginLeft: '10px', width: '100%' }}></DecimalStep>
    </div>
  )
}

export default ThreSlider
