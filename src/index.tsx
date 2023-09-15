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
//https://ant.design/docs/react/customize-theme

ReactDOM.render(
  <RecoilRoot>
    <ConfigProvider
      theme={{
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
        },
      }}
    >
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/admin`} component={AdminLayout} />
            <Route path={`/login`} component={Login} />
            <Redirect from="/" to="/login" />
          </Switch>
        </BrowserRouter>
      </ChakraProvider>
    </ConfigProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
