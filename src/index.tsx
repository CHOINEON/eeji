import { ChakraProvider } from '@chakra-ui/react'
import { App as Antd, ConfigProvider } from 'antd'
import GlobalModal from 'components/modal/GlobalModal'
import ToastList from 'components/toast/List'
import 'locales/i18n'
import i18n from 'locales/i18n'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga4'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import App from './App'
import './assets/css/App.css'
import './locales'

import theme from './theme/theme'

const antdCustomTheme = {
  token: {
    fontFamily: 'Helvetica Neue',
    colorPrimary: '#1677ff',
    borderRadius: 10,
  },
  components: {
    Button: {
      colorPrimary: '#4338f7 !important',
    },
    Modal: {
      borderRadius: 12,
    },
    Input: {
      borderRadius: 12,
    },
    Select: {
      borderRadius: 12,
    },
  },
}

const queryClient = new QueryClient()

// 구글 애널리틱스 운영서버만 적용
if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
}

ReactDOM.render(
  <RecoilRoot>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider theme={antdCustomTheme}>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Antd>
              <BrowserRouter>
                <App />
                <ToastList />
              </BrowserRouter>
              <GlobalModal />
            </Antd>
          </QueryClientProvider>
        </ChakraProvider>
      </ConfigProvider>
    </I18nextProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
