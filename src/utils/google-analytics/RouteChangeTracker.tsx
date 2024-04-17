import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

/**
 * uri 변경 추적 컴포넌트
 * uri가 변경될 때마다 pageview 이벤트 전송
 */

const RouteChangeTracker = () => {
  const [initialized, setInitialized] = useState(false)
  const location = useLocation()

  //localhost 실행 시 추적 방지
  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
      setInitialized(true)
    }
  }, [])

  //초기화 완료 후 location변화 추적하고 pageview 이벤트 발생
  useEffect(() => {
    if (initialized) {
      ReactGA.set({ page: location.pathname })
      ReactGA.send(location.pathname + location.search)
    }
  }, [initialized, location])

  // 개발용
  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
    ReactGA.set({ page: location.pathname })
    ReactGA.send('pageview')
  }, [location])
}

export default RouteChangeTracker
