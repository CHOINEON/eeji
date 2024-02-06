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

// import toast, { Toaster } from 'react-hot-toast'
// import { App } from 'antd'
//https://ant.design/docs/react/customize-theme

const antdCustomTheme = {
  token: {
    colorPrimary: '#4338F7',
    fontFamily: 'Helvetica Neue',
    borderRadius: 7,
    // colorBgContainer: '#FFFFFF',
    // colorBgContainer: '#002D65',
    // colorBgContainerDisabled: '#5951DB33',
  },
  components: {
    Button: {
      colorPrimary: '#4338f7',
      borderRadius: 100,
    },
    Modal: {
      borderRadius: 10,
    },
    Input: {
      colorBgContainer: '#FFFFFF',
      colorBorderBg: '1px solid #F5F8FF',
      borderRadius: 7,
    },
    Select: {
      // colorPrimary: '#4338f7',
      // colorBgBase: '#FFFFFF',
      // colorBgContainer: '#FFFFFF',
      // colorBorderBg: '1px solid #A3AFCF',
      borderRadius: 10,
    },
  },
}

const queryClient = new QueryClient()

ReactDOM.render(
  <RecoilRoot>
    <ConfigProvider
      theme={antdCustomTheme}
      // theme={{
      //   token: {
      //     colorPrimary: '#4338F7',
      //     fontFamily: 'Helvetica Neue',
      //     borderRadius: 7,
      //     // colorBgContainer: '#FFFFFF',
      //     // colorBgContainer: '#002D65',
      //     // colorBgContainerDisabled: '#5951DB33',
      //   },
      //   components: {
      //     Button: {
      //       colorPrimary: '#4338f7',
      //       borderRadius: 100,
      //     },
      //     Modal: {
      //       borderRadius: 10,
      //     },
      //     Input: {
      //       // colorBgContainer: '#FFFFFF',
      //       // colorBorderBg: '1px solid #A3AFCF',
      //       borderRadius: 7,
      //     },
      //     Select: {
      //       // colorPrimary: '#4338f7',
      //       // colorBgBase: '#FFFFFF',
      //       // colorBgContainer: '#FFFFFF',
      //       // colorBorderBg: '1px solid #A3AFCF',
      //       borderRadius: 10,
      //     },
      //   },
      // }}
    >
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
