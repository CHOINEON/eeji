import { Button } from '@chakra-ui/react'
import styled from '@emotion/styled'
import AppleBtn from 'assets/img/components/apple.svg'
import GoogleBtn from 'assets/img/components/google.svg'
import kakaoBtn from 'assets/img/components/kakao.svg'

const GoogleSignin = () => {
  const oAuthHandler = (): void => {
    const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL}/login`
    const GoogleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email`

    window.location.assign(GoogleURL)
  }

  const handleGoogleLogin = () => {
    oAuthHandler()
  }

  return (
    <Button
      type="submit"
      variant="outline"
      style={{
        fontFamily: 'Noto Sans',
        backgroundColor: '#fff',
        color: '#002D65',
        width: '100%',
        borderRadius: '7px',
        border: '1px solid #A3AFCF',
        justifyContent: 'space-evenly',
        padding: '0',
        textAlign: 'center',
        position: 'relative',
      }}
      onClick={handleGoogleLogin}
    >
      <GoogleLogin />
      <span style={{ flex: '7' }}>Login with Google</span>
    </Button>
  )
}

export default GoogleSignin

const GoogleLogin = styled.div`
  display: inline-block;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-image: url(${GoogleBtn});
  background-repeat: no-repeat;
  height: 90%;
  margin-left: 5px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`
