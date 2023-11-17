import React from 'react'
import { Box } from '@chakra-ui/react'
import ForecastVisualization from '../ForecastVisualization'
import OilPriceChart from './OilPriceForecastingChart'
import styled from '@emotion/styled'

const PriceForecasting = () => {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/* <RoundBox> */}
      <OilPriceChart />
      {/* </RoundBox> */}
    </Box>
  )
}

export default PriceForecasting
