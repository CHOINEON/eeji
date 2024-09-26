import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en/translation.json'
import jp from './jp/translation.json'
import ko from './kr/translation.json'

const resources: Resource = {
  'us-US': { translation: en },
  'ko-KR': { translation: ko },
  'jp-JP': { translation: jp },
} as const

//브라우저 언어 설정 가져오기
const browserLang = window.navigator.language
//localStorage에서 언어설정 가져오기
const userLanguage = localStorage.getItem('Locale') ?? browserLang

i18n.use(initReactI18next).init({
  resources,
  lng: userLanguage || 'ko-KR', // 초기 설정 언어
  fallbackLng: {
    'us-US': ['us-US'], // 한국어 불러오는 것이 실패했을 경우 영문을 써라 라는 말입니다.
    default: ['ko-KR'],
  },
  debug: true,
  keySeparator: '.', //계층 구분자로 점(.)사용,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
