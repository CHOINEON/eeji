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
import logo from 'assets/img/ineeji/logo_wh.svg'
import circle from './img/package.png'
import bottom_title from './img/bottom_title.png'
import login_icon from './img/login_icon.png'
import date from './img/date.png'
import axios from 'axios'
import { FormControl, FormLabel, Button, Input } from '@chakra-ui/react'
import { message, Select } from 'antd'
import './style/style.css'
import { Alert } from 'views/hmid/components/Modal/Alert'

import { useRecoilState, useSetRecoilState } from 'recoil'
import * as AlertRecoil from 'views/hmid_config/recoil/config/atoms'

import SidebarBrand from 'components/sidebar/components/Brand'
import { userInfoState } from 'views/DataAnalysis/store/dataset/atom'
import GoogleSignin from './components/GoogleSigninBtn'
import AvailableServiceIcon from './components/AvailableServiceIcon'

axios.defaults.withCredentials = true // withCredentials 전역 설정

export const Login: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [id, setId] = React.useState()
  const [password, setPassword] = React.useState()
  const [company, setCompany] = React.useState<any>('')
  const [companyList, setCompanyList] = React.useState<any>()
  const setShowAlertModal = useSetRecoilState(AlertRecoil.AlertModalState)
  const setAlarmMessage = useSetRecoilState(AlertRecoil.AlertMessageState)

  React.useEffect(() => {
    RenderCompanyList()

    //로그인 후 redirect된 URL에서 구글 인가코드 추출하여 백엔드로 전달하여 token발급받음
    const params = new URLSearchParams(window.location.search)
    console.log('URL search params:', params)
    const code = params.get('code')

    if (code) {
      axios
        .post(process.env.REACT_APP_NEW_API_SERVER_URL + '/login/google', { code })
        .then((response) => {
          console.log('response: ', response.data)
          if (response.data.user_info) {
            //로그인 상태 확인되면 localStorage에 user정보 저장 ->  datasetList 페이지로 redirect
            localStorage.setItem('userId', response.data.user_info.email)
            localStorage.setItem('userData', JSON.stringify(response.data.user_info))

            localStorage.setItem('userPicture', response.data.user_info.picture)

            // setIsAuthenticated(true)
            // window.location.href = '/admin/data-analysis'
          }
        })
        .catch((error) => {
          console.log('error: ' + error)
        })
    }
  }, [])

  const setLogin = (id: string, password: string) => {
    // console.log(company)
    if (company.length === 0 || company === undefined) {
      messageApi.open({
        type: 'error',
        content: '회사를 선택해주세요',
      })
      //setAlarmMessage('회사를 선택 해주세요.')
      //setShowAlertModal(true)
    } else {
      axios
        .get(
          process.env.REACT_APP_NEW_API_SERVER_URL +
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
          // getCompanyInfo(company)
          window.localStorage.setItem('userData', JSON.stringify(response.data))
          window.localStorage.setItem('companyId', company)
          window.localStorage.setItem('userId', response.data[0].user_id)
          window.localStorage.setItem('userPosition', response.data[0].user_position)
          window.location.href = '/admin/main'
        })
        .catch((error) => {
          console.log(error)
          messageApi.open({
            type: 'error',
            content: error.response?.data.detail,
          })
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
    if (e.keyCode === 13) {
      setLogin(id, password)
    }
  }

  const onEnterId = (e: any) => {
    //Need validation of id/pw value
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
      .get(process.env.REACT_APP_NEW_API_SERVER_URL + '/api/company', {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        // console.log('/api/company resp:', response.data)

        for (let i = 0, len = response.data.length; i < len; i++) {
          Obj.value = response.data[i].com_id
          Obj.label = response.data[i].com_nm
          Arr.push(Obj)
          Obj = new Object()
        }

        // console.log('company List::',Arr)
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

  // //회사 정보를 불러오는 함수
  // const getCompanyInfo = (companyId: string) => {
  //   // console.log(companyId)
  //   axios
  //     .get(process.env.REACT_APP_API_SERVER_URL + '/api/hmid/company/info?company_id=' + companyId, {
  //       headers: {
  //         Accept: '*/*',
  //         'Content-Type': 'application/x-www-form-urlencoded;',
  //       },
  //       timeout: 5000,
  //     })
  //     .then((response) => {
  //       console.log('[ get Company Info axios response data ] : ')
  //       console.log(response.data)

  //       window.localStorage.setItem('company_info', JSON.stringify(response.data[0]))
  //       window.location.href = '/admin/data-analysis'
  //     })
  //     .catch((error) => {
  //       console.log(error.response)
  //     })
  // }

  return (
    <>
      {contextHolder}
      <Wrapper />
      <Home_Bg />
      <Logo />
      <SidebarBrand />
      <Title />
      <BottomBox>
        <Circle />
        <BottomTitleParent>
          <BottomTitle />
          <BottomCotents>
            is Prediction solution for ENERGY SAVING based on time series data that enables companies to realize
            productivity improvement, production energy cost reduction and quality improvement through process
            optimization of industrial processes.
          </BottomCotents>
        </BottomTitleParent>
        <AvailableServiceIcon />
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
            style={{ width: '100%', marginBottom: '1.5vh', border: 0 }}
            options={companyList}
          />
          <Input
            color={'black'}
            type="text"
            placeholder={'ID'}
            onChange={(e: any) => ChangeId(e)}
            // onKeyDown={(e: any) => onEnterId(e)}
            style={{ width: '100%', marginBottom: '1.5vh', backgroundColor: '#F5F8FF', border: '1px solid #A3AFCF' }}
          />
          <Input
            color={'black'}
            type="password"
            placeholder={'Password'}
            onChange={(e: any) => ChangePassword(e)}
            onKeyDown={(e: unknown) => onEnterLogin(e)}
            style={{ width: '100%', marginBottom: '1.5vh', backgroundColor: '#F5F8FF', border: '1px solid #A3AFCF' }}
          />
        </FormControl>
        <Button
          // mt={4}
          type="submit"
          onClick={() => setLogin(id, password)}
          style={{
            fontFamily: 'Noto Sans',
            backgroundColor: '#4338f7',
            color: '#fff',
            width: '100%',
            borderRadius: '7px',
          }}
        >
          Login
        </Button>
        <div style={{ marginTop: '29px', textAlign: 'center' }}>
          <GoogleSignin />
        </div>
      </FormWrap>
      <Alert />
    </>
  )
}

export default Login

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
  // background-size: cover;
  // background-image: url(${main_bg});
  // filter: brightness(56%);
  background-color: #4338f7;
  position: fixed;
  opacity: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const FormWrap = styled.div`
  // min-width: 250px;
  // height: 65vh;
  width: 20vw;
  padding: 2vw;
  position: fixed;
  right: 6vw;
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
  width: 11vw;
  height: 2vw;
  left: 7vw;
  top: 4vw;
  // width: 9vw;
  // height: 2vw;
  z-index: 999;
`

const BottomBox = styled.div`
  position: fixed;
  left: 7vw;
  bottom: 2vw;
  border-top: 1px solid #fff;
  padding: 0.5vw;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  z-index: 999;
  width: 50vw;
  display: block;
  float: left;
`

const Circle = styled(BgStyle)`
  background-image: url(${circle});
  background-size: 88% auto;
  background-position: center top 2vw;
  width: 8vw;
  height: 12vw;
  display: inline-block;
  float: left;
`

const TopBox = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.5vw;
  justify-content: space-between;
`

const BottomTitleParent = styled.div`
  display: inline-block;
  float: left;
  width: 38vw;
  margin: 2vh 0 2vh 2vw;
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
  font-family: 'Helvetica Neue', sans-serif;
`

const LoginTitle = styled.div`
  font-family: 'Helvetica Bold';
  font-size: 1.5vw;
  color: #4338f7;
`

const LoginSubTitle = styled.div`
  font-family: 'Noto Sans';
  font-size: 0.6vw;
  color: #afafaf;
  letter-spacing: 0.03vw;
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
  margin-bottom: 2vw;
`
