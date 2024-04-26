import React from 'react'
import styled from '@emotion/styled'
import bg from './img/bg.svg'
import ineeji from './img/ineeji.svg'
import locked from './img/locked.png'
import logo from './img/logo.png'
import copyright from './img/copyright.svg'
export const Join: React.FC = () => {
  return (
    <Wrapper>
      <Join_Bg />
      <Banner>
        <Ineeji />
        <JoinText>Join</JoinText>
        <Cancle>Cancle</Cancle>
      </Banner>
      <FormWrap>
        <Locked />
        <Text>관리자의 승인을 기다리고 있습니다</Text>
        <SubText>원활한 Cloud AI EEJI(데모) 서비스를 이용하기 위해서는 추가 정보가 필요합니다. </SubText>
        <AddButton>추가정보 입력하기</AddButton>
      </FormWrap>
      <BottomLogo />
      <Copy />
    </Wrapper>
  )
}
const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`
const BgStyle = styled.div`
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% auto;
`

const Banner = styled.div`
  top: 0px;
  left: 0px;
  width: 1920px;
  height: 70px;
  background-color: black;
  opacity: 0.22;
  position: absolute;
  z-index: 999;
`
const Join_Bg = styled(BgStyle)`
  background-image: url(${bg});
  position: fixed;
  opacity: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`
const Ineeji = styled.div`
  background-image: url(${ineeji});
  background-repeat: no-repeat;
  background-size: 100% auto;
  position: absolute;
  z-index: 999999;
  top: 22px;
  left: 30px;
  width: 194px;
  height: 25px;
`
const Cancle = styled.button`
  top: 26px;
  left: 1839px;
  width: 56px;
  height: 22px;
  color: #fff;
  font-size: 17px;
  position: absolute;
  z-index: 99999;
`
const JoinText = styled.div`
  color: #fff;
  top: 20px;
  left: 941px;
  width: 40px;
  height: 30px;
  position: absolute;
  font-size: 23px;
`

const FormWrap = styled.div`
  position: absolute;
  z-index: 999;
  background: #fff;
  border-radius: 15px;
  top: 286px;
  left: 761px;
  width: 398px;
  padding: 20px;
  height: 347px;
  text-align: center;
`
const Locked = styled.div`
  background-image: url(${locked});
  background-repeat: no-repeat;
  background-size: 100% auto;
  top: 406px;
  left: 917px;
  width: 86px;
  height: 83px;
  margin-left: 7.5rem;
  margin-bottom: 20px;
  margin-top: 20px;
`
const Text = styled.div`
  font-size: 22px;
  color: #4338f7;
`
const SubText = styled.div`
  font-size: 12px;
  color: #002d65;
  top: 568px;
  left: 814px;
  width: 292px;
  height: 32px;
  //   padding: 10px;
  padding-left: 50px;
  margin-top: 10px;
`
const AddButton = styled.button`
  z-index: 99999;
  top: 568px;
  left: 781px;
  width: 359px;
  height: 46px;
  color: #fff;
  font-size: 14px;
  background: #4338f7;
  border-radius: 9px;
  position: fixed;
`

const BottomLogo = styled.div`
  background-image: url(${logo});
  background-repeat: no-repeat;
  z-index: 999999;
  position: absolute;
  top: 861px;
  left: 869px;
  width: 182px;
  height: 41px;
`

const Copy = styled.div`
  background-image: url(${copyright});
  background-repeat: no-repeat;
  z-index: 999999;
  position: absolute;
  top: 910px;
  left: 869px;
  width: 182px;
  height: 15px;
`

export default Join
