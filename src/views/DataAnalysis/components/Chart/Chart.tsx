import React from 'react'
import DataSelection from './ChartDataSelection'
import EditingData from './EditingData'
import { DropDownButton, DropDownButtonComponent, ItemModel } from '@syncfusion/ej2-react-splitbuttons'
import { Box, useColorModeValue, Stack, Button } from '@chakra-ui/react'

export const Chart = () => {
  const items: ItemModel[] = [{ text: 'RangeSelection' }, { text: 'EditingData' }]

  const handleClick = (e: any) => {
    console.log('e:', e)
  }

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <DropDownButtonComponent items={items} onClick={handleClick}>
          기능 선택
        </DropDownButtonComponent>
      </Box>
      <DataSelection />
      <EditingData />
    </>
  )
}

export default Chart
