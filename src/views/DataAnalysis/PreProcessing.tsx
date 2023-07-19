import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Button from '@mui/material/Button'
import TagList from './Tag/TagList'
import Worksheet from './components/Worksheets/Worksheet'
import './style/uploader.css'
import SeriesSelectionGrid from './Tag/SeriesSelectionGrid'
import { stepCountStore } from './store/atom'
import { useSetRecoilState } from 'recoil'

export const PreProcessing = (props: any) => {
  const { onPreprocessed } = props
  const [refresh] = useState(false)
  const [chartType] = React.useState('')
  const [selectedTags, setSelectedTags] = React.useState([])
  const setActiveStep = useSetRecoilState(stepCountStore)

  const onClickTag = (e: any) => {
    // console.log('onClickTag:', e)
    setSelectedTags(e)
  }

  // AI EXPO 데모용 csv export function
  // const handleExport = () => {
  //   setExported(true)
  //   setTimeout(() => setExported(false), 3000)
  // }

  const handleSaveAndNext = () => {
    setActiveStep(3)
  }

  const onClickSave = (e: any) => {
    if (e.length > 0) {
      onPreprocessed(e)
    }
  }

  return (
    <div id="targetElement" style={{ position: 'relative', zIndex: 1000 }}>
      <Grid h="700px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={2} colSpan={1} h={700}>
          <TagList syncSelectedTag={onClickTag} refresh={refresh} />
        </GridItem>
        <GridItem rowSpan={2} colSpan={4} h={700}>
          <GridItem rowSpan={1} h={450} mb={50}>
            <Worksheet
              selectedTags={selectedTags}
              count={selectedTags.length}
              chart={chartType}
              refresh={refresh}
              onSave={onClickSave}
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <SeriesSelectionGrid selectedTags={selectedTags} refresh={refresh} />
            <Button
              variant="contained"
              onClick={handleSaveAndNext}
              style={{
                width: '8%',
                height: '200px',
                display: 'block',
                float: 'left',
                borderRadius: '18px',
                marginLeft: '20px',
              }}
            >
              SAVE AND NEXT
            </Button>
          </GridItem>
        </GridItem>
      </Grid>
    </div>
  )
}

export default PreProcessing
