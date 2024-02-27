import React from 'react'
import { Box } from '@chakra-ui/react'
import OilPriceChart from './OilPriceForecastingChart'

const PriceForecasting = () => {
  return (
    <Box pt={{ base: '130px', md: '40px', xl: '40px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/* <RoundBox> */}
      <OilPriceChart />
      {/* </RoundBox> */}
    </Box>
  )
}

export default PriceForecasting
