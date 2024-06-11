/**
 * INFINITE OPTIMAL
 * 메뉴명 : Login
 * 시작 날짜 : 2022-11-24
 * 최종 수정 날짜 : 2024-04-19
 * 개발자 : 박윤희 (BAK YUN HEE)
 * 수정 : 조미라
 */

import { Button, FormControl } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { App, Input, Select } from 'antd'
import UserApi from 'apis/UserApi'
import logo from 'assets/img/ineeji/logo_wh.svg'
import axios from 'axios'
import SidebarBrand from 'components/sidebar/components/Brand'
import useGetCompanies from 'hooks/queries/useGetCompanies'
import React, { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useMutation } from 'react-query'
import AvailableServiceIcon from './components/AvailableServiceIcon'
import GoogleSignin from './components/GoogleSigninBtn'
import bottom_title from './img/bottom_title.png'
import ineeji from './img/ineeji.png'
import main_bg_circle from './img/main_bg_circle.png'
import main_title from './img/main_title.png'
import circle from './img/package.png'

axios.defaults.withCredentials = true // withCredentials 전역 설정

export const Login: React.FC = () => {
  const { modal, message } = App.useApp()
  const [id, setId] = React.useState()
  const [password, setPassword] = React.useState()
  const [company, setCompany] = React.useState<any>('')
  const [companyList, setCompanyList] = React.useState<any>()

  const { data } = useGetCompanies()
  const { mutate: mutateLogin } = useMutation(UserApi.login, {
    onSuccess: (response: any) => {
      window.localStorage.setItem('userData', JSON.stringify(response))
      window.localStorage.setItem('companyId', company)
      window.localStorage.setItem('userId', response[0].user_id)
      window.localStorage.setItem('userPosition', response[0].user_position)

      const args: DataLayerArgs = {
        dataLayer: {
          event: 'user_info',
          user_id: localStorage.getItem('userId'),
          member_type: 'id-pwd',
        },
      }

      TagManager.dataLayer(args)

      window.location.href = '/admin/main'
    },
    onError: (error: any) => {
      console.clear()
      if (error.response.status === 403) {
        modal.confirm({
          title: '로그인 확인',
          content: (
            <div>
              <p>다른 기기에 로그인되어 있습니다. </p>
              <p>현재 pc에서 다시 로그인 하시겠습니까?</p>
            </div>
          ),
          onOk() {
            const payload = {
              com_id: company,
              user_id: id,
              user_pass: password,
            }
            mutateLogout(payload)
            mutateLogin(payload)
          },
        })
      } else if (error.response.status === 409) {
        message.open({
          type: 'error',
          content: <p>{error.response.data.detail}</p>,
        })
      }
    },
  })
  const { mutate: mutateLogout } = useMutation(UserApi.logout, {
    onSuccess: (response: any) => {
      message.success('logout success')
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error.response?.data.detail,
      })
    },
  })

  const { mutate: mutateGoogleLogin } = useMutation(UserApi.signinWithgoogle, {
    onSuccess: (response: any) => {
      if (response.user_info) {
        //로그인 상태 확인되면 localStorage에 user정보 저장 ->  datasetList 페이지로 redirect
        localStorage.setItem('userId', response.user_info.email)
        localStorage.setItem('userData', JSON.stringify(response.user_info))
        localStorage.setItem('companyId', response.user_info.com_id || 'google')
        localStorage.setItem('userPicture', response.user_info.picture)

        const args: DataLayerArgs = {
          dataLayer: {
            event: 'user_info',
            user_id: localStorage.getItem('userId'),
            member_type: 'social signin(Google)',
          },
        }
        TagManager.dataLayer(args)

        window.location.href = '/admin/main'
      }
    },
  })

  useEffect(() => {
    if (data) {
      RenderCompanyList(data)
    }
  }, [data])

  React.useEffect(() => {
    //로그인 후 redirect된 URL에서 구글 인가코드 추출하여 백엔드로 전달하여 token발급받음
    const params = new URLSearchParams(window.location.search)
    const code: string = params.get('code')

    if (code && code.length > 0) {
      mutateGoogleLogin({ code: code })
    }
  }, [])

  const setLogin = (id: string, password: string) => {
    if (company.length === 0 || company === undefined) {
      message.open({
        type: 'error',
        content: '회사를 선택해주세요',
      })
    } else if (id === undefined || id?.length === 0) {
      message.open({
        type: 'error',
        content: '아이디를 입력해주세요.',
      })
    } else if (password === undefined || password?.length === 0) {
      message.open({
        type: 'error',
        content: '패스워드를 입력해주세요.',
      })
    } else {
      const payload = {
        com_id: company,
        user_id: id,
        user_pass: password,
      }
      mutateLogin(payload)
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

  // 회사 리스트
  function RenderCompanyList(companyList: any) {
    const Arr: any = []
    let Obj: any = new Object()

    for (let i = 0, len = companyList.length; i < len; i++) {
      Obj.value = companyList[i].com_id
      Obj.label = companyList[i].com_nm
      Arr.push(Obj)
      Obj = new Object()
    }

    setCompanyList(Arr)
  }

  //selectbox 변경 이벤트
  const handleChange = (value: string | string[]) => {
    setCompany(value)
  }

  return (
    <>
      <Home_Bg />
      <Logo />
      <SidebarBrand />
      <Title />
      <BottomBox>
        <Circle />
        <BottomTitleParent>
          <BottomTitle />
          <BottomCotents>
            is Prediction solution for time series data that enables companies to realize productivity improvement,
            production energy cost reduction and quality improvement through process optimization of industrial
            processes.
          </BottomCotents>
        </BottomTitleParent>
        <AvailableServiceIcon />
      </BottomBox>
      <FormWrap>
        <Login_ineejiIcon />
        <LoginTitle>Login</LoginTitle>
        <LoginSubTitle>Enter Your ID and password to sign in.</LoginSubTitle>
        <LoginIcon />
        <FormControl>
          <Select
            id="company"
            size="large"
            placeholder={'Select Company'}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '30px', border: 0 }}
            options={companyList}
          />
          <Input
            id="id"
            color={'black'}
            type="text"
            size="large"
            placeholder={'ID'}
            onChange={(e: any) => ChangeId(e)}
            style={{ width: '100%', marginBottom: '1.3vh', backgroundColor: '#F5F8FF', border: '1px solid #A3AFCF' }}
          />
          <Input
            id="password"
            color={'black'}
            type="password"
            size="large"
            placeholder={'Password'}
            onChange={(e: never) => ChangePassword(e)}
            onKeyDown={(e: unknown) => onEnterLogin(e)}
            style={{ width: '100%', marginBottom: '1.3vh', backgroundColor: '#F5F8FF', border: '1px solid #A3AFCF' }}
          />
        </FormControl>
        <Button
          type="submit"
          onClick={() => setLogin(id, password)}
          style={{
            fontFamily: 'Noto Sans',
            backgroundColor: '#4338f7',
            color: '#fff',
            width: '100%',
            height: 46,
          }}
        >
          Login
        </Button>
        <OrWrapper>or</OrWrapper>
        <GoogleSignin />
        <TextMenuWrapper>
          <TextWrapper onClick={() => message.info('관리자에게 문의하세요')}>Find ID | </TextWrapper>
          <TextWrapper onClick={() => message.info('관리자에게 문의하세요')}>Find Password | </TextWrapper>
          <TextWrapper onClick={() => message.info('관리자에게 문의하세요')}>Join</TextWrapper>
        </TextMenuWrapper>
      </FormWrap>
    </>
  )
}

