import { Button } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { App } from 'antd'
import AppleBtn from 'assets/img/components/apple.svg'
import GoogleBtn from 'assets/img/components/google.svg'
import kakaoBtn from 'assets/img/components/kakao.svg'
import { useLocation } from 'react-router-dom'
const GoogleSignin = () => {
  const { message } = App.useApp()

  const location = useLocation()
  const GOOGLE_ID = '${process.env.REACT_APP_GOOGLE_ID}'

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
    <Button
      type="submit"
      variant="outline"
      style={{
        // display: 'flex',
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
    >
      <GoogleLoginBtn onClick={handleGoogleLogin}> </GoogleLoginBtn>
      <span style={{ flex: '7' }}>Login with Google</span>
    </Button>
    // <Flex>
    //   <GoogleLoginBtn onClick={handleGoogleLogin}>
    //     {/* <GoogleIcon />
    //   <LoginButtonText> Continue with Google</LoginButtonText> */}
    //   </GoogleLoginBtn>
    //   <div
    //     style={{
    //       fontSize: '1rem',
    //       textAlign: 'center',
    //       // verticalAlign: 'center',
    //       // lineHeight : '10px;'
    //       paddingLeft: '1rem',
    //       color: '#002D65',
    //     }}
    //   >
    //     Login with Google
    //   </div>
    //   {/*
    // //   {/* <KakaoLoginBtn onClick={() => message.error('준비중인 서비스입니다.')} />
    // //   <AppleLoginBtn onClick={() => message.error('준비중인 서비스입니다.')} /> * */}
    // </Flex>
  )
}

export default GoogleSignin

const LoginButton = styled.button`
  display: inline-block;
  width: 38px;
  height: 38px;
  border-radius: 10px;
`

const GoogleLoginBtn = styled(LoginButton)`
  background-image: url(${GoogleBtn});
  background-repeat: no-repeat;
  // flex: 1;
  margin-left: 5px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`
const KakaoLoginBtn = styled(LoginButton)`
  background-image: url(${kakaoBtn});
`
const AppleLoginBtn = styled(LoginButton)`
  background-image: url(${AppleBtn});
`
const Flex = styled.button`
  display: flex;
  border: 1px solid #a3afcf;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  font-family: 'Helvetica Neue';
  text-align: center;
  font-size: 17px;
  font-color: #002d65;
  font-weight: bold;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
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

const LoginText = styled.div``
