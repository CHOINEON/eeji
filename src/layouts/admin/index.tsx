// Chakra imports
import Footer from 'components/footer/FooterAdmin'
import Header from 'components/navbar/Header'
// Layout components
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from 'routes'

// Custom Chakra theme
export default function Main() {
  document.documentElement.dir = 'ltr'

  const needFullScreenBox = () => {
    const needScreenWidthRoutes = routes
      .filter((value) => value.widthScreen === true)
      .map((item) => item.layout + item.path)

    return Boolean(needScreenWidthRoutes.includes(window.location.pathname))
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
      <div className={`relative ${needFullScreenBox() ? '' : 'w-[1280px] mx-auto'}`}>
        <div className={`${needFullScreenBox() ? '' : 'w-[1280px] m-auto'}`}>
          <Header routes={routes}></Header>
          {needFullScreenBox() ? (
            <div className="min-h-[780px]">{getRoutes(routes)}</div>
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
