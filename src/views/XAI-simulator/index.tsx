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
import FeatureAnalysis from 'views/NewDataAnalysis/FeatureAnalysis'
import GridChart from './Visualization/Classification/AnalysisGrid'

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
    <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
      {/* <UploadContainer>
        <TextMain>업로드된 데이터가 없습니다.</TextMain>
        <TextSub>분석을 위해 데이터를 업로드하세요.</TextSub>
        <div style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>
          <UploadButton onClick={handleClick}>Data Upload</UploadButton>
        </div>
      </UploadContainer> */}
      <Container>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <Title
            style={{
              color: '#002D65',
              display: 'inline-block',
              width: '80%',
              fontWeight: 'bold',
              fontSize: '32px',
              marginLeft: 20,
            }}
          >
            Classification Result
            <InfoCircle content="。。。" />
          </Title>
          <Col span={18}>
            <Row>
              <RoundedBox width={'100%'} height={'70vh'}>
                <GridChart />
              </RoundedBox>
            </Row>
          </Col>
          <Col span={6}>
            <RoundedBox height={'70vh'}>
              {/* <FeatureAnalysis />  안에 컨텐츠만 따로 div에 담도록 모듈 수정해야됨*/}
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

const UploadContainer = styled.div`
  // border: 1px solid red;
  position: absolute;
  width: 400px;
  height: 400px;
  padding: 100px 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`

const TextMain = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 25px;
  text-align: center;
`

const TextSub = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 13px;
  text-align: center;
`

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

const UploadButton = styled.button`
  background-color: #4338f7;
  width: 230px;
  height: 46px;
  border-radius: 10px;
  color: #fff;
  font-family: 'Helvetica Neue';
  font-weight: Bold;
  font-size: 17px;
`