export default Login

const BgStyle = styled.div`
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% auto;
`
const Login_ineejiIcon = styled.div`
  background-image: url(${ineeji});
  left: 1409px;
  height: 21px;
  background-repeat: no-repeat;
  margin-bottom: 45px;
`
const OrWrapper = styled.div`
  display: block;
  height: 27px;
  text-align: center;
  padding-top: 1vh;
  padding-bottom: 1vh;
  font-size: 16px;
  color: #b0bccb;
`
const Home_Bg = styled(BgStyle)`
  background-image: url(${main_bg_circle});
  background-size: cover;
  position: fixed;
  opacity: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const FormWrap = styled.div`
  min-width: 398px;
  width: 18vw;
  padding-top: 1.5vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-bottom: 1vw;
  position: absolute;
  right: 4vw;
  top: 200px;
  z-index: 999;
  background-color: #fff;
  border-radius: 30px;
`

const Title = styled(BgStyle)`
  background-position: left 7vw top 12vw;
  background-size: 30% auto;
  background-image: url(${main_title});
  position: fixed;
  left: -5px;
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
  left: 7.2vw;
  top: 4vw;
  z-index: 999;
`
const BottomBox = styled.div`
  position: fixed;
  left: 7vw;
  bottom: 2vw;
  border-top: 1px solid #fff;
  padding: 0.5vw;
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
const BottomTitleParent = styled.div`
  display: inline-block;
  float: left;
  width: 38vw;
  margin: 2vh 0 2vh 2vw;
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
  font-size: 35px;
  color: #4338f7;
  left: 1409px;
  width: 100%;
  padding-bottom: 0px;
`
const LoginSubTitle = styled.div`
  font-family: 'Noto Sans';
  font-size: 13px;
  color: #afafaf;
  letter-spacing: 1px;
  padding-bottom: 0;
`
const TextWrapper = styled.button`
  color: #a3afcf;
  font-size: 13px;
  margin: 5px;
`
const LoginIcon = styled.div`
  background-position: center;
  margin-bottom: 3vw;
`
const TextMenuWrapper = styled.div`
  width: 100%;
  display: block;
  float: left;
  padding-top: 15px;
  text-align: center;
  margin: auto;
`
