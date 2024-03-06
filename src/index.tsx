import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { ConfigProvider, FloatButton } from 'antd'
import theme from './theme/theme'
import { RecoilRoot } from 'recoil'
import './locales'
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'
import App from './App'
import { App as Antd } from 'antd'
import { Loading } from 'components/common/Loading'
import GlobalModal from 'components/modal/GlobalModal'
import Feedback from 'components/common/Feedback'

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
// token: {
//   colorPrimary: '#4338F7',
//   fontFamily: 'Helvetica Neue',
//   borderRadius: 7,
//   colorBgContainer: '#FFFFFF',
//   colorBgContainer: '#002D65',
//   colorBgContainerDisabled: '#5951DB33',
// },
// components: {
//   Button: {
//     colorPrimary: '#00B96B',
//     // algorithm: true,
//     // borderRadius: 100,
//   },
//   Modal: {
//     borderRadius: 10,
//   },
//   Input: {
//     colorBgContainer: '#FFFFFF',
//     colorBorderBg: '1px solid #F5F8FF',
//     borderRadius: 7,
//   },
//   Select: {
//     // colorPrimary: '#4338f7',
//     // colorBgBase: '#FFFFFF',
//     // colorBgContainer: '#FFFFFF',
//     // colorBorderBg: '1px solid #A3AFCF',
//     borderRadius: 10,
//   },
// },

const queryClient = new QueryClient()

ReactDOM.render(
  <RecoilRoot>
    <ConfigProvider theme={antdCustomTheme}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {/* <Loading /> */}
          <Antd>
            <App />
            <GlobalModal />
            <Feedback />
          </Antd>
          {/* <Toaster /> */}
          {/* <BrowserRouter>
              <Switch>
                <Route path={`/auth`} component={AuthLayout} />
                <Route path={`/admin`} component={AdminLayout} />
                <Route path={`/login`} component={Login} />
                <Redirect from="/" to="/login" />
              </Switch>
            </BrowserRouter> */}
        </QueryClientProvider>
      </ChakraProvider>
    </ConfigProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
