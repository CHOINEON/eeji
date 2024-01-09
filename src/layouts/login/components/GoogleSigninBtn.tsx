import React from 'react'
import { useLocation } from 'react-router-dom'
import googleSigninBtn from 'assets/img/components/Google_G_logo.svg'
import styled from '@emotion/styled'

const GoogleSignin = () => {
  const location = useLocation()

  const GOOGLE_ID = '42578919430-p1so0e8e9s3ovojrc7a24c3kn6oq89g1.apps.googleusercontent.com'
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL + '/login'
  const GoogleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email`

  const oAuthHandler = (): void => {
    window.location.assign(GoogleURL)
  }

  const handleGoogleLogin = () => {
    oAuthHandler()
  }

  return (
    <GoogleLoginBtn onClick={handleGoogleLogin}>
      <GoogleIcon />
      <LoginButtonText> Sign in with Google</LoginButtonText>
    </GoogleLoginBtn>
  )
}

export default GoogleSignin

const GoogleLoginBtn = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 15px;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  opacity: 1;
`

const GoogleIcon = styled.image`
  display: block;
  float: left;
  width: 30px;
  height: 30px;
  margin: 4px;
  background-image: url(${googleSigninBtn});
  background-size: 30px 30px;
`

const LoginButtonText = styled.p`
  color: #002d65;
  font-weight: bold;
  font-size: 15px;
  line-height: 37px;
  display: inline-block;
`
