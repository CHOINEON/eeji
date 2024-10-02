import logoutBtnImage from 'assets/img/icons/logout_off.svg'
import { useLogout } from 'hooks/useLogout'
import { useHistory } from 'react-router-dom'

const Logout = () => {
  const history = useHistory()
  const { handleLogout } = useLogout(() => {
    history.replace('/login')
  })

  return (
    <>
      <button onClick={handleLogout}>
        <img src={logoutBtnImage} />
      </button>
    </>
  )
}

export default Logout
