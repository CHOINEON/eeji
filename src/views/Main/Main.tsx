import styled from '@emotion/styled'
import React from 'react'
import { Box, Wrap } from '@chakra-ui/react'
import { MenuList } from './MenuList'
import cloudAIEEJI from '../../layouts/login/img/Cloud AI EEJI.svg'
const Main = () => {
  return (
    <>
      <Box my="60px">
        <MainTitle>Cloud AI EEJI</MainTitle>
        <SubText>
          is Prediction solution for time series data that enables companies to realize productivity improvement,
        </SubText>
        <SubText>
          production energy cost reduction and quality improvement through process optimization of industrial processes.
        </SubText>
      </Box>
      <Box>
        <IconList />
      </Box>
    </>
  )
}

const IconList = () => {
  return (
    <>
      <Wrap spacing="30px" justify="center" height={200} margin={'15vh 0'}>
        {MenuList.map((item: any) => {
          // console.log('item:', item)
          return (
            <MenuItem key={item.title}>
              <IconContainer onClick={() => (window.location.href = `/admin${item.path}`)}>
                <img src={item.icon_src} style={{ opacity: 1 }} />
              </IconContainer>
              <TitleContainer>
                <Title_EN>{item.title}</Title_EN>
                <Title_KR>{item.title_KR}</Title_KR>
              </TitleContainer>
            </MenuItem>
          )
        })}
      </Wrap>
    </>
  )
}

export default Main

const MainTitle = styled.p`
  font-size: 32px;
  font-family: 'Helvetica Neue';
  text-align: center;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: 1px;
`
const EEJIIcon = styled.div`
  background-image: url(${cloudAIEEJI});
  background-position: center top;
  background-repeat: no-repeat;
  border: 1px solid red;
  top: 176px;
  left: 857px;
  width: 100%;
  height: 38px;
  z-index: 99999;
  // position: absolute;
`

const SubText = styled.p`
  font-family: 'Helvetica Neue';
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  // letter-spacing: 2px;
`

const MenuItem = styled.div`
  width: 210px;
  height: 210px;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.button`
  display: block;
  // width: 200px;
  // height: 200px;
  margin-bottom: 10px;
`
const TitleContainer = styled.div`
  display: block;
  text-align: center;
  margin: 0px 15px;
`

const Title_EN = styled.p`
  font-family: 'ITC Avant Garde Gothic';
  size: 18px;
  color: #ffffff;
  margin: 2px 0;
`

const Title_KR = styled.p`
  font-family: 'Noto Sans';
  size: 12px;
  color: #ffffff;
  margin: 2px 0;
`

// const TextOnCard = styled.div<{ color: string; isSingleLine?: boolean }>`
//   width: 245px;
//   position: absolute;
//   font-family: 'ITC Avant Garde Gothic Pro';
//   top: ${(props) => (props.isSingleLine ? '393px' : '370px')};
//   left: 37.5px;
//   // zindex: 1;
//   font-size: 30px;
//   font-weight: 500;
//   letter-spacing: 2px;
//   // -webkit-text-stroke: 1px ${(props) => props.color};
//   text-shadow: 1px 1px 1px ${(props) => props.color};
//   color: transparent;
//   // color: white;
//   // opacity: 1;
//   text-align: center;
//   @media (max-width: 1400px) {
//     display: none;
//   }
// `

// const SubTextOnCard = styled.div<{ color: string }>`
//   font-family: 'ITC Avant Garde Gothic Pro';
//   position: absolute;
//   width: 100%;
//   bottom: 20px;
//   color: ${(props) => props.color};
//   font-size: 13px;
//   text-align: center;
// `
