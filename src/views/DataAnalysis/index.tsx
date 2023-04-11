import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import AutoGrid from './Tag/AutoGrid'
import TagList from './Tag/TagList'
import TagListGrid from './Tag/TagListGrid'
import Worksheet from './Worksheet'
import './style/uploader.css'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export const DataAnalysis = () => {
  const [tabValue, setTabValue] = React.useState(2)

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue)
  }

  return (
    <Box
      id="targetElement"
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      style={{ position: 'relative', zIndex: 1000 }}
    >
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Preprocessing"></Tab>
        <Tab label="Data Analysis"></Tab>
      </Tabs>
    </Box>
  )
}

export default DataAnalysis
