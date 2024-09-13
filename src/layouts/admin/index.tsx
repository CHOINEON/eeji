// Chakra imports
import Footer from 'components/footer/FooterAdmin'
import Header from 'components/navbar/Header'
// Layout components
// import Navbar from 'components/navbar/NavbarAdmin'
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from 'routes'
import MainContents from 'views/Main/Main'

// Custom Chakra theme
export default function Main() {
  document.documentElement.dir = 'ltr'

  const isMain = () => {
    return window.location.pathname === '/admin/main'
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
    <div className="relative w-[1280px] mx-auto">
      <div className="w-[1340px] m-auto">
        <Header routes={routes}></Header>
        {isMain() ? (
          <>
            <div className="my-[10px] mx-[30px] min-h-[780px]">
              <MainContents />
            </div>
            <div className="absolute bottom-[70px] w-[1280px] text-center background-red">
              <Footer />
            </div>
          </>
        ) : (
          <div className=" w-[1340px] min-h-[860px] bg-[#F3F7FE] rounded-[25px]">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/" to="/admin/main" />
            </Switch>
          </div>
        )}
      </div>
    </div>
  )
}
