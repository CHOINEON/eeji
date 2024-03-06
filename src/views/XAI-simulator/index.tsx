/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import AnalysisResult from './AnalysisResult'
import { customModelStore, xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import HistorySidebar from 'components/sidebar/HistorySidebar'
import Page from 'components/progressbar/page'

const XAIsimulator = () => {
  const analysisResult = useRecoilValue(xaiResultStore)

  // useEffect(() => {
  //   console.log('result:', analysisResult.data)
  // }, [analysisResult])

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
        {analysisResult?.sample_size > 0 ? <AnalysisResult /> : <UploadPage />}
        {/* <AnalysisResult data={data_short} /> */}
        {/* <Page /> */}
      </Box>
    </>
  )
}

export default XAIsimulator
