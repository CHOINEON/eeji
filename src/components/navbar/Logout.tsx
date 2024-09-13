import { message } from 'antd'
import UserApi from 'apis/UserApi'
import logoutBtnImage from 'assets/img/icons/logout_off.svg'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'

const Logout = () => {
  const history = useHistory()

  const { mutate: mutateLogout } = useMutation(UserApi.logout, {
    onSuccess: (response: any) => {
      message.open({
        type: 'success',
        content: response?.message,
      })
      history.replace('/login')
    },
    onError: (error: any) => {},
  })

  const handleLogout = () => {
    const payload = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
    }
    mutateLogout(payload)
  }

  return (
    <>
      <button onClick={handleLogout}>
        <img src={logoutBtnImage} />
      </button>
    </>
  )
}

export default Logout
