import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Button, Col, Row, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'

import React, { MouseEventHandler, useEffect, useState } from 'react'
import Global from 'views/XAI-simulator/Global'
import Local from 'views/XAI-simulator/Local'
import PdpResult from 'views/XAI-simulator/PDP'
import InfoCircle from '../DataAnalysis/components/Icon/InfoCircle'
import data from './data.json'
import ModelImport from '../DataAnalysis/components/Modal/ModelImport'
import useModal from 'hooks/useModal'

const XAIsimulator = () => {
  const { openModal, closeModal } = useModal()

  const modalData = {
    title: 'Data Upload',
    content: 'Modal Content',
    callback: () => alert('modal callback()'),
  }

  const handleClick = () => {
    openModal({
      modalTitle: 'Model Data Import',
      modalType: 'ModelImport',
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  return (
    <Box style={{ position: 'relative', zIndex: 1000 }}>
      <Button onClick={handleClick}>UPLOAD</Button>
      <Container>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <Col span={18}>
            <Row>
              <RoundedBox width={'100%'} height={'80vh'}>
                <Title style={{ color: '#002D65', display: 'inline-block', width: '80%', fontWeight: 400 }}>
                  XAI simulator
                  <InfoCircle content="。。。" />
                </Title>
              </RoundedBox>
            </Row>
          </Col>
          <Col span={6}>
            <RoundedBox height={'80vh'}>
              <Title level={4} style={{ color: '#002D65', display: 'inline-block', width: '80%' }}>
                Feature Importance
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
