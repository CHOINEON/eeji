/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Col, InputNumber, Row, Slider, Card, Statistic } from 'antd'
import CSS from './style.module.css'
import { useRecoilState } from 'recoil'
import { sliderValueState } from '../atom'

const DecimalStep = (props) => {
  const { type, clickedPoint } = props
  const [inputValue, setInputValue] = useState(0)
  const [sliderValue, setSliderValue] = useRecoilState(sliderValueState)
  const [minMax, setminMax] = useState([0, 1])
  const [range, setRange] = useState([])

  useEffect(() => console.log('sliderValue;', sliderValue), [sliderValue])

  useEffect(() => {
    setminMax([clickedPoint?.clickedXvalue, clickedPoint?.clickedYvalue])
  }, [clickedPoint])

  useEffect(() => {
    setRange([minMax[0] * 0.9, minMax[0] * 1.1])
    setInputValue(clickedPoint?.clickedXvalue)
  }, [minMax])

  const onChange = (value) => {
    if (isNaN(value)) {
      return
    }
    // setInputValue(value)
    if (type === 'price') {
      setSliderValue({ ...sliderValue, price: value })
    } else if (type === 'volume') {
      setSliderValue({ ...sliderValue, volume: value })
    }
  }

  return (
    <Row>
      <Col span={22}>
        <Slider
          min={minMax[0] * 0.9}
          max={minMax[0] * 1.1}
          onChange={onChange}
          value={type === 'price' ? sliderValue.price : sliderValue.volume}
          step={0.01}
          defaultValue={minMax[0]}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={minMax[0] * 0.9}
          max={minMax[0] * 1.1}
          style={{
            margin: '16 16px',
          }}
          step={0.01}
          value={type === 'price' ? sliderValue.price : sliderValue.volume}
          onChange={onChange}
        />
      </Col>
    </Row>
  )
}

const FeatureSlider = ({ clickedPoint }) => {
  useEffect(() => {
    console.log('FeatureSlider:', clickedPoint)
  }, [clickedPoint])
  return (
    <div className={CSS.slider}>
      <Card style={{
                height:150,
                responsive: true, 
                useResizeHandler: true, 
                autosize: true, 
                width: '100%' ,
                marginTop : 20  ,
                marginRight : 10,
                
          }}>
        <Statistic  
                value='PRICE SLIDER' 
                valueStyle={{
                        fontWeight:500, 
                        fontSize : 15
                        }}/>
          <DecimalStep clickedPoint={clickedPoint} type="price"></DecimalStep>
      </Card>
     
          {/* <Statistic  
                  value='VOLUME SLIDER' 
                  valueStyle={{
                          fontWeight:500, 
                          fontSize : 15,
                          width : 120
                          }}/>
            <DecimalStep clickedPoint={clickedPoint} type="volume"></DecimalStep> */}
      
    </div>
  )
}

export default FeatureSlider
