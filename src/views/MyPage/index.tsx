import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, List, Switch } from 'antd'

const MyPage = () => {
  //   const services = [
  //     {
  //       icon: '/path-to-icon1.svg', // You would need to add correct paths or use Antd Icons
  //       title: 'AI Model Generator',
  //       description: 'AI 모델 생성',
  //     },
  //     {
  //       icon: '/path-to-icon2.svg',
  //       title: 'Explainable AI',
  //       description: '설명가능 인공지능',
  //     },
  //     {
  //       icon: '/path-to-icon3.svg',
  //       title: 'Commodity Index Forecast',
  //       description: '주요 지표 예측',
  //     },
  //     {
  //       icon: '/path-to-icon4.svg',
  //       title: 'Prediction API',
  //       description: 'REST API 서비스',
  //     },
  //   ]

  const managementOptions = [
    {
      title: '약관 및 동의 관리', // Terms and Consent Management
    },
    {
      title: '회원 탈퇴', // Account Deletion
    },
  ]

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* User Avatar and Info */}
      <div className="flex flex-col items-center mt-10">
        <Avatar size={100} icon={<UserOutlined />} />
        <h2 className="mt-4 text-2xl font-bold text-blue-600">AI EEJI, KIM</h2>
        <p className="text-gray-500">Ineeji Corp.</p>
      </div>

      {/* Settings Section */}
      <div className="mt-10 w-4/5 max-w-md">
        <div className="flex justify-between py-3">
          <span className="text-gray-700">회원정보 관리</span>
          <Button type="link">//</Button>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-700">데이터 처리 완료시 알림 받기</span>
          <Switch defaultChecked />
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-700">기타 설정</span>
          <Switch />
        </div>
      </div>

      {/* Services Section */}
      {/* <div className="mt-10 w-4/5 max-w-md">
        <h3 className="text-gray-700 mb-4">주요 서비스 관리 및 설정</h3>
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.icon} />}
                title={<a href="#">{item.title}</a>}
                description={item.description}
              />
              <Button type="link">//</Button>
            </List.Item>
          )}
        />
      </div> */}

      {/* Management Section */}
      <div className="mt-10 w-4/5 max-w-md">
        <List
          itemLayout="horizontal"
          dataSource={managementOptions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={<a href="#">{item.title}</a>} />
              <Button type="link"> // </Button>
            </List.Item>
          )}
        />
      </div>

      {/* Logout Button */}
      <div className="mt-10 w-4/5 max-w-md">
        <Button type="primary" block>
          Log out
        </Button>
      </div>
    </div>
  )
}

export default MyPage
