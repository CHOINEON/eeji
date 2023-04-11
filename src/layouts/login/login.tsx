/**
 * INFINITE OPTIMAL
 * 메뉴명 : Login
 * 시작 날짜 : 2022-11-24
 * 최종 수정 날짜 : 2022-11-24
 * 개발자 : 박윤희 (BAK YUN HEE)
 */

import React from 'react'
import styled from '@emotion/styled'
import bg_vedio from '../../assets/img/ineeji/ineeji_video.gif'
import title from '../../assets/img/ineeji/title.svg'
import axios from 'axios'
import { FormControl, FormLabel, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Input } from '@chakra-ui/react'

axios.defaults.withCredentials = true // withCredentials 전역 설정

const Wrapper = styled.div`
  background-color: #070707a4;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
`

const Home_Bg = styled.div`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${bg_vedio});
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const FormWrap = styled.div`
  width: 25vw;
  position: fixed;
  left: 10%;
  bottom: 8%;
  z-index: 999;
`

const Title = styled.div`
  background-position: left 10vw top 5vw;
  background-repeat: no-repeat;
  background-size: 50% auto;
  background-image: url(${title});
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 999;
  @media screen and (max-width: 500px) {
    background-size: 120% auto;
    top: 10%;
  }
`

export const Login: React.FC = () => {
  const [id, setId] = React.useState()
  const [password, setPassword] = React.useState()
  //   const [messageApi, contextHolder] = message.useMessage();

  const error = (e: string) => {
    alert(e)
  }

  const setLogin = (id: string, password: string) => {
    axios
      .get('http://192.168.1.27:8000/api/hmid/user/info?id=' + id + '&password=' + password, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;',
        },
        timeout: 5000,
      })
      .then((response) => {
        console.log('[ axios response data ] : ')
        console.log(response.data)

        window.location.href = '/admin/hmid'
        window.localStorage.setItem('userData', JSON.stringify(response.data))
      })
      .catch((error) => {
        // console.log(error.response)
        error('아이디 또는 비밀번호가 틀립니다.')
      })
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

  return (
    <>
      {/* <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>아이디와 패스워드를 확인 해주세요.</AlertDescription>
      </Alert> */}
      <Wrapper />
      <Home_Bg />
      <Title />
      <FormWrap>
        <FormControl id="text">
          <FormLabel color={'white'}>I D</FormLabel>
          <Input color={'white'} type="text" onChange={(e: any) => ChangeId(e)} onKeyDown={(e: any) => onEnterId(e)} />
          <FormLabel mt={5} color={'white'}>
            PWD
          </FormLabel>
          <Input
            color={'white'}
            type="password"
            onChange={(e: any) => ChangePassword(e)}
            onKeyDown={(e: any) => onEnterLogin(e)}
          />
        </FormControl>
        <Button mt={4} colorScheme="brand" type="submit" onClick={() => setLogin(id, password)}>
          Login
        </Button>
      </FormWrap>
    </>
  )
}

export default Login
