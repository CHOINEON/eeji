import { RightOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, List, Switch } from 'antd'
import { useLogout } from 'hooks/useLogout'
import { useHistory } from 'react-router-dom'

const MyPage = () => {
  const history = useHistory()

  const { handleLogout } = useLogout(() => {
    history.push('/login')
  })

  const managementOptions = [
    {
      title: '약관 및 동의 관리',
    },
  ]

  return (
    <div className="flex flex-col items-center ">
      {/* User Avatar and Info */}
      <div className="flex flex-col items-center mt-[100px]">
        <Avatar size={100} icon={<UserOutlined />} />
        <h2 className="mt-5 text-2xl font-bold text-blue-600">{localStorage.getItem('userId')}</h2>
        <p className="text-gray-500">{localStorage.getItem('userLevel') === '1' ? '일반회원' : 'undefined'}</p>
      </div>

      {/* Settings Section */}
      <div className="mt-10 w-4/5 max-w-md">
        <div className="flex justify-between py-3">
          <span className="text-gray-700">회원정보 관리</span>
          <Button type="link" icon={<RightOutlined />}></Button>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-700">데이터 처리 완료시 알림 받기</span>
          <Switch defaultChecked value={false} />
        </div>
        {/* <div className="flex justify-between py-3">
          <span className="text-gray-700">기타 설정</span>
          <Switch />
        </div> */}
      </div>

      {/* Management Section */}
      <div className="mt-10 w-4/5 max-w-md">
        <List
          itemLayout="horizontal"
          dataSource={managementOptions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={<a href="#">{item.title}</a>} />
              <Button type="link" icon={<RightOutlined />}></Button>
            </List.Item>
          )}
        />
      </div>

      {/* Logout Button */}
      <div className="mt-10 w-4/5 max-w-md">
        <Button type="primary" block className="h-[40px] border-radius-[10px]" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  )
}

export default MyPage
