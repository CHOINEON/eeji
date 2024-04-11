import React, { useEffect, useState } from 'react'
import { useApiError } from './hooks/useApiError'
import { useQueryClient } from 'react-query'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import NotFound from 'components/common/NotFound'
import NetworkError from 'components/common/NetworkError'

function PrivateRoute({ component: Component, isAuthenticated, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export function App() {
  const { handleError } = useApiError()
  const queryClient = useQueryClient()
  const isAuthenticated = localStorage.getItem('userId') ? true : false
  // const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('userId') ? true : false)

  queryClient.setDefaultOptions({
    queries: {
      onError: (error: any) => {
        handleError(error)
      },
      retry: 0, // 요청 실패하면 기본 3번의 재시도
      // suspense: true, //useErrorBoundaries 가 true로 세팅됨
    },
    mutations: {
      onError: (error: any) => {
        handleError(error)
      },
    },
  })

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <PrivateRoute path={`/admin`} component={AdminLayout} isAuthenticated={isAuthenticated} />
          <Route path={`/login`} component={Login} />
          <Route path={`/404`} component={NotFound} />
          <Route path={`/500`} component={NetworkError} />

          <Redirect from="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default App
