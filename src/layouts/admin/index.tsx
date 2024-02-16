// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react'
import ConfirmDialog from 'components/dialogs/ConfirmDialog'
import Footer from 'components/footer/FooterAdmin'
import NavBar from 'components/navbar/NavBar'
import AdminNavbar from 'components/navbar/NavbarAdmin'
import HistorySidebar from 'components/sidebar/HistorySidebar'
// Layout components
// import Navbar from 'components/navbar/NavbarAdmin'
import Sidebar from 'components/sidebar/Sidebar'
import { SidebarContext } from 'contexts/SidebarContext'
import { useState } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import routes from 'routes'
import Main from 'views/Main/Main'

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props
  // states and functions
  const [fixed] = useState(false)

  const [toggleSidebar, setToggleSidebar] = useState(false)
  // functions for changing the states from components

  const location = useLocation()

  const getRoute = () => {
    return window.location.pathname !== '/admin/main'
  }

  const getActiveRoute = (routes: RoutesType[]): string => {
    const activeRoute = 'Default Brand Text'
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name
      }
    }
    return activeRoute
  }
  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    const activeNavbar = false
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary
      }
    }
    return activeNavbar
  }
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    const activeNavbar = false
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name
      }
    }
    return activeNavbar
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
  document.documentElement.dir = 'ltr'
  const { onOpen } = useDisclosure()

  return (
    <Box position="fixed" left={0} right={0} top={0} bottom={0}>
      {/* <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      > */}
      <ConfirmDialog>
        {/* <Sidebar routes={routes} display="none" {...rest} /> */}
        <NavBar routes={routes} />
        {getRoute() ? (
          location.pathname === '/admin/data-analysis' ? (
            <Box
              ml="290px"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="90vh"
              pt="50px"
              overflow="auto"
              height="90vh"
            >
              <HistorySidebar />
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/" to="/admin/main" />
              </Switch>
            </Box>
          ) : (
            <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="90vh" pt="50px">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/" to="/admin/main" />
              </Switch>
            </Box>
          )
        ) : (
          <>
            <Box
              mx="auto"
              h="100vh"
              p={{ base: '20px', md: '40px' }}
              // pe="20px"
              // minH="94vh"
              // maxH="90vh"
              // pt="50px"
              background={'linear-gradient(to left, #4338f7, #000000)'}
            >
              <Main />
              <Footer />
            </Box>
          </>
        )}
      </ConfirmDialog>
      {/* </SidebarContext.Provider> */}
    </Box>
  )
}
