import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import MainDashboardIntervalD3FC from './hmid_interval-d3fc'
import { RecoilRoot } from 'recoil'

export default function HmidIntervalD3() {
  const theme = useColorModeValue('navy.700', 'white')

  return (
    <RecoilRoot>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <MainDashboardIntervalD3FC />
      </Box>
    </RecoilRoot>
  )
}
