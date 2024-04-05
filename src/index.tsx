import { ChakraProvider } from '@chakra-ui/react'
import { App as Antd, ConfigProvider } from 'antd'
import GlobalModal from 'components/modal/GlobalModal'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga4'
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
    // colorBgContainer: '#FFFFFF',
    // colorBgContainerDisabled: '#5951DB33',
  },
  components: {
    Button: {
      // colorPrimaryActive: '#4338f7',
      colorPrimary: '#4338f7 !important',
      // colorBorder: '#4338F7',
      // borderRadius: '10px',
    },
    Modal: {
      borderRadius: 10,
    },
    Input: {
      // colorBorder: '1px solid #A3AFCF',
      // colorBgContainer: '#fff',
      borderRadius: 10,
    },
    Select: {
      // colorBorder: '1px solid #ff973d',
      borderRadius: 10,
      // colorPrimary: '#4338f7',
      // colorBgBase: '#FFFFFF',
      // colorBgContainer: '#FFFFFF',
      // colorBorderBg: '1px solid #A3AFCF',
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
    <ConfigProvider theme={antdCustomTheme}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Antd>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <GlobalModal />
          </Antd>
        </QueryClientProvider>
      </ChakraProvider>
    </ConfigProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
