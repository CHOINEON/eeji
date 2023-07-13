import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme'
import { RecoilRoot } from 'recoil'
import './locales'

ReactDOM.render(
  <RecoilRoot>
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
  </RecoilRoot>,
  document.getElementById('root')
)
