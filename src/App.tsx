import NetworkError from 'components/common/NetworkError'
import NotFound from 'components/common/NotFound'
import TagManager from 'react-gtm-module'
import { useQueryClient } from 'react-query'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserEventTracker from 'utils/firebase-analytics/UserEventTracker'
import RouteChangeTracker from 'utils/google-analytics/RouteChangeTracker'
import HealthCheck from 'views/HealthCheck'
import { useApiError } from './hooks/useApiError'
import AdminLayout from './layouts/admin'
import AuthLayout from './layouts/auth'
import Join from './layouts/join/join'
import Login from './layouts/login/login'

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
  TagManager.initialize({ gtmId: 'GTM-WP3XQ8RV' })
  RouteChangeTracker()
  UserEventTracker()

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
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <PrivateRoute path={`/admin`} component={AdminLayout} isAuthenticated={isAuthenticated} />
        <Route path={`/login`} component={Login} />
        <Route path={`/404`} component={NotFound} />
        <Route path={`/500`} component={NetworkError} />
        <Route path={`/health`} component={HealthCheck} />
        <Route path={`/join`} component={Join} />
        <Redirect from="/" to="/login" />
      </Switch>
    </>
  )
}

export default App
