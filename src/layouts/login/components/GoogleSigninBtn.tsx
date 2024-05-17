import { Button } from '@chakra-ui/react'
import styled from '@emotion/styled'
import GoogleBtn from 'assets/img/components/google.svg'

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
    <div
      style={{ marginTop: '20px', textAlign: 'center', height: '46px', display: 'block', float: 'left', width: '100%' }}
    >
      <Button
        type="submit"
        variant="outline"
        style={{
          fontFamily: 'Noto Sans',
          backgroundColor: '#fff',
          color: '#002D65',
          width: '100%',
          height: '100%',
          border: '1px solid #A3AFCF',
          justifyContent: 'space-evenly',
          textAlign: 'center',
          position: 'relative',
          padding: '10px',
        }}
        onClick={handleGoogleLogin}
      >
        <GoogleLogin />
        <span style={{ flex: '7' }}>Login with Google</span>
      </Button>
    </div>
  )
}

export default GoogleSignin

const GoogleLogin = styled.div`
  display: inline-block;
  width: 38px;
  height: 38px;
  background-image: url(${GoogleBtn});
  background-repeat: no-repeat;
`
