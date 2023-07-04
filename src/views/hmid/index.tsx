/**
 * 2023-07-04 박윤희
 * Main Dashboard 화면(user 권한)
 * 권한 설정은 router에서 적용해야합니다.
 */

import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { MainDashboardWS } from './hmid_ws'

export default function HMID() {
  const theme = useColorModeValue('navy.700', 'white')

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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      <MainDashboardWS />
    </Box>
  )
}
