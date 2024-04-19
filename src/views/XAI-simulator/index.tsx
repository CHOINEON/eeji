/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Box } from '@chakra-ui/react'
import { useEffect } from 'react'
import TagManager, { DataLayerArgs } from 'react-gtm-module'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { xaiResultStore } from './store/analyze/atom'
import UploadPage from './UploadPage'
import XaiAnalysisResult from './XaiAnalysisResult'

const XAIsimulator = () => {
  const [analysisResult, setAnalysisResult] = useRecoilState(xaiResultStore)
  const resetAnalysisResult = useResetRecoilState(xaiResultStore)

  useEffect(() => {
    resetAnalysisResult()

    const args: DataLayerArgs = {
      dataLayer: {
        event: 'virtualPageView',
        pageUrl: '/xai-simulator',
        pageTitle: 'XAI',
      },
    }
    TagManager.dataLayer(args)
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
