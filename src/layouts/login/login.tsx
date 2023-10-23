/**
 * INFINITE OPTIMAL
 * 메뉴명 : Login
 * 시작 날짜 : 2022-11-24
 * 최종 수정 날짜 : 2022-11-24
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import styled from '@emotion/styled'
import main_bg from './img/bg.jpg'
import main_font from './img/main_font.svg'
import logo from './img/logo.svg'
import circle from './img/package.png'
import bottom_title from './img/bottom_title.png'
import login_icon from './img/login_icon.png'
import date from './img/date.png'
import axios from 'axios'
import { FormControl, FormLabel, Button, Input } from '@chakra-ui/react'
import { Select } from 'antd'
import './style/style.css'
import { Alert } from 'views/hmid/components/Modal/Alert'

import { useRecoilState, useSetRecoilState } from 'recoil'
import * as AlertRecoil from 'views/hmid_config/recoil/config/atoms'

import SidebarBrand from 'components/sidebar/components/Brand'
import { userInfoState } from 'views/DataAnalysis/store/dataset/atom'

axios.defaults.withCredentials = true // withCredentials 전역 설정

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
`
const BgStyle = styled.div`
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% auto;
`

const Home_Bg = styled(BgStyle)`
  background-size: cover;
  background-image: url(${main_bg});
  position: fixed;
  opacity: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: brightness(56%);
`

const FormWrap = styled.div`
  width: 20vw;
  height: 60vh;
  padding: 2vw;
  position: fixed;
  right: 10%;
  top: 52%;
  z-index: 999;
  background-color: #fff;
  border-radius: 15px;
  transform: translateY(-50%);
`

const Title = styled(BgStyle)`
  background-position: left 7vw top 12vw;
  background-size: 20% auto;
  background-image: url(${main_font});
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 999;
`

const Logo = styled(BgStyle)`
  background-image: url(${logo});
  position: fixed;
  // left: 7vw;
  // top: 4vw;
  // width: 9vw;
  // height: 2vw;
  z-index: 999;
`

const BottomBox = styled.div`
  position: fixed;
  left: 7vw;
  bottom: 8vw;
  border-top: 1px solid #fff;
  padding: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  width: 50vw;
`

const Circle = styled(BgStyle)`
  background-image: url(${circle});
  background-size: 88% auto;
  background-position: center top 2vw;
  width: 7vw;
  height: 7.5vw;
`

const TopBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5vw;
  justify-content: space-between;
`

const BottomTitleParent = styled.div`
  width: 45vw;
  margin-left: 3vw;
`

const Date = styled(BgStyle)`
  background-image: url(${date});
  width: 3vw;
  height: 1vw;
`

const BottomTitle = styled(BgStyle)`
  background-image: url(${bottom_title});
  width: 16vw;
  height: 1vw;
  margin-bottom: 1vw;
`

const BottomCotents = styled.div`
  font-size: 0.7vw;
  line-height: 1vw;
  color: #fff;
  @font-face {
    font-family: 'Helvetica Neue';
    src: url('https://fonts.cdnfonts.com/css/helvetica-neue-9');
  }
  font-family: 'Helvetica Neue', sans-serif;
`

const LoginTitle = styled.div`
  font-size: 1.5vw;
  font-weight: 700;
  color: #4338f7;
  margin-bottom: 0.1vw;
  @font-face {
    font-family: 'Helvetica 65 Medium';
    src: url('https://fonts.cdnfonts.com/css/helvetica-neue-9');
  }
  font-family: 'Helvetica 65 Medium', sans-serif;
`

const LoginSubTitle = styled.div`
  font-size: 0.5vw;
  color: #afafaf;
  letter-spacing: 0.05vw;
  margin-bottom: 1vw;
`

const LoginIcon = styled.div`
  background-position: center center;
  background-image: url(${login_icon});
  width: 8vw;
  height: 7vw;
  background-size: 100% auto;
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-bottom: 0.5vw;
`

export const Login: React.FC = () => {
  const [id, setId] = React.useState()
  const [password, setPassword] = React.useState()
  const [company, setCompany] = React.useState<any>('')
  const [companyList, setCompanyList] = React.useState<any>()
  const setShowAlertModal = useSetRecoilState(AlertRecoil.AlertModalState)
  const setAlarmMessage = useSetRecoilState(AlertRecoil.AlertMessageState)

  React.useEffect(() => {
    RenderCompanyList()
  }, [])

  const setLogin = (id: string, password: string) => {
    console.log(company)
    if (company.length === 0 || company === undefined) {
      //setAlarmMessage('회사를 선택 해주세요.')
      //setShowAlertModal(true)
    } else {
      axios
        .get(
          process.env.REACT_APP_API_SERVER_URL +
            '/api/user/info?com_id=' +
            company +
            '&user_id=' +
            id +
            '&user_pass=' +
            password,
          {
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/x-www-form-urlencoded;',
            },
            timeout: 5000,
          }
        )
        .then((response) => {
          getCompanyInfo(company)
          window.localStorage.setItem('userData', JSON.stringify(response.data))
          window.localStorage.setItem('companyId', company)
          window.localStorage.setItem('userId', response.data[0].user_id)
          window.localStorage.setItem('userPosition', response.data[0].user_position)
        })
        .catch((error) => {
          console.log(error.response)
          // error('아이디 또는 비밀번호가 틀립니다.')
        })
    }
  }

  const ChangeId = (e: any) => {
    setId(e.target.value)
  }

  const ChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const onEnterLogin = (e: any) => {
    console.log(e.keyCode)
    if (e.keyCode === 13) {
      setLogin(id, password)
    }
  }

  const onEnterId = (e: any) => {
    if (e.keyCode === 13) {
      setAlarmMessage('패스워드를 입력해주세요.')
      setShowAlertModal(true)
    }
  }

  // 회사 리스트
  function RenderCompanyList() {
    const Arr: any = []
    let Obj: any = new Object()

    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/company', {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ axios response data ] : ')
        // console.log(response.data)

        for (let i = 0, len = response.data.length; i < len; i++) {
          Obj.value = response.data[i].com_id
          Obj.label = response.data[i].com_nm
          Arr.push(Obj)
          Obj = new Object()
        }

        console.log(Arr)
        setCompanyList(Arr)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  //selectbox 변경 이벤트
  const handleChange = (value: string | string[]) => {
    // console.log(`Compnay Selected: ${value}`)
    setCompany(value)
  }

  //회사 정보를 불러오는 함수
  const getCompanyInfo = (companyId: string) => {
    // console.log(companyId)
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/company/info?company_id=' + companyId, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ get Company Info axios response data ] : ')
        console.log(response.data)

        window.localStorage.setItem('company_info', JSON.stringify(response.data[0]))

        window.location.href = '/admin/data-analysis'
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  return (
    <>
      <Wrapper />
      <Home_Bg />
      {/* <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        <Logo />
      </div> */}
      <SidebarBrand />
      <Title />
      <BottomBox>
        <Circle />
        <BottomTitleParent>
          <TopBox>
            <div></div>
            <Date />
          </TopBox>
          <BottomTitle />
          <BottomCotents>
            is Prediction solution for ENERGY SAVING based on time series data that enables companies to realize
            productivity improvement, production energy cost reduction and quality improvement through process
            optimization of industrial processes.
          </BottomCotents>
        </BottomTitleParent>
      </BottomBox>
      <FormWrap>
        <LoginTitle>LOGIN</LoginTitle>
        <LoginSubTitle>Enter Your ID and password to sign in.</LoginSubTitle>
        <LoginIcon />
        <FormControl id="text">
          <Select
            size={'large'}
            placeholder={'Select Company'}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '1vw', border: 0 }}
            options={companyList}
          />
          <Input
            color={'black'}
            type="text"
            placeholder={'ID'}
            onChange={(e: any) => ChangeId(e)}
            onKeyDown={(e: any) => onEnterId(e)}
            style={{ width: '100%', marginBottom: '1vw', backgroundColor: '#f4f7fe', border: 0 }}
          />
          <Input
            color={'black'}
            type="password"
            placeholder={'Password'}
            onChange={(e: any) => ChangePassword(e)}
            onKeyDown={(e: unknown) => onEnterLogin(e)}
            style={{ width: '100%', marginBottom: '1.5vw', backgroundColor: '#f4f7fe', border: 0 }}
          />
        </FormControl>
        <Button
          mt={4}
          type="submit"
          onClick={() => setLogin(id, password)}
          style={{ backgroundColor: '#4338f7', color: '#fff', width: '100%', borderRadius: '7px' }}
        >
          Login
        </Button>
      </FormWrap>
      <Alert />
    </>
  )
}

export default Login
