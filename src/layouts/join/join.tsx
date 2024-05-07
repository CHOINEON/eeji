import styled from '@emotion/styled'
import React from 'react'
import bg from './img/bg.svg'
import blueicon from './img/blueicon.png'
import copyright from './img/copyright.svg'
import ineeji from './img/ineeji.svg'
import logo from './img/logo.png'
export const Join: React.FC = () => {
  return (
    <Wrapper>
      <Join_Bg />
      <Banner />
      <Ineeji />
      <JoinText>Join</JoinText>
      <Cancle>Cancle</Cancle>

      <FormWrap>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Blueicon />
        </div>

        <Text>관리자 승인 대기중입니다</Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SubText>
            Cloud AI EEJI(데모) 서비스는 회원가입 후 관리자 승인이 필요합니다. 현재 승인절차 진행중입니다.
          </SubText>
        </div>
        <Flex>
          <AddButton>확인</AddButton>
          <AddButton>관리자에게 문의하기</AddButton>
        </Flex>
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
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
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
  top: 25px;
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
  border-radius: 20px;
  top: 286px;
  left: 761px;
  width: 420px;
  padding: 20px;
  height: 310px;
  text-align: center;
`
const Blueicon = styled.div`
  background-image: url(${blueicon});
  background-repeat: no-repeat;
  // background-size: cover;

  top: 389px;
  left: 857px;
  width: 194px;
  height: 25px;

  margin-bottom: 20px;
  margin-top: 20px;
  // border: 1px solid red;
  justify-content: center;
`
const Text = styled.div`
  font-size: 30px;
  color: #4338f7;
  margin-top: 10px;
  margin-bottom: 5px;
`
const SubText = styled.div`
  font-size: 14px;
  font-family: 'Helvetica Neue';
  color: #002d65;
  top: 568px;
  left: 814px;
  width: 295px;
  height: 32px;
  // margin-top: 10px;
  margin-bottom: 60px;
`
const AddButton = styled.button`
  font-family: 'Helvetica Neue';
  font-weight: bold;
  z-index: 99999;
  top: 568px;
  width: 45%;
  height: 46px;
  color: #fff;
  font-size: 14px;
  background: #4338f7;
  border-radius: 9px;
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
