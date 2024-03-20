import React from 'react'
import { Box } from '@chakra-ui/react'
import OilPriceChart from './OilPriceForecastingChart'
import Page from './page'

const PriceForecasting = () => {
  return (
    <Box pt={{ base: '130px', md: '40px', xl: '40px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/* <OilPriceChart /> */}
      <Page />
    </Box>
  )
}

export default PriceForecasting
