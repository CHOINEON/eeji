import React from 'react'
import { useLocation } from 'react-router-dom'
import GoogleBtn from 'assets/img/components/google.svg'
import kakaoBtn from 'assets/img/components/kakao.svg'
import AppleBtn from 'assets/img/components/apple.svg'

import googleSigninBtn_sm from 'assets/img/components/web_light_sq_na.svg'
import styled from '@emotion/styled'
import { App } from 'antd'

const GoogleSignin = () => {
  const { message } = App.useApp()

  const location = useLocation()
  const GOOGLE_ID = '42578919430-p1so0e8e9s3ovojrc7a24c3kn6oq89g1.apps.googleusercontent.com'

  const oAuthHandler = (): void => {
    const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL}/login`
    // console.log('REDIRECT_URI:', REDIRECT_URI)
    const GoogleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email`

    window.location.assign(GoogleURL)
  }

  const handleGoogleLogin = () => {
    oAuthHandler()
  }

  return (
    <>
      <GoogleLoginBtn onClick={handleGoogleLogin}>
        {/* <GoogleIcon />
      <LoginButtonText> Continue with Google</LoginButtonText> */}
      </GoogleLoginBtn>
      <KakaoLoginBtn onClick={() => message.error('준비중인 서비스입니다.')} />
      <AppleLoginBtn onClick={() => message.error('준비중인 서비스입니다.')} />
    </>
  )
}

export default GoogleSignin

const LoginButton = styled.button`
  display: inline-block;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  margin-right: 15px;
`

const GoogleLoginBtn = styled(LoginButton)`
  background-image: url(${GoogleBtn});
`
const KakaoLoginBtn = styled(LoginButton)`
  background-image: url(${kakaoBtn});
`
const AppleLoginBtn = styled(LoginButton)`
  background-image: url(${AppleBtn});
`

// const GoogleIcon = styled.div`
//   display: block;
//   float: left;
//   width: 30px;
//   height: 30px;
//   margin: 4px;
//   background-image: url(${googleSigninBtn});
//   background-size: 30px 30px;
// `

// const LoginButtonText = styled.p`
//   color: #002d65;
//   font-weight: bold;
//   font-size: 15px;
//   line-height: 37px;
//   display: inline-block;

//   @media (max-width: 1200px) {
//     display: none;
//   }
// `
