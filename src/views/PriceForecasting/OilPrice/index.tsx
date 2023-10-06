import React from 'react'
import { Box } from '@chakra-ui/react'
import ForecastVisualization from '../ForecastVisualization'
import OilPriceChart from './OilPriceForecastingChart'
import Test from '../Test'
import styled from '@emotion/styled'

const RoundBox = styled.div`
  height: 500px;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 18px;
  opacity: 1;
  background-color: white;
`

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
