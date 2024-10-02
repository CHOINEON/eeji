import { RightOutlined, UserOutlined } from '@ant-design/icons'
import { App, Avatar, Button, List, Switch } from 'antd'
import { useLogout } from 'hooks/useLogout'
import { t } from 'i18next'
import { useHistory } from 'react-router-dom'

const MyPage = () => {
  const history = useHistory()
  const { message } = App.useApp()

  const { handleLogout } = useLogout(() => {
    history.push('/login')
  })

  const handleClick = () => {
    message.open({
      type: 'info',
      content: t('The service is under preparation.'),
      className: 'custom-class',
      style: {
        marginTop: '60px',
      },
    })
  }

  const managementOptions = [
    {
      title: '약관 및 동의 관리',
    },
  ]

  return (
    <div className="flex justify-center items-center mt-[100px]">
      <div className="w-[350px] bg-white rounded-[20px] shadow-lg flex flex-col items-center p-10 border-[#D5DCEF] shadow-[0_0_10px_rgba(89,81,219,0.2)]">
        {/* User Avatar and Info */}
        <div className="flex flex-col items-center m-auto">
          <Avatar size={80} icon={<UserOutlined />} />
          <h2 className="mt-4 text-2xl text-blue-600">{localStorage.getItem('userId')}</h2>
          <p className="text-gray-500">{localStorage.getItem('userLevel') === '1' ? '일반회원' : 'undefined'}</p>
        </div>

        {/* Settings Section */}
        <div className="mt-10 w-4/5 max-w-md">
          <div className="flex justify-between py-3">
            <span className="text-gray-700">회원정보 관리</span>
            <Button type="link" icon={<RightOutlined />} onClick={handleClick}></Button>
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
                <Button type="link" icon={<RightOutlined />} onClick={handleClick}></Button>
              </List.Item>
            )}
          />
        </div>

        {/* Logout Button */}
        <div className="mt-10 w-4/5 max-w-md">
          <Button type="primary" block className="h-[40px] border-radius-[10px]" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MyPage
