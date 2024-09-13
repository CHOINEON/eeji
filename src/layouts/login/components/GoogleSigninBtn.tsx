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
    <div className="mt-5 text-center h-[45px] block float-left w-full">
      <button
        type="button"
        className="font-sans bg-white text-[#002D65] w-full h-full border border-[#A3AFCF] flex justify-evenly items-center relative p-2 rounded-lg"
        onClick={handleGoogleLogin}
      >
        <div
          className="inline-block w-[38px] h-[38px] bg-no-repeat"
          style={{ backgroundImage: `url(${GoogleBtn})` }}
        ></div>
        <span className="flex-grow text-center font-bold text-[15px] text-[#002D65]">Login with Google</span>
      </button>
    </div>
  )
}

export default GoogleSignin
