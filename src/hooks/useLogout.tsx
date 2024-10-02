// hooks/useLogout.ts
import { message } from 'antd'
import UserApi from 'apis/UserApi'
import { useMutation } from 'react-query'

export const useLogout = (onLogoutSuccess?: () => void) => {
  const { mutate: mutateLogout } = useMutation(UserApi.logout, {
    onSuccess: (response) => {
      console.log(response)
      message.open({
        type: 'success',
        content: response?.message,
      })
      // 로그아웃 성공 후 콜백 함수 호출
      if (onLogoutSuccess) {
        onLogoutSuccess()
      }
    },
  })

  const handleLogout = () => {
    const payload = {
      com_id: localStorage.getItem('companyId'),
      user_id: localStorage.getItem('userId'),
    }
    mutateLogout(payload)
  }

  return { handleLogout }
}
