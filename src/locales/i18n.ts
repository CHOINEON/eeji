import i18n from 'i18next'
// import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as en from './en'
import * as ko from './ko'
import * as jp from './jp'

const resources: any = {
  'us-US': {
    ...en,
  },
  'ko-KR': {
    ...ko,
  },
  'jp-JP': {
    ...jp,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko-KR', // 초기 설정 언어
  fallbackLng: {
    'us-US': ['us-US'], // 한국어 불러오는 것이 실패했을 경우 영문을 써라 라는 말입니다.
    default: ['ko-KR'],
  },
  debug: true,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
