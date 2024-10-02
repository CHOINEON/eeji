// Chakra imports
import Footer from 'components/footer/FooterAdmin'
import Header from 'components/navbar/Header'
// Layout components
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from 'routes'

// Custom Chakra theme
export default function Main() {
  document.documentElement.dir = 'ltr'

  const needBackgroundBox = () => {
    return window.location.pathname === '/admin/main' || window.location.pathname === '/admin/mypage'
  }

  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === '/admin') {
        return <Route path={route.layout + route.path} component={route.component} key={key} />
      } else {
        return null
      }
    })
  }

  return (
    <>
      <div className="relative w-[1280px] mx-auto">
        <div className="w-[1280px] m-auto">
          <Header routes={routes}></Header>
          {needBackgroundBox() ? (
            <div className="my-[10px] mx-[30px] min-h-[780px]">{getRoutes(routes)}</div>
          ) : (
            <div className="w-[1280px] min-h-screen bg-[#F3F7FE] rounded-[25px]">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/" to="/admin/main" />
              </Switch>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-0 m-auto text-center">
        <Footer />
      </div>
    </>
  )
}
