import React, { useEffect } from 'react'
import { useApiError } from './hooks/useApiError'
import { useQueryClient } from 'react-query'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import Login from './layouts/login/login'
import NotFound from 'components/common/NotFound'
import { Loading } from 'components/common/Loading'
import NetworkError from 'components/common/NetworkError'

export function App() {
  const { handleError } = useApiError()
  const queryClient = useQueryClient()

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
          <Route path={`/admin`} component={AdminLayout} />
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
