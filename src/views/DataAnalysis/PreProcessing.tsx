import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Button from '@mui/material/Button'
import TagList from './Tag/TagList'
import Worksheet from './components/Worksheets/Worksheet'
import './style/uploader.css'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'

export const PreProcessing = (props: any) => {
  const { onRefresh } = props
  const [refresh] = useState(false)
  const [selectedTags, setSelectedTags] = React.useState([])
  const [chartType] = React.useState('')
  // const WorksheetRef = useRef(null)
  const [exported, setExported] = useState(false)

  const onClickTag = (e: any) => {
    // console.log('onClickTag:', e)
    setSelectedTags(e)
  }

  const handleExport = () => {
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  return (
    <div id="targetElement" style={{ position: 'relative', zIndex: 1000 }}>
      <Grid h="700px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={2} colSpan={1} bg="lightpink" h={700}>
          {/* <GridItem colSpan={4} borderColor={'white'} h={200}>
            <DatabaseNavigator />
          </GridItem> */}
          <GridItem colSpan={4} h={700}>
            <TagList syncSelectedTag={onClickTag} refresh={refresh} />
            {/* <TagListView /> */}
          </GridItem>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} h={700}>
          <GridItem rowSpan={1} h={450} border={'1px solid lightgray'} mb={50}>
            <Worksheet
              // ref={WorksheetRef}
              selectedTags={selectedTags}
              count={selectedTags.length}
              chart={chartType}
              refresh={refresh}
              onExport={exported}
            />
            {/* <Child ref={WorksheetRef}></Child> */}
          </GridItem>
          <GridItem rowSpan={1}>
            <SeriesSelectionGrid selectedTags={selectedTags} refresh={refresh} />
          </GridItem>
        </GridItem>
      </Grid>

      <div style={{ width: '400px', float: 'right' }}>
        <Box className="upload_wrapper" style={{ float: 'right', maxWidth: '400px', margin: 'auto' }}>
          <Button onClick={handleExport}>SAVE & CSV EXPORT</Button>
          {/* <CircularProgress style={{ position: 'relative', top: '200px' }} /> */}
        </Box>
      </div>
      {/* <ChartSelectionDialog isOpen={dialogOpen} onDialogClose={dialogClose} onSelectChart={onSelectChart} /> */}
    </div>
  )
}

export default PreProcessing
