import React, { useState, useEffect, useReducer } from 'react'
import { Box, Grid, GridItem, Button } from '@chakra-ui/react'
import TagList from './Tag/TagList'
import Worksheet from './components/Worksheets/Worksheet'
import './style/uploader.css'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'
import ChartSelectionDialog from './components/Chart/ChartSelectionDialog'

export const DataAnalysis = (props: any) => {
  const { onRefresh } = props
  const [refresh, setRefresh] = useState(false)
  const [tabValue, setTabValue] = React.useState(2)
  const [selectedTags, setSelectedTags] = React.useState([])
  const [chartType, setChartType] = React.useState('')

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue)
  }

  const onClickTag = (e: any) => {
    // console.log('onClickTag:', e)
    setSelectedTags(e)
  }

  const handleSave = () => {
    setRefresh(true)
    onRefresh(true)
  }

  return (
    <Box
      id="targetElement"
      // pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{ position: 'relative', zIndex: 1000 }}
    >
      <Grid h="700px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={2} colSpan={1} bg="lightpink" h={700}>
          {/* <GridItem colSpan={4} borderColor={'white'} h={200}>
            <DatabaseNavigator />
          </GridItem> */}
          <GridItem bg="tomato" colSpan={4} h={700}>
            <TagList syncSelectedTag={onClickTag} refresh={refresh} />
          </GridItem>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} h={700}>
          <GridItem rowSpan={1} h={450} border={'1px solid lightgray'} mb={50}>
            <Worksheet selectedTags={selectedTags} count={selectedTags.length} chart={chartType} refresh={refresh} />
          </GridItem>
          <GridItem rowSpan={1}>
            <SeriesSelectionGrid selectedTags={selectedTags} refresh={refresh} />
          </GridItem>
        </GridItem>
      </Grid>
      {/* <div style={{ textAlign: 'right' }}>
        <Button colorScheme="teal" variant="ghost" onClick={handleSave}>
          SAVE
        </Button>
      </div> */}
      {/* <ChartSelectionDialog isOpen={dialogOpen} onDialogClose={dialogClose} onSelectChart={onSelectChart} /> */}
    </Box>
  )
}

export default DataAnalysis
