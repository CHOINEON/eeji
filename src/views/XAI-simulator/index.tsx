/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import AnalysisResult from './AnalysisResult'
import { xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'

const XAIsimulator = () => {
  const [analysisResult, setAnalysisResult] = useRecoilState(xaiResultStore)

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
        {analysisResult.feature_length > 0 ? <AnalysisResult /> : <UploadPage />}
        {/* <AnalysisResult /> */}
        {/* <Page /> */}
      </Box>
    </>
  )
}

export default XAIsimulator
