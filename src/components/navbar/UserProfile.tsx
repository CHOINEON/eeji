import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useHistory } from 'react-router-dom'

const UserProfile = () => {
  const userId = localStorage.getItem('userId')
  const history = useHistory()

  const handleClick = () => {
    history.replace('/admin/mypage')
  }

  return (
    <div>
      <Avatar
        style={{ backgroundColor: '#87d068', verticalAlign: 'middle', cursor: 'pointer' }}
        gap={4}
        icon={<UserOutlined />}
        onClick={handleClick}
      >
        {userId}
      </Avatar>
    </div>
  )
}

export default UserProfile
