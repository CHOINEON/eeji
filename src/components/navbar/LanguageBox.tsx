import { Button, Dropdown, Menu } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageBox = () => {
  const [language, setLanguage] = useState('한국어')
  const { i18n } = useTranslation('main')

  //국가 아이콘 클릭시 default 언어 변경
  const changeLanguage = (e: any) => {
    if (e.key !== undefined) {
      i18n.changeLanguage(e.key)
      window.localStorage.setItem('Locale', e.key)

      // 버튼에 표시할 언어 업데이트
      const selectedLanguage = e.key === 'ko-KR' ? '한국어' : e.key === 'us-US' ? 'English' : '日本語'
      setLanguage(selectedLanguage)
    }
  }

  const menu = (
    <Menu onClick={changeLanguage}>
      <Menu.Item key="ko-KR">한국어</Menu.Item>
      <Menu.Item key="us-US">English</Menu.Item>
      <Menu.Item key="jp-JP">日本語</Menu.Item>
    </Menu>
  )

  return (
    <div className="flex justify-center items-center">
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="text" className="text-white hover:bg-blue-600 rounded-sm">
          {language}
        </Button>
      </Dropdown>
    </div>
  )
}

export default LanguageBox
