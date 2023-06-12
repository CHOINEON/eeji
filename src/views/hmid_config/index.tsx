import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import PredefinedLayoutsConfiguration from './grid/GridLayoutConfiguration'
import { RecoilRoot } from 'recoil'

export default function LayoutConfig() {
  const theme = useColorModeValue('navy.700', 'white')

  return (
    <RecoilRoot>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
        <PredefinedLayoutsConfiguration />
      </Box>
    </RecoilRoot>
  )
}
