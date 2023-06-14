import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import MainDashboardInterval from './hmid_Interval'

export default function HmidInterval() {
  const theme = useColorModeValue('navy.700', 'white')

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <MainDashboardInterval />
      </Box>
    </>
  )
}
