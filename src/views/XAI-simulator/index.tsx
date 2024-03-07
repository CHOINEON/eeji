/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import AnalysisResult from './AnalysisResult'
import { customModelStore, xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import HistorySidebar from 'components/sidebar/HistorySidebar'
import Page from 'components/progressbar/page'
import PDP_Plot from './components/PDP_Plot'

const XAIsimulator = () => {
  const [analysisResult, setAnalysisResult] = useRecoilState(xaiResultStore)

  // useEffect(() => {
  //   setAnalysisResult(data_short)
  // }, [])

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
        {Object.keys(analysisResult).length > 0 ? <AnalysisResult /> : <UploadPage />}
        {/* <AnalysisResult /> */}
        {/* <Page /> */}
      </Box>
    </>
  )
}

export default XAIsimulator
