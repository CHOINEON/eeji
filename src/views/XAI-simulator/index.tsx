/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import XaiAnalysisResult from './XaiAnalysisResult'
import { customModelStore, xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'

const XAIsimulator = () => {
  const [analysisResult, setAnalysisResult] = useRecoilState(xaiResultStore)
  const resetAnalysisResult = useResetRecoilState(xaiResultStore)

  useEffect(() => {
    resetAnalysisResult()
  }, [])

  return (
    <>
      <Box style={{ position: 'relative', zIndex: 1000, width: '100%', height: '100%' }}>
        {analysisResult?.feature_length > 0 ? <XaiAnalysisResult /> : <UploadPage />}
        {/* <AnalysisResult /> */}
        {/* <Page /> */}
      </Box>
    </>
  )
}

export default XAIsimulator
