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
            <TextOnCard color="#FFFFFF">Data Analysis</TextOnCard>
          </Card>
          <Card image={XaiImg}>
            <TextOnCard color="#002D65">XAI</TextOnCard>
          </Card>
          <Card image={PriceForecastingImg} onClick={() => (window.location.href = '/admin/price-forecasting')}>
            <TextOnCard color="#FFFFFF">지수 예측</TextOnCard>
          </Card>
          <Card image={ApiImg}>
            <TextOnCard color="#FFFFFF">온라인 예측</TextOnCard>
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

const TextOnCard = styled.span<{ color: string }>`
  width: 245px;
  position: absolute;
  font-family: 'ITC Avant Garde Gothic Pro';
  top: 400px;
  left: 2vw;
  zindex: 1;
  font-size: 30px;
  font-weight: 100;
  letter-spacing: 2px;
  -webkit-text-stroke: 1px ${(props) => props.color};
  // text-shadow: 1px 1px 1px ${(props) => props.color};
  color: transparent;
  // color: white;
  // opacity: 1;
`
