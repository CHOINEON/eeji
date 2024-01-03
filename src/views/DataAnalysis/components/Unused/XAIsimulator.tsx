import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Col, Row, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'

import React, { useEffect, useState } from 'react'
import Global from 'views/XAI-simulator/Global'
import Local from 'views/XAI-simulator/Local'
import PdpResult from 'views/XAI-simulator/PDP'
import InfoCircle from '../Icon/InfoCircle'
import data from '../../../XAI-simulator/data.json'

const XAIsimulator = () => {
  const [globalData, setGlobalData] = useState([])
  const [localData, setLocalData] = useState([])
  const [pdpResult, setPdpResult] = useState({})

  useEffect(() => {
    // fetchXaiResults()

    setGlobalData([{ x: data.columns, y: data.global, type: 'bar' }])
    setLocalData([{ x: data.columns, y: data.global, type: 'bar' }])
    setPdpResult({ name: data.columns, img: data.pdp })
  }, [])

  const fetchXaiResults = () => {
    axios
      .post('http://222.121.66.49:8000/get_xai_results')
      .then((response) => {
        console.log('response:', response)
      })
      .catch((error) => console.log(error))
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      <Container>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <Col span={18}>
            <Row>
              <RoundedBox width={'100%'} height={'400px'}>
                <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                  XAI simulator
                  <InfoCircle content="。。。" />
                </Title>
              </RoundedBox>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={8}>
                <Global data={globalData} />
              </Col>
              <Col span={8}>
                <Local data={localData} />
              </Col>
              <Col span={8}>
                <PdpResult data={pdpResult} />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <RoundedBox height={'780px'}>
              <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                Control panel
                <InfoCircle content="。。。" />
              </Title>
            </RoundedBox>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}></Row>
        <Col span={6}></Col>
      </Container>
    </Box>
  )
}

export default XAIsimulator

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
