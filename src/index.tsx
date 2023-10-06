import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import { ChakraProvider } from '@chakra-ui/react'
import { ConfigProvider } from 'antd'
import theme from './theme/theme'
import { RecoilRoot } from 'recoil'
import './locales'
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'
import App from './App'
import { Loading } from 'common/Loading'
// import { App } from 'antd'
//https://ant.design/docs/react/customize-theme

const antdCustomTheme = {
  token: {
    // Seed Token
    colorPrimary: '#4338f7',
    borderRadius: 10,
    // Alias Token
    colorBgContainer: '#FFFFFF',
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
      // colorBgContainer: '#FFFFFF',
      // colorBorderBg: '1px solid #A3AFCF',
      borderRadius: 10,
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
    <ConfigProvider theme={antdCustomTheme}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Loading />

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
