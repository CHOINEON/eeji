import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme'
import D3LineChart from 'views/hmid_config/grid/function/drawD3Chart'
import PredefinedLayouts from 'views/hmid_config/grid/GridLayoutTest'
import { RecoilRoot } from 'recoil'

ReactDOM.render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <Route path={`/admin`} component={AdminLayout} />
          <Route path={`/login`} component={Login} />
          <Route path={`/admin/maindashboard`} component={PredefinedLayouts} />
          <Redirect from="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
