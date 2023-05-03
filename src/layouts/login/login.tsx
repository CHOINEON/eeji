/**
 * INFINITE OPTIMAL
 * 메뉴명 : Login
 * 시작 날짜 : 2022-11-24
 * 최종 수정 날짜 : 2022-11-24
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import styled from '@emotion/styled'
// import bg_vedio from '../../assets/img/ineeji/ineeji_video.gif'
import main_bg from './img/bg.png'
import main_font from './img/main_font.png'
import logo from './img/logo.png'
import circle from './img/circle.png'
import notice from './img/notice.png'
import bottom_title from './img/bottom_title.png'
import date from './img/date.png'
import axios from 'axios'
import { FormControl, FormLabel, Button, Input } from '@chakra-ui/react'
import type { SelectProps } from 'antd'
import { Select } from 'antd'
import './style/style.css'

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
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: brightness(56%);
  box-shadow: inset 0 0 0 2000px rgb(15 0 244 / 37%);
`

const FormWrap = styled.div`
  width: 20vw;
  height: 60vh;
  padding: 2vw;
  position: fixed;
  right: 10%;
  top: 50%;
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
  left: 7vw;
  top: 4vw;
  width: 9vw;
  height: 2vw;
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
  background-position: center center;
  background-image: url(${circle});
  width: 7vw;
  height: 7vw;
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

const Notice = styled(BgStyle)`
  background-image: url(${notice});
  width: 2vw;
  height: 1vw;
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
  margin-bottom: 1.5vw;
`

export const Login: React.FC = () => {
  const [id, setId] = React.useState()
  const [password, setPassword] = React.useState()
  const [company, setCompany] = React.useState<any>('')
  const [companyList, setCompanyList] = React.useState<any>()
  //   const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    RenderCompanyList()
  }, [])
  //select field

  const options: SelectProps['options'] = []

  const error = (e: string) => {
    alert(e)
  }

  const setLogin = (id: string, password: string) => {
    if (company.length === 0 || company === undefined) {
      alert('회사를 선택 해주세요.')
    } else {
      axios
        .get(
          'http://220.94.157.27:59871/api/user/info?com_id=' + company + '&user_id=' + id + '&user_pass=' + password,
          {
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/x-www-form-urlencoded;',
            },
            timeout: 5000,
          }
        )
        .then((response) => {
          // console.log('[ axios response data ] : ')
          // console.log(response.data)

          getCompanyInfo(company)
          window.localStorage.setItem('userData', JSON.stringify(response.data))
          window.localStorage.setItem('companyId', company)
          window.localStorage.setItem('userPosition', response.data[0].user_position)
        })
        .catch((error) => {
          // console.log(error.response)
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
    if (e.keyCode === 13) {
      error('패스워드를 입력해주세요.')
    }
  }

  // 회사 리스트
  function RenderCompanyList() {
    const Arr: any = []
    let Obj: any = new Object()

    axios
      .get('http://220.94.157.27:59871/api/hmid/company', {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ axios response data ] : ')
        console.log(response.data)

        for (let i = 0, len = response.data.length; i < len; i++) {
          Obj.value = response.data[i].com_id
          Obj.label = response.data[i].com_nm
          Arr.push(Obj)
          Obj = new Object()
        }

        // console.log(Arr)
        setCompanyList(Arr)
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  const handleChange = (value: string | string[]) => {
    console.log(`Compnay Selected: ${value}`)
    setCompany(value)
  }

  const getCompanyInfo = (companyId: string) => {
    console.log(companyId)
    axios
      .get('http://220.94.157.27:59871/api/hmid/company/info?company_id=' + companyId, {
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
      {/* <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>아이디와 패스워드를 확인 해주세요.</AlertDescription>
      </Alert> */}
      <Wrapper />
      <Home_Bg />
      <Logo />
      <Title />
      <BottomBox>
        <Circle />
        <BottomTitleParent>
          <TopBox>
            <Notice />
            <Date />
          </TopBox>
          <BottomTitle />
          <BottomCotents>
            This Webinar will discuss the key trends seen in the Chemical industry and discuss how the Process Digital
            Twin is allowing companies to advance their Digital Transformation journey in terms of developing new
            circular economy products and processes more efficiently and with lower environmental impact.
          </BottomCotents>
        </BottomTitleParent>
      </BottomBox>
      <FormWrap>
        <LoginTitle>LOGIN</LoginTitle>
        <LoginSubTitle>Enter Your ID and password to sign in.</LoginSubTitle>
        <FormControl id="text">
          <Select
            size={'large'}
            placeholder={'Select Company'}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '1vw', border: 0 }}
            options={companyList}
          />
          <Input
            color={'white'}
            type="text"
            placeholder={'ID'}
            onChange={(e: any) => ChangeId(e)}
            onKeyDown={(e: any) => onEnterId(e)}
            style={{ width: '100%', marginBottom: '1vw', backgroundColor: '#f4f7fe', border: 0 }}
          />
          <Input
            color={'white'}
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
    </>
  )
}

export default Login
