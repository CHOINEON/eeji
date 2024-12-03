import { App as Antd, ConfigProvider } from 'antd'
import GlobalModal from 'components/modal/GlobalModal'
import ToastList from 'components/toast/List'
import 'locales/i18n'
import i18n from 'locales/i18n'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import App from './App'
import './assets/css/App.css'
import './locales'

const antdCustomTheme = {
  token: {
    fontFamily: 'Helvetica Neue',
    colorPrimary: '#4338F7',
    borderRadius: 10,
  },
  components: {
    Button: {
      colorPrimary: '#4338f7', // Button background color
      colorText: '#000000', // Default font color
      colorPrimaryHover: '#5a50ff', // Button background color on hover
      fontSize: 13,
    },
    Modal: {
      borderRadius: 10,
    },
    Input: {
      borderRadius: 10,
    },
    Select: {
      borderRadius: 10,
    },
    Table: {
      headerColor: '#002D65',
    },
  },
}

const queryClient = new QueryClient()

// 구글 애널리틱스 운영서버만 적용
if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(
  <RecoilRoot>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider theme={antdCustomTheme}>
        <QueryClientProvider client={queryClient}>
          <Antd>
            <BrowserRouter>
              <App />
              <ToastList />
            </BrowserRouter>
            <GlobalModal />
          </Antd>
        </QueryClientProvider>
      </ConfigProvider>
    </I18nextProvider>
  </RecoilRoot>
)
