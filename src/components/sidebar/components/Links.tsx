/* eslint-disable */

import { NavLink, useLocation } from 'react-router-dom'
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Icon } from '@chakra-ui/react'
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx'
import React from 'react'

export function SidebarLinks(props: { routes: RoutesType[] }) {
  const [toggleIcon, setToggleIcon] = React.useState('0')
  const [toggleState, setToggleState] = React.useState(false)
  //   Chakra color mode
  let location = useLocation()
  let activeColor = useColorModeValue('white', 'white')
  let inactiveColor = useColorModeValue('secondaryGray.600', 'secondaryGray.600')
  let activeIcon = useColorModeValue('white', 'white')
  let textColor = useColorModeValue('#cacaca', 'white')
  let brandColor = useColorModeValue('white', 'brand.400')

  const { routes } = props

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName)
  }

  console.log('[ Linek User Auth ]')
  console.log(window.localStorage.getItem('userPosition'))

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route: RoutesType, index: number) => {
      // if (route.layout === '/admin' || route.layout === '/rtl') {
      if (window.localStorage.getItem('userPosition') === 'admin') {
        if (route.path !== '/maindashboard' && route.path !== '/layout-configuration') {
          // if (route.path !== '/maindashboard') {
          return (
            <NavLink key={index + route.path} to={route.layout + route.path}>
              {route.icon ? (
                <Box key={index}>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor} me="18px">
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
                        fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h="36px"
                      w="4px"
                      bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box key={index}>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
                    <Text
                      me="auto"
                      color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
                      fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                    >
                      {route.name}
                    </Text>
                    <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                  </HStack>
                </Box>
              )}
            </NavLink>
          )
        }
      } else {
        if (route.path !== '/layout-list' && route.path !== '/layout-configuration') {
          // if (route.path === '/layout-configuration') {
          return (
            <NavLink key={index + route.path} to={route.layout + route.path}>
              {route.icon ? (
                <Box key={index}>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor} me="18px">
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
                        fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h="36px"
                      w="4px"
                      bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box key={index}>
                  <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
                    <Text
                      me="auto"
                      color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
                      fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                    >
                      {route.name}
                    </Text>
                    <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                  </HStack>
                </Box>
              )}
            </NavLink>
          )
        }
      }
      // else if (route.path === '/layoutsetting') {
      //   return (
      //     <Box key={index}>
      //       {route.icon ? (
      //         <Box>
      //           <HStack
      //             spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
      //             py="5px"
      //             ps="10px"
      //             onClick={() => {
      //               if (toggleIcon === '100%') {
      //                 setToggleIcon('0')
      //                 setToggleState(false)
      //               } else {
      //                 setToggleIcon('100%')
      //                 setToggleState(true)
      //               }
      //             }}
      //           >
      //             <Flex w="100%" alignItems="center" justifyContent="center">
      //               <Box color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor} me="18px">
      //                 {route.icon}
      //               </Box>
      //               <Text
      //                 me="auto"
      //                 color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
      //                 fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
      //               >
      //                 {route.name}
      //               </Text>
      //               {/* <Box
      //               h="36px"
      //               w="4px"
      //               bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
      //               borderRadius="5px"
      //             /> */}
      //               <Box
      //                 mr="10px"
      //                 style={{ cursor: 'pointer' }}
      //                 color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
      //               >
      //                 <Icon
      //                   as={toggleState ? RxTriangleUp : RxTriangleDown}
      //                   width="20px"
      //                   height="20px"
      //                   color="inherit"
      //                 />
      //               </Box>
      //             </Flex>
      //           </HStack>
      //           <NavLink
      //             key={index}
      //             to={route.sub[0].layout + route.path}
      //             style={{ height: toggleIcon, transition: 'all 0.2s ease-out', overflow: 'hidden', display: 'block' }}
      //           >
      //             <HStack
      //               spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
      //               py="5px"
      //               ps="10px"
      //               ml="17px"
      //             >
      //               <Flex w="100%" alignItems="center" justifyContent="center">
      //                 <Box color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor} me="18px">
      //                   {route.icon}
      //                 </Box>
      //                 <Text
      //                   me="auto"
      //                   color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
      //                   fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
      //                 >
      //                   {route.sub[0].name}
      //                 </Text>
      //               </Flex>
      //               <Box
      //                 h="36px"
      //                 w="4px"
      //                 bg={activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent'}
      //                 borderRadius="5px"
      //               />
      //             </HStack>
      //           </NavLink>
      //         </Box>
      //       ) : (
      //         <Box>
      //           <HStack spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'} py="5px" ps="10px">
      //             <Text
      //               me="auto"
      //               color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
      //               fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
      //             >
      //               {route.name}
      //             </Text>
      //             <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
      //           </HStack>
      //         </Box>
      //       )}
      //     </Box>
      //   )
      // }
    })
  }
  //  BRAND
  return <>{createLinks(routes)}</>
}

export default SidebarLinks
