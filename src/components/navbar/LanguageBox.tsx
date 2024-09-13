import { Dropdown, MenuProps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageBox = () => {
  const [language, setLanguage] = useState('한국어')
  const { i18n } = useTranslation('main')

  // 언어 변경 핸들러
  const changeLanguage = ({ key }: { key: string }) => {
    i18n.changeLanguage(key)
    window.localStorage.setItem('Locale', key)

    // 버튼에 표시할 언어 업데이트
    const selectedLanguage = key === 'ko-KR' ? '한국어' : key === 'us-US' ? 'English' : '日本語'
    setLanguage(selectedLanguage)
  }

  // 메뉴 항목 설정
  const items: MenuProps['items'] = [
    {
      key: 'ko-KR',
      label: '한국어',
    },
    {
      key: 'us-US',
      label: 'English',
    },
    {
      key: 'jp-JP',
      label: '日本語',
    },
  ]

  return (
    <div className="flex justify-center items-center">
      <Dropdown menu={{ items, onClick: changeLanguage }} trigger={['click']}>
        <button className="text-white hover:text-white hover:font-bold rounded-sm">{language}</button>
      </Dropdown>
    </div>
  )
}

export default LanguageBox
