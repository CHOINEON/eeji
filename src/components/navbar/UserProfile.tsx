import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

const UserProfile = () => {
  const userId = localStorage.getItem('userId')

  return (
    <div>
      <Avatar style={{ backgroundColor: '#87d068', verticalAlign: 'middle' }} gap={4} icon={<UserOutlined />}>
        {userId}
      </Avatar>
    </div>
  )
}

export default UserProfile
