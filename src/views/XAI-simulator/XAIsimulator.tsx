import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Button, Col, Row, Tag } from 'antd'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import useModal from 'hooks/useModal'

const XAIsimulator = () => {
  const uuid = sessionStorage.getItem('uuid')

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
    <Box style={{ position: 'relative', zIndex: 1000, backgroundColor: 'yellow', width: '100%', height: '100%' }}>
      <UploadContainer>
        <TextMain>업로드된 데이터가 없습니다.</TextMain>
        <TextSub>분석을 위해 데이터를 업로드하세요.</TextSub>
        <div style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>
          <UploadButton onClick={handleClick}>Data Upload</UploadButton>
        </div>
      </UploadContainer>
      {/* <Container>
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
      </Container> */}
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
