import styled from '@emotion/styled'
import React from 'react'
import DataAnalysisImg from 'assets/img/icons/DataAnalysis.jpg'
import XaiImg from 'assets/img/icons/Xai.jpg'
import PriceForecastingImg from 'assets/img/icons/PriceForecasting.jpg'
import ApiImg from 'assets/img/icons/Api.jpg'
import { Box, Center, Container, HStack, Link } from '@chakra-ui/react'

const Main = () => {
  return (
    <>
      <Box mb="50px">
        <MainTitle>INEEJI’s INFINITE OPTIMAL SERIES™</MainTitle>
        <SubText>
          is Prediction solution for ENERGY SAVING based on time series data that enables companies to realize
          productivity improvement,
        </SubText>
        <SubText>
          production energy cost reduction, and quality improvement through process optimization of industrial
          processes.
        </SubText>
      </Box>
      <div>
        <CardList />
      </div>
    </>
  )
}

const CardList = () => {
  return (
    <>
      <Center>
        <HStack spacing="30" alignContent={'center'}>
          <Card image={DataAnalysisImg} onClick={() => (window.location.href = '/admin/data-analysis')}>
            <TextOnCard color="#FFFFFF">AI Model Generator</TextOnCard>
            <SubTextOnCard color="#FFFFFF">AI 모델 생성</SubTextOnCard>
          </Card>
          <Card image={XaiImg} onClick={() => alert('준비 중인 서비스입니다')}>
            <TextOnCard color="#002D65" isSingleLine={true}>
              Explainable AI
            </TextOnCard>
            <SubTextOnCard color="#002D65">설명가능 인공지능</SubTextOnCard>
          </Card>
          <Card image={PriceForecastingImg} onClick={() => (window.location.href = '/admin/price-forecast')}>
            <TextOnCard color="#FFFFFF">Commodity Index Forecast</TextOnCard>
            <SubTextOnCard color="#002D65">주요 지표 예측</SubTextOnCard>
          </Card>
          <Card image={ApiImg} onClick={() => alert('준비 중인 서비스입니다')}>
            <TextOnCard color="#FFFFFF" isSingleLine={true}>
              Prediction API
            </TextOnCard>
            <SubTextOnCard color="#FFFFFF">REST API 서비스</SubTextOnCard>
          </Card>
        </HStack>
      </Center>
    </>
  )
}

export default Main

const MainTitle = styled.p`
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
`

const SubText = styled.p`
  font-size: 15px;
  text-align: center;
  color: #ffffff;
`

const Card = styled.button<{ image: any }>`
  position: relative;
  width: 320px;
  height: 510px;
  background-image: url(${(props) => props.image});
  border-radius: 30px;
`

const TextOnCard = styled.div<{ color: string; isSingleLine?: boolean }>`
  width: 245px;
  position: absolute;
  font-family: 'ITC Avant Garde Gothic Pro';
  top: ${(props) => (props.isSingleLine ? '393px' : '370px')};
  left: 37.5px;
  // zindex: 1;
  font-size: 30px;
  font-weight: 300;
  letter-spacing: 2px;
  // -webkit-text-stroke: 1px ${(props) => props.color};
  text-shadow: 1px 1px 1px ${(props) => props.color};
  color: transparent;
  // color: white;
  // opacity: 1;
`

const SubTextOnCard = styled.div<{ color: string }>`
  font-family: 'ITC Avant Garde Gothic Pro';
  position: absolute;
  width: 100%;
  bottom: 20px;
  color: ${(props) => props.color};
  text-align: center;
`
