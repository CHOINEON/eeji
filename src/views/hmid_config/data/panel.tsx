import React from 'react'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid' // Grid version 1
import panelData from './panel-data_config'

import { useRecoilState, useRecoilValue } from 'recoil'
import * as RecoilAtoms from '../recoil/config/atoms'

export const GridLayoutTest: React.FC = () => {
  const panelIdx = useRecoilValue(RecoilAtoms.PanelIdxState)
  const renderGrid = () => {
    const result: any = []

    for (let i = 0, len = panelData[panelIdx].length; i < len; i++) {
      result.push(
        <Grid item xs={panelData[panelIdx].size}>
          <div>
            <div>Widget</div>
            <div>Data</div>
          </div>
        </Grid>
      )
    }

    console.log(result)

    return result
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={8}></Grid>
          <Grid xs={4}></Grid>
          <Grid xs={4}></Grid>
          <Grid xs={8}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default GridLayoutTest
