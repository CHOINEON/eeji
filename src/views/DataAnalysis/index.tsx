import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import AutoGrid from './Tag/AutoGrid'
import TagList from './Tag/TagList'
import TagListGrid from './Tag/TagListGrid'
import Worksheet from './Worksheet'
import './style/uploader.css'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'
import ChartDataSelection from './Chart/ChartDataSelection'

export const DataAnalysis = () => {
  const [tabValue, setTabValue] = React.useState(2)

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue)
  }

  return (
    <Box
      id="targetElement"
      // pt={{ base: '130px', md: '80px', xl: '80px' }}
      // style={{ position: 'relative', zIndex: 1000 }}
    >
      <Grid h="700px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={2} colSpan={1} bg="lightpink" h={700}>
          <GridItem colSpan={4} borderColor={'white'} h={200}>
            <p>Explorer</p>
          </GridItem>
          <GridItem bg="tomato" colSpan={4} h={500}>
            <TagList />
          </GridItem>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} h={700}>
          <GridItem rowSpan={1} bg="papayawhip" h={500}>
            <h2>chart worksheet</h2>
            <ChartDataSelection />
          </GridItem>
          <GridItem rowSpan={1} bg="papayawhip">
            <SeriesSelectionGrid />
          </GridItem>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default DataAnalysis
