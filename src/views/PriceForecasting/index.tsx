import React from 'react'
import { Box } from '@chakra-ui/react'
import ForecastVisualization from './ForecastVisualization'
import TestChart from './TestPlotVisualization'
import Test from './Test'

const PriceForecasting = () => {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} style={{ position: 'relative', zIndex: 1000 }}>
      {/* <ForecastVisualization /> */}
      <TestChart />
      {/* <Test /> */}
    </Box>
  )
}

export default PriceForecasting
