/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, useColorModeValue, Stack, Button } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import React from 'react'

export default function Configuration() {
  //권한
  const [AdminInfo, setAdminInfo] = React.useState('block')

  const theme = useColorModeValue('navy.700', 'white')
  // console.log(theme)

  //새로고침 막기
  // const preventClose = (e: BeforeUnloadEvent) => {
  //   e.preventDefault()
  //   e.returnValue = '' //Chrome에서 동작하도록; deprecated
  // }

  // React.useEffect(() => {
  //   ;(() => {
  //     window.addEventListener('beforeunload', preventClose)
  //   })()

  //   return () => {
  //     window.removeEventListener('beforeunload', preventClose)
  //   }
  // }, [])
  //end 새로고침 막기

  // #ffffff0f

  // const NotReload = () => {
  //   if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || (event.keyCode == 116) ) {
  //     event.keyCode = 0;
  //     event.cancelBubble = true;
  //     event.returnValue = false;
  // }
  // }

  // document.onkeydown = NotReload()

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <Tabs variant="unstyled">
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Tab 1</Tab>
            <Tab _selected={{ color: 'white', bg: 'green.400' }}>Tab 2</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>기본</p>
            </TabPanel>
            <TabPanel>
              <p>고급</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}
