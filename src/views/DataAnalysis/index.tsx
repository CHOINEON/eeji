import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import TagList from './Tag/TagList'
import TagListGrid from './Tag/TagListGrid'
import Worksheet from './Worksheet'
import './style/uploader.css'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'
import ChartDataSelection from './Chart/ChartDataSelection'
import DatabaseNavigator from './Tag/DatabaseNavigator'
import axios from 'axios'
import ChartSelectionDialog from './ChartSelectionDialog'

export const DataAnalysis = (props: any) => {
  const { onClickNext } = props
  const [tabValue, setTabValue] = React.useState(2)
  const [selectedTags, setSelectedTags] = React.useState([])

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue)
  }

  const onClickTag = (e: any) => {
    // console.log('any:', e)
    setSelectedTags(e)
  }

  return (
    <Box
      id="targetElement"
      // pt={{ base: '130px', md: '80px', xl: '80px' }}
      // style={{ position: 'relative', zIndex: 1000 }}
    >
      <Grid h="700px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={2} colSpan={1} bg="lightpink" h={700}>
          {/* <GridItem colSpan={4} borderColor={'white'} h={200}>
            <DatabaseNavigator />
          </GridItem> */}
          <GridItem bg="tomato" colSpan={4} h={700}>
            <TagList syncSelectedTag={onClickTag} />
          </GridItem>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} h={700}>
          <GridItem rowSpan={1} h={450} border={'1px solid lightgray'} mb={50}>
            <Worksheet selectedTags={selectedTags} count={selectedTags.length} />
          </GridItem>
          <GridItem rowSpan={1}>
            <SeriesSelectionGrid selectedTags={selectedTags} />
          </GridItem>
        </GridItem>
      </Grid>
      {/* <ChartSelectionDialog isShow={true} /> */}
    </Box>
  )
}

export default DataAnalysis
